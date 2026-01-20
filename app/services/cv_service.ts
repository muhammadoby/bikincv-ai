import fs from 'fs'
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs'
import { DOMMatrix } from 'canvas'
import HttpException from '#exceptions/http_exception'
import { Infer } from '@vinejs/vine/types'
import { CvAnalyzeSchema } from '#validators/cv_validator'

; (global as any).DOMMatrix = DOMMatrix

function cleanPdfText(text: string): string {
  return text
    .replace(/\r/g, '')
    .replace(/\n{2,}/g, '\n')
    .replace(/[•●*❑\u2022\u2023\u25B6]/g, '-')
    .replace(/\s{2,}/g, '  ')
    .trim()
}

function fixSpacedLetters(text: string): string {
  return text.replace(/(?:^|\s)([A-Za-z0-9])(?:\s+([A-Za-z0-9])){2,}(?:\s+|$)/g, (match) => {
    return ' ' + match.replace(/\s+/g, '') + ' '
  }).replace(/\s{2,}/g, '  ')
}

function enhanceForAI(text: string): string {
  let t = text
  t = t.replace(/^(ABOUT ME|PROFILE|TENTANG SAYA|PROFIL)$|  (ABOUT ME|PROFILE|TENTANG SAYA|PROFIL)/gim, '\n\nABOUT_ME\n')
  t = t.replace(/^(SKILL|SKILLS|TECH STACK|KEAHLIAN|KETERAMPILAN)$|  (SKILL|SKILLS|TECH STACK|KEAHLIAN|KETERAMPILAN)/gim, '\n\nSKILLS\n')
  t = t.replace(/^(EXPERIENCE|WORK HISTORY|PENGALAMAN KERJA|RIWAYAT PEKERJAAN)$|  (EXPERIENCE|WORK HISTORY|PENGALAMAN KERJA|RIWAYAT PEKERJAAN)/gim, '\n\nEXPERIENCE\n')
  t = t.replace(/^(EDUCATION|ACADEMIC|PENDIDIKAN|RIWAYAT PENDIDIKAN)$|  (EDUCATION|ACADEMIC|PENDIDIKAN|RIWAYAT PENDIDIKAN)/gim, '\n\nEDUCATION\n')
  t = t.replace(/^(CERTIFICATE|CERTIFICATES|CERTIFICATION|SERTIFIKAT|PENGHARGAAN)$|  (CERTIFICATE|CERTIFICATES|CERTIFICATION|SERTIFIKAT|PENGHARGAAN)/gim, '\n\nCERTIFICATES\n')
  t = t.replace(/^(CURICULUM VITAE|CONTACT|KONTAK|HUBUNGI)$|  (CURICULUM VITAE|CONTACT|KONTAK|HUBUNGI)/gim, '\n\nCONTACT_HEADER\n')
  return t
}

function splitSections(text: string) {
  const sections: Record<string, string> = {}
  let current = 'HEADER'

  const lines = text.split('\n')
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) continue

    const markers = ['ABOUT_ME', 'SKILLS', 'EXPERIENCE', 'EDUCATION', 'CERTIFICATES', 'CONTACT_HEADER']
    if (markers.includes(trimmed)) {
      current = trimmed
      sections[current] = ''
      continue
    }

    sections[current] = (sections[current] || '') + '\n' + trimmed
  }

  return sections
}

function parseHeader(fullText: string, headerSection: string) {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
  const emailMatch = fullText.match(emailRegex)
  const email = emailMatch ? emailMatch[0] : ''

  const phoneRegex = /\+?\d[\d\s-]{8,14}\d/g
  const phoneMatch = fullText.match(phoneRegex)
  const phone = phoneMatch ? phoneMatch[0].trim() : ''

  const websiteRegex = /(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+\.[a-z]{2,}(?:\.[a-z]{2,})?/gi
  const allLinks = fullText.match(websiteRegex) || []
  const website = allLinks.find(link =>
    !link.includes('@') &&
    (!email || !email.toLowerCase().includes(link.toLowerCase()))
  ) || ''

  let name = headerSection.split('\n').filter(l => l.trim().length > 2)[0]?.trim() || 'Kandidat';

  const roles = ['Web Developer', 'Software Engineer', 'Developer', 'Engineer', 'Designer', 'Programmer', 'Intern', 'Student'];
  roles.forEach(role => {
    const regex = new RegExp(`\\b${role}\\b`, 'gi');
    name = name.replace(regex, '').trim();
  });

  return {
    name: name,
    phone,
    email,
    website: website.trim(),
  }
}

function parseSkillsArray(text: string): string[] {
  if (!text) return []
  return text
    .split(/\n|  /)
    .map(s => s.replace(/^-/, '').trim())
    .filter(s => s.length > 1)
}

function parseExperienceArray(text: string): string[] {
  if (!text) return []
  return text
    .split(/(?=\n[A-Z][a-z]+ [A-Z])|(?=\n\d{2}\/)|(?=\n- )/g)
    .map(s => s.trim())
    .filter(s => s.length > 5)
}

function parseEducationArray(text: string): string[] {
  if (!text) return []
  return text
    .split(/(?=\d{4}\s*-\s*\d{4})/)
    .map(s => s.trim())
    .filter(s => s.length > 5)
}

export class CvService {
  async summarize(payload: Infer<typeof CvAnalyzeSchema>) {
    try {
      if (!payload.cv_file.tmpPath) throw new HttpException('Invalid file upload', 400)

      const buffer = fs.readFileSync(payload.cv_file.tmpPath)
      const data = new Uint8Array(buffer)
      const pdf = await pdfjsLib.getDocument({ data, disableFontFace: true }).promise

      let fullExtractedText = ''

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const content = await page.getTextContent()
        const viewport = page.getViewport({ scale: 1.0 })
        const midPoint = viewport.width * 0.4

        const items = content.items.map((item: any) => ({
          str: item.str,
          x: item.transform[4],
          y: item.transform[5],
          width: item.width || 0
        }))

        const itemsCrossingMid = items.filter(item => item.x < midPoint && (item.x + item.width) > midPoint)
        const isMultiColumn = itemsCrossingMid.length < (items.length * 0.15)

        if (isMultiColumn) {
          const leftColumn = items.filter(item => item.x < midPoint).sort((a, b) => b.y - a.y)
          const rightColumn = items.filter(item => item.x >= midPoint).sort((a, b) => b.y - a.y)
          fullExtractedText += leftColumn.map(item => item.str).join('\n') + '\n'
          fullExtractedText += rightColumn.map(item => item.str).join('\n') + '\n'
        } else {
          items.sort((a, b) => (Math.abs(a.y - b.y) < 5) ? a.x - b.x : b.y - a.y)
          fullExtractedText += items.map(item => item.str).join('\n') + '\n'
        }
      }

      const normalized = fixSpacedLetters(fullExtractedText)
      const cleaned = cleanPdfText(normalized)
      const enhanced = enhanceForAI(cleaned)
      const sections = splitSections(enhanced)

      return {
        raw_text: cleaned,
        header: parseHeader(cleaned, sections.HEADER || ''),
        about_me: sections.ABOUT_ME?.replace(/\n/g, ' ').trim() || '',
        skills: parseSkillsArray(sections.SKILLS || ''),
        experience: parseExperienceArray(sections.EXPERIENCE || ''),
        education: parseEducationArray(sections.EDUCATION || ''),
        certificates: parseSkillsArray(sections.CERTIFICATES || ''),
      }
    } catch (error: any) {
      throw new HttpException(error.message, error.status || 500)
    }
  }
}
