import HttpException from '#exceptions/http_exception'
import { CvAnalyzeSchema } from '#validators/cv_validator'
import { Infer } from '@vinejs/vine/types'
import { execSync } from 'child_process'
import fs from 'fs'
import os from 'os'
import path from 'path'
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs'
import pricingEngine from './pricing_engine.js'
import logger from '@adonisjs/core/services/logger'
import { importCvSchema } from '#validators/cv_import_schema'

function cleanPdfText(text: string): string {
  return text
    .replace(/\r/g, '')
    .replace(/\n{2,}/g, '\n')
    .replace(/[•●*❑\u2022\u2023\u25B6]/g, '-')
    .replace(/\s{2,}/g, '  ')
    .trim()
}

function fixSpacedLetters(text: string): string {
  return text
    .replace(/(?:^|\s)([A-Za-z0-9])(?:\s+([A-Za-z0-9])){2,}(?:\s+|$)/g, (match) => {
      return ' ' + match.replace(/\s+/g, '') + ' '
    })
    .replace(/\s{2,}/g, '  ')
}

function normalizeTextSpacing(text: string): string {
  return text
    .replace(/([a-zA-Z])([0-9])/g, '$1 $2')
    .replace(/([0-9])([a-zA-Z])/g, '$1 $2')
    .replace(/(SMK|SMP|SMA|PT|CV)([A-Z])/g, '$1 $2')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\s{2,}/g, '  ')
    .trim()
}

function enhanceForAI(text: string): string {
  let t = text

  t = t.replace(
    /(?:^|\n\s*)(ABOUT ME|PROFILE|SUMMARY|TENTANG SAYA|PROFIL|RINGKASAN|DESKRIPSI DIRI|OBJECTIVE|CAREER OBJECTIVE|TUJUAN KARIR)(?:\s*$|\s*\n)/gim,
    '\n\nABOUT_ME\n'
  )
  t = t.replace(
    /(?:^|\n\s*)(SKILL|SKILLS|TECH STACK|KEAHLIAN|KETERAMPILAN|KEMAMPUAN|KOMPETENSI|TECHNICAL SKILLS|HARD SKILLS|SOFT SKILLS|BIDANG KEAHLIAN)(?:\s*$|\s*\n)/gim,
    '\n\nSKILLS\n'
  )
  t = t.replace(
    /(?:^|\n\s*)(EXPERIENCE|WORK EXPERIENCE|WORK HISTORY|PENGALAMAN|PENGALAMAN KERJA|RIWAYAT PEKERJAAN|RIWAYAT KERJA|KARIR|PENGALAMAN PROFESIONAL|PROFESSIONAL EXPERIENCE|JOB HISTORY)(?:\s*$|\s*\n)/gim,
    '\n\nEXPERIENCE\n'
  )
  t = t.replace(
    /(?:^|\n\s*)(EDUCATION|ACADEMIC|ACADEMIC BACKGROUND|PENDIDIKAN|RIWAYAT PENDIDIKAN|LATAR BELAKANG PENDIDIKAN|RIWAYAT AKADEMIK|EDUKASI)(?:\s*$|\s*\n)/gim,
    '\n\nEDUCATION\n'
  )
  t = t.replace(
    /(?:^|\n\s*)(CERTIFICATE|CERTIFICATES|CERTIFICATION|CERTIFICATIONS|SERTIFIKAT|SERTIFIKASI|PENGHARGAAN|AWARDS|ACHIEVEMENT|PENCAPAIAN|LISENSI|LICENSE|LICENSES)(?:\s*$|\s*\n)/gim,
    '\n\nCERTIFICATES\n'
  )
  t = t.replace(
    /(?:^|\n\s*)(CURICULUM VITAE|CURRICULUM VITAE|CONTACT|CONTACT INFO|KONTAK|HUBUNGI|INFORMASI KONTAK|PERSONAL INFO|DATA PRIBADI|INFORMASI PRIBADI)(?:\s*$|\s*\n)/gim,
    '\n\nCONTACT_HEADER\n'
  )
  t = t.replace(
    /(?:^|\n\s*)(PROJECT|PROJECTS|PROYEK|PORTOFOLIO|PORTFOLIO|KARYA)(?:\s*$|\s*\n)/gim,
    '\n\nPROJECTS\n'
  )
  t = t.replace(
    /(?:^|\n\s*)(LANGUAGE|LANGUAGES|BAHASA|KEMAMPUAN BAHASA|PENGUASAAN BAHASA)(?:\s*$|\s*\n)/gim,
    '\n\nLANGUAGES\n'
  )
  t = t.replace(
    /(?:^|\n\s*)(ORGANISASI|ORGANIZATION|ORGANISATIONS|ORGANIZATIONS|KEGIATAN ORGANISASI|PENGALAMAN ORGANISASI)(?:\s*$|\s*\n)/gim,
    '\n\nORGANIZATIONS\n'
  )
  t = t.replace(
    /(?:^|\n\s*)(VOLUNTEER|VOLUNTEERING|RELAWAN|KEGIATAN SOSIAL|PENGABDIAN MASYARAKAT)(?:\s*$|\s*\n)/gim,
    '\n\nVOLUNTEER\n'
  )
  t = t.replace(
    /(?:^|\n\s*)(INTEREST|INTERESTS|HOBI|HOBBY|MINAT|AKTIVITAS)(?:\s*$|\s*\n)/gim,
    '\n\nINTERESTS\n'
  )

  return t
}

function splitSections(text: string) {
  const sections: Record<string, string> = {}
  let current = 'HEADER'

  const markers = [
    'ABOUT_ME',
    'SKILLS',
    'EXPERIENCE',
    'EDUCATION',
    'CERTIFICATES',
    'CONTACT_HEADER',
    'PROJECTS',
    'LANGUAGES',
    'ORGANIZATIONS',
    'VOLUNTEER',
    'INTERESTS',
  ]

  const lines = text.split('\n')
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) continue

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

  const phoneRegex = /(?:\+62|628|08|\+\d{1,3}[\s-]?)[\d\s-]{7,14}/g
  const phoneMatch = fullText.match(phoneRegex)
  const phone = phoneMatch ? phoneMatch[0].replace(/\s|-/g, '').trim() : ''

  const urlRegex = /https?:\/\/[^\s,)\]>]+/gi
  const allLinks = fullText.match(urlRegex) || []
  const emailDomain = email ? email.split('@')[1] : ''
  const website = allLinks.find((link) => {
    const l = link.toLowerCase()
    return emailDomain ? !l.includes(emailDomain) : true
  }) || ''

  const headerLines = headerSection
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => {
      if (l.length < 3) return false
      if (/^\d+$/.test(l)) return false
      if (l.includes('@')) return false
      if (phoneRegex.test(l)) return false
      if (/https?:\/\//i.test(l)) return false
      return true
    })

  const nameLine =
    headerLines.find((l) => {
      const words = l.trim().split(/\s+/)
      return words.length >= 1 && words.length <= 6
    }) ||
    headerLines[0] ||
    fullText.split('\n').find((l) => l.trim().length > 2) ||
    ''

  return {
    name: nameLine.trim(),
    phone,
    email,
    website: website.trim(),
  }
}

async function extractTextFromBuffer(buffer: Buffer): Promise<string> {
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
      width: item.width || 0,
    }))

    const itemsCrossingMid = items.filter(
      (item) => item.x < midPoint && item.x + item.width > midPoint
    )
    const isMultiColumn = itemsCrossingMid.length < items.length * 0.15

    if (isMultiColumn) {
      const leftColumn = items.filter((item) => item.x < midPoint).sort((a, b) => b.y - a.y)
      const rightColumn = items.filter((item) => item.x >= midPoint).sort((a, b) => b.y - a.y)
      fullText += leftColumn.map((item) => item.str).join(' ') + '\n'
      fullText += rightColumn.map((item) => item.str).join(' ') + '\n'
    } else {
      items.sort((a, b) => (Math.abs(a.y - b.y) < 5 ? a.x - b.x : b.y - a.y))
      fullText += items.map((item) => item.str).join(' ') + '\n'
    }
  }

  return fullText
}
function isCvDocument(text: string): boolean {
  const normalized = text.toLowerCase()
  let score = 0

  const sectionKeywords = [
    [
      'curriculum vitae', 'curiculum vitae', 'resume', 'cv ',
      'data pribadi', 'personal info', 'informasi pribadi',
    ],
    [
      'education', 'pendidikan', 'riwayat pendidikan',
      'academic', 'edukasi', 'riwayat akademik',
    ],
    [
      'experience', 'pengalaman', 'pengalaman kerja',
      'riwayat pekerjaan', 'riwayat kerja', 'work history',
    ],
    [
      'skill', 'skills', 'keahlian', 'keterampilan',
      'kemampuan', 'kompetensi',
    ],
    [
      'profile', 'profil', 'summary', 'about me',
      'tentang saya', 'ringkasan', 'objective',
    ],
    [
      'certificate', 'sertifikat', 'certification',
      'penghargaan', 'achievement', 'awards',
    ],
    [
      'organisasi', 'organization', 'volunteer',
      'relawan', 'kegiatan',
    ],
  ]

  for (const group of sectionKeywords) {
    if (group.some((kw) => normalized.includes(kw))) {
      score++
    }
  }

  const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(text)
  if (hasEmail) score++

  const hasPhone = /(?:\+62|628|08|\+\d{1,3}[\s-]?)[\d\s-]{7,14}/.test(text)
  if (hasPhone) score++

  return score >= 3 // Adjust to higher or lower as needed: 3 is a good balance for basic CV detection, but you can set to 4 for stricter validation or 2 for more leniency.
}

export default class CvHelper extends pricingEngine {
  async summarize(payload: Infer<typeof CvAnalyzeSchema | typeof importCvSchema>) {
    let ocrOutputPath: string | null = null

    try {
      if (!payload.cv_file.tmpPath) throw new HttpException('Invalid file upload', 400)

      const inputPath = fs.realpathSync(payload.cv_file.tmpPath)

      let buffer = fs.readFileSync(inputPath)
      let rawText = await extractTextFromBuffer(buffer)

      const isImageBased = rawText.replace(/\s/g, '').length < 100

      if (isImageBased) {
        const systemTmp = fs.realpathSync(os.tmpdir())
        const tempDir = path.join(systemTmp, 'ocr-cv')

        if (!fs.existsSync(tempDir)) {
          fs.mkdirSync(tempDir, { recursive: true })
        }
        fs.chmodSync(tempDir, 0o777)

        ocrOutputPath = path.join(tempDir, `${path.basename(inputPath)}-ocr.pdf`)

        const env = {
          ...process.env,
          TMPDIR: tempDir,
          TEMP: tempDir,
          TMP: tempDir,
          PYTHONUTF8: '1',
        }

        try {
          execSync(
            `ocrmypdf --skip-text --optimize 3 --deskew --clean --rotate-pages --language eng "${inputPath}" "${ocrOutputPath}"`,
            { env, stdio: 'pipe' }
          )
        } catch {
          execSync(
            `ocrmypdf --force-ocr --optimize 3 --deskew --clean --rotate-pages --language eng "${inputPath}" "${ocrOutputPath}"`,
            { env, stdio: 'pipe' }
          )
        }

        buffer = fs.readFileSync(ocrOutputPath)
        rawText = await extractTextFromBuffer(buffer)
      }

      if (!rawText || rawText.trim().length < 50) {
        throw new HttpException('Could not extract text from PDF', 422)
      }

      // Check if the extracted text has CV-like characteristics
      if (!isCvDocument(rawText)) {
        throw new HttpException('File CV PDF yang kamu unggah tidak sesuai format. Silahkan periksa dan coba lagi!', 422)
      }

      const fixed = fixSpacedLetters(rawText)
      const spaced = normalizeTextSpacing(fixed)
      const cleaned = cleanPdfText(spaced)
      const enhanced = enhanceForAI(cleaned)
      const sections = splitSections(enhanced)

      const experience = (sections.EXPERIENCE || '')
        .split(
          /\n(?=\d{4}|\b(?:Jan|Feb|Mar|Apr|Mei|Jun|Jul|Agu|Sep|Okt|Nov|Des|January|February|March|April|May|June|July|August|September|October|November|December|Januari|Februari|Maret|April|Mei|Juni|Juli|Agustus|September|Oktober|November|Desember)\b)/gi
        )
        .map((s) => s.replace(/\n/g, ' ').trim())
        .filter((s) => s.length > 5)

      const education = (sections.EDUCATION || '')
        .split(
          /\n(?=\d{4}|S1|S2|S3|D1|D2|D3|D4|SMA|SMK|SMP|SD|Bachelor|Master|Doctoral|Diploma|Sarjana|Magister|Doktor)/gi
        )
        .map((s) => s.replace(/\n/g, ' ').trim())
        .filter((s) => s.length > 5)

      const skills = (sections.SKILLS || '')
        .split(/\n|,|;|·|\//)
        .map((s) => s.replace(/^[-•\d.]\s*/, '').trim())
        .filter((s) => s.length > 1 && !/^\d+$/.test(s))

      const parsedData = {
        header: parseHeader(cleaned, sections.HEADER || ''),
        about_me: sections.ABOUT_ME?.replace(/\n/g, ' ').trim() || '',
        skills,
        experience,
        education,
        certificates: (sections.CERTIFICATES || '')
          .split(/\n/)
          .map((s) => s.replace(/^[-•\d.]\s*/, '').trim())
          .filter((s) => s.length > 1),
        projects: (sections.PROJECTS || '')
          .split(/\n(?=[A-Z\d])/)
          .map((s) => s.replace(/\n/g, ' ').trim())
          .filter((s) => s.length > 5),
        languages: (sections.LANGUAGES || '')
          .split(/\n|,|;/)
          .map((s) => s.replace(/^[-•]\s*/, '').trim())
          .filter((s) => s.length > 1),
        organizations: (sections.ORGANIZATIONS || '')
          .split(/\n(?=\d{4}|\b\w)/)
          .map((s) => s.replace(/\n/g, ' ').trim())
          .filter((s) => s.length > 5),
        volunteer: (sections.VOLUNTEER || '')
          .split(/\n(?=\d{4}|\b\w)/)
          .map((s) => s.replace(/\n/g, ' ').trim())
          .filter((s) => s.length > 5),
        interests: (sections.INTERESTS || '')
          .split(/\n|,|;/)
          .map((s) => s.replace(/^[-•]\s*/, '').trim())
          .filter((s) => s.length > 1),
      }

      let md = `# ${parsedData.header.name.toUpperCase()}\n\n`
      md += `**Phone:** ${parsedData.header.phone}  \n**Email:** ${parsedData.header.email}  \n`
      if (parsedData.header.website) md += `**Website:** ${parsedData.header.website}  \n`
      md += `\n---\n\n## PROFILE\n${parsedData.about_me}\n\n`
      md += `## WORK EXPERIENCE\n${parsedData.experience.map((e) => `* ${e}`).join('\n')}\n\n`
      md += `## EDUCATION\n${parsedData.education.map((e) => `* ${e}`).join('\n')}\n\n`
      if (parsedData.skills.length) md += `## SKILLS\n${parsedData.skills.join(', ')}\n\n`
      if (parsedData.certificates.length)
        md += `## CERTIFICATES\n${parsedData.certificates.map((c) => `* ${c}`).join('\n')}\n\n`
      if (parsedData.projects.length)
        md += `## PROJECTS\n${parsedData.projects.map((p) => `* ${p}`).join('\n')}\n\n`
      if (parsedData.organizations.length)
        md += `## ORGANIZATIONS\n${parsedData.organizations.map((o) => `* ${o}`).join('\n')}\n\n`
      if (parsedData.volunteer.length)
        md += `## VOLUNTEER\n${parsedData.volunteer.map((v) => `* ${v}`).join('\n')}\n\n`
      if (parsedData.languages.length)
        md += `## LANGUAGES\n${parsedData.languages.join(', ')}\n\n`
      if (parsedData.interests.length)
        md += `## INTERESTS\n${parsedData.interests.join(', ')}`

      return {
        raw_text: cleaned,
        parsed_json: parsedData,
        markdown_version: md.trim(),
      }
    } catch (error: any) {
      throw new HttpException(error.message, error.status || 500)
    } finally {
      if (ocrOutputPath && fs.existsSync(ocrOutputPath)) {
        try {
          fs.unlinkSync(ocrOutputPath)
        } catch (_) {
          logger.warn(`Failed to delete temp OCR file at ${ocrOutputPath}`)
        }
      }
    }
  }
}
