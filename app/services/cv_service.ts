import fs from 'fs'
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs'
import { DOMMatrix } from 'canvas'
import HttpException from '#exceptions/http_exception'
import { Infer } from '@vinejs/vine/types'
import { CvAnalyzeSchema } from '#validators/cv_validator'

  ; import User from '#models/user'
import nodemationApiConfig from '../api/nodemation_api.js'
import logger from '@adonisjs/core/services/logger'
import pricingEngine from '../utils/pricing_engine.js'
(global as any).DOMMatrix = DOMMatrix

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

function normalizeTextSpacing(text: string): string {
  return text
    .replace(/([a-zA-Z])([0-9])/g, '$1 $2')
    .replace(/([0-9])([a-zA-Z])/g, '$1 $2')
    .replace(/(SMK|SMP|SMA|PT|CV)([A-Z])/g, '$1 $2')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\s{2,}/g, '  ').trim()
}

function enhanceForAI(text: string): string {
  let t = text
  t = t.replace(/^(ABOUT ME|PROFILE|TENTANG SAYA|PROFIL)$|  (ABOUT ME|PROFILE|TENTANG SAYA|PROFIL)/gim, '\n\nABOUT_ME\n')
  t = t.replace(/^(SKILL|SKILLS|TECH STACK|KEAHLIAN|KETERAMPILAN)$|  (SKILL|SKILLS|TECH STACK|KEAHLIAN|KETERAMPILAN)/gim, '\n\nSKILLS\n')
  t = t.replace(/^(EXPERIENCE|WORK HISTORY|PENGALAMAN KERJA|RIWAYAT PEKERJAAN)$|  (EXPERIENCE|WORK HISTORY|PENGALAMAN KERJA|RIWAYAT PEKERJAAN)/gim, '\n\nEXPERIENCE\n')
  t = t.replace(/^(EDUCATION|ACADEMIC|PENDIDIKAN|RIWAYAT PENDIDIKAN)$|  (EDUCATION|ACADEMIC|PENDIDIKAN|RIWAYAT PENDIDIKAN)/gim, '\n\nEDUCATION\n')
  t = t.replace(/^(CERTIFICATE|CERTIFICATES|CERTIFICATION|SERTIFIKAT|PENGHARGAAN)$|  (CERTIFICATE|CERTIFICATES|CERTIFICATION|SERTIFIKAT|PENGHARGAAN)/gim, '\n\nCERTIFICATES\n')
  t = t.replace(/^(CURICULUM VITAE|CURRICULUM VITAE|CONTACT|KONTAK|HUBUNGI)$|  (CURICULUM VITAE|CURRICULUM VITAE|CONTACT|KONTAK|HUBUNGI)/gim, '\n\nCONTACT_HEADER\n')
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

  const website = allLinks.find(link => {
    const cleanLink = link.toLowerCase();
    const isEmailDomain = email && email.toLowerCase().includes(cleanLink);
    return !cleanLink.includes('@') && !isEmailDomain;
  }) || ''

  let name = headerSection.split('\n').filter(l => l.trim().length > 2)[0] || fullText.split('\n')[0]
  const roles = ['Web Developer', 'Software Engineer', 'Developer', 'Engineer', 'Designer', 'Programmer', 'Intern']
  roles.forEach(role => { name = name.replace(new RegExp(`\\b${role}\\b`, 'gi'), '').trim() })

  return {
    name: name.trim(),
    phone,
    email,
    website: website.trim(),
  }
}

export class CvService extends pricingEngine {
  async summarize(payload: Infer<typeof CvAnalyzeSchema>) {
    try {
      if (!payload.cv_file.tmpPath) throw new HttpException('Invalid file upload', 400)

      const buffer = fs.readFileSync(payload.cv_file.tmpPath)
      const data = new Uint8Array(buffer)
      const pdf = await pdfjsLib.getDocument({ data, disableFontFace: true }).promise

      let fullText = ''

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
          fullText += leftColumn.map(item => item.str).join(' ') + '\n'
          fullText += rightColumn.map(item => item.str).join(' ') + '\n'
        } else {
          items.sort((a, b) => (Math.abs(a.y - b.y) < 5) ? a.x - b.x : b.y - a.y)
          fullText += items.map(item => item.str).join(' ') + '\n'
        }
      }

      const normalized = fixSpacedLetters(fullText)
      const cleaned = cleanPdfText(normalized)
      const spaced = normalizeTextSpacing(cleaned)
      const enhanced = enhanceForAI(spaced)
      const sections = splitSections(enhanced)

      const parsedData = {
        header: parseHeader(spaced, sections.HEADER || ''),
        about_me: sections.ABOUT_ME?.replace(/\n/g, ' ').trim() || '',
        skills: sections.SKILLS?.split(/\n|  /).map(s => s.trim()).filter(s => s.length > 1) || [],
        experience: sections.EXPERIENCE?.split(/(?=\n[A-Z][a-z]+ [A-Z])|(?=\n\d{2}\/)/g).map(s => s.trim()).filter(s => s.length > 5) || [],
        education: sections.EDUCATION?.split(/(?=\d{4}\s*-\s*\d{4})/).map(s => s.trim()).filter(s => s.length > 5) || [],
        certificates: sections.CERTIFICATES?.split(/\n|  /).map(s => s.trim()).filter(s => s.length > 1) || [],
      }

      let md = `# ${parsedData.header.name.toUpperCase()}\n\n`;
      md += `**Phone:** ${parsedData.header.phone}  \n**Email:** ${parsedData.header.email}  \n`;
      if (parsedData.header.website) md += `**Website:** ${parsedData.header.website}  \n`;
      md += `\n---\n\n## PROFILE\n${parsedData.about_me}\n\n`;
      md += `## WORK EXPERIENCE\n${parsedData.experience.map(e => `* ${e}`).join('\n')}\n\n`;
      md += `## EDUCATION\n${parsedData.education.map(e => `* ${e}`).join('\n')}\n\n`;
      if (parsedData.skills.length) md += `## SKILLS\n${parsedData.skills.join(', ')}\n\n`;
      if (parsedData.certificates.length) md += `## CERTIFICATES\n${parsedData.certificates.map(c => `* ${c}`).join('\n')}`;

      return {
        raw_text: cleaned,
        parsed_json: parsedData,
        markdown_version: md.trim()
      }
    } catch (error: any) {
      throw new HttpException(error.message, error.status || 500)
    }
  }

  /**
   * Method to analyze CV File
   */
  async analyzeCvFile(payload: Infer<typeof CvAnalyzeSchema>, user: User) {
    try {
      const result = await this.summarize(payload)

      // send data to nodemation
      const data = {
        ...result,
        cv_lang: payload.cv_lang,
        language_style: payload.language_style
      }

      const n8nResponse = await nodemationApiConfig.post('/webhook/cv/analyze', data).then(res => res.data)

      logger.info(n8nResponse)

      const safeName = payload.cv_file.clientName
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-_]/g, '')

      const generateCvName = `${safeName}-${Date.now()}.${payload.cv_file.extname}`


      // move cv to storage
      await payload.cv_file.moveToDisk(`/cv-analyzer/${generateCvName}`, 'fs')

      // save ai response to db
      const aiCvAnalyzer = await user.related('aiCvAnalyzers').create({
        requestPayload: payload,
        cvRawText: result.raw_text,
        cvParsedJson: result.parsed_json,
        cvMarkdown: result.markdown_version,
        cvPath: `/cv-analyzer/${generateCvName}`,
        aiResponse: Array.isArray(n8nResponse) ? n8nResponse[0] : n8nResponse,
        aiModel: Array.isArray(n8nResponse) ? n8nResponse[0].result.ai_model : n8nResponse.result.ai_model,
      })

      let aiResponse = Array.isArray(n8nResponse) ? 'result' in n8nResponse[0] ? n8nResponse[0].result : n8nResponse[0] : n8nResponse

      // create ai payments

      return {
        selected_language: payload.cv_lang,
        language_style: payload.language_style,
        ai_response: {
          overallImpression: aiResponse.overallImpression,
          contactInformation: aiResponse.contactInformation,
        }
      }
    } catch (error) {
      throw new HttpException(error.message, error.status || 500)
    }
  }
}
