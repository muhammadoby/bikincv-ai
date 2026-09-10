import vine from '@vinejs/vine'

export const CvAnalyzeSchema = vine.compile(
  vine.object({
    cv_file: vine.file({
      extnames: ['pdf', 'PDF'],
      size: "2mb"
    }),
    language_style: vine.enum(['professional', 'casual', 'roasting']),
    cv_lang: vine.enum(['id', 'en']),
    cv_purpose: vine.string().nullable(),
    role_title: vine.string().nullable(),
    is_mobile: vine.boolean().optional(),
    device: vine.string().optional(),
    program_campus_name: vine.string().nullable(),
    job_description: vine.string().nullable()
  })
)

export const CvPaymentSchema = vine.compile(
  vine.object({
    promo_code: vine.string().exists(async (db, value) => {
      const promo = await db.from('promos').where('code', value).andWhere('is_active', true).first()

      // check if promo code is expired
      if (promo && promo.endDate < new Date()) {
        return false
      }

      return !!promo
    }).optional(),
    payment_method: vine.enum(['midtrans', 'xendit', 'play_billing']).optional()
  })
)
