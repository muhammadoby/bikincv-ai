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
    payment_method: vine.enum(['midtrans', 'xendit'])
  })
)
