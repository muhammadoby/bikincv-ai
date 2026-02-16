import vine from '@vinejs/vine'

export const checkVoucherSchema = vine.compile(
    vine.object({
        promo_code: vine.string()
    })
)