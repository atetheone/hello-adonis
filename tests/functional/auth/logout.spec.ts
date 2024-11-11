import { test } from '@japa/runner'
import User from '#models/user'
import { MESSAGES } from '#config/messages'

const userBody = {
  email: 'test@example.com',
  password: 'password123',
  full_name: 'Test User',
}

test.group('Auth logout', (group) => {
  let token: string

  // Setup: Clean database and create test user
  group.each.setup(async () => {
    await User.query().delete()
    const user = await User.create(userBody)
    const tokenResponse = await User.accessTokens.create(user, ['*'], { expiresIn: '1 day' })
    token = tokenResponse.toJSON().token
  })

  test('should successfully logout authenticated user', async ({ client }) => {
    const response = await client.delete('/logout').bearerToken(token)

    response.assertStatus(200)
    response.assertBodyContains({
      status: 'success',
      message: MESSAGES.USER_LOGGED_OUT,
    })
  })

  test('should fail for unauthenticated request', async ({ client }) => {
    const response = await client.delete('/logout')

    response.assertStatus(401)
    response.assertBodyContains({
      errors: [
        {
          message: MESSAGES.USER_UNAUTHORIZED,
        },
      ],
    })
  })

  test('should fail with invalid token', async ({ client }) => {
    const response = await client.delete('/logout').bearerToken('invalid-token')

    response.assertStatus(401)
    response.assertBodyContains({
      errors: [
        {
          message: MESSAGES.USER_UNAUTHORIZED,
        },
      ],
    })
  })
})
