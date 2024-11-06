import vine from '@vinejs/vine'

/**
 * Validates the post's update action
 */
export const createCommentValidator = vine.compile(
  vine.object({
    content: vine.string().trim().escape(),
  })
)
