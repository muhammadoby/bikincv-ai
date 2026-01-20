import vine from '@vinejs/vine'

export const CvAnalyzeSchema = vine.compile(
  vine.object({
    cv_file: vine.file({
      extnames: ['pdf', 'PDF'],
      size: "1mb"
    })
  })
)
