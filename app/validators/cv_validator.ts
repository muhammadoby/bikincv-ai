import vine from '@vinejs/vine'

export const CvAnalyzeSchema = vine.compile(
  vine.object({
    cv_file: vine.file({
      extnames: ['pdf', 'PDF'],
      size: "1mb"
    }),
    language_style: vine.enum(['professional', 'casual']),
    cv_lang: vine.enum(['id', 'en'])
  })
)
