import vine from '@vinejs/vine'

export const signInSchema = vine.compile(
  vine.object({
    email: vine.string().email(),
    password: vine.string()
  })
)
