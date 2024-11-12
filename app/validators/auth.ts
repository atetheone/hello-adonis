import vine from '@vinejs/vine'

const password = vine.string().trim().minLength(8)

export const registerValidator = vine.compile(
  vine.object({
    fullName: vine.string().trim().minLength(3),
    email: vine.string().trim().email().normalizeEmail(),
    password,
  })
)

export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email().normalizeEmail(),
    password,
  })
)
