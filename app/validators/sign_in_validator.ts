import vine from '@vinejs/vine'

export const signInSchema = vine.compile(
  vine.object({
    email: vine.string().email(),
    password: vine.string()
  })
)

export const internalSigninSchema = vine.compile(
  vine.object({
    user_id: vine.number(),
    email: vine.string().email(),
  })
)