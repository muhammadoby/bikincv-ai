import vine from '@vinejs/vine'

export const importCvSchema = vine.compile(
  vine.object({
    user_id: vine.number().exists(async (db, value) => {
      const user = await db.from('users').where('user_id', value).first()
      return !!user
    }),
    cv_file: vine.file({
      extnames: ['pdf', 'PDF'],
      size: "2mb"
    }),
    text: vine.string().optional(),
    cv_lang: vine.enum(['id', 'en'])
  })
)
