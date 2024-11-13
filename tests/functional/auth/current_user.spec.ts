import { test } from '@japa/runner'
import User from '#models/user'
import { MESSAGES } from '#types/messages'

const userBody = {
  email: 'test@example.com',
  password: 'password123',
  full_name: 'Test User',
}

let token: string = ''

test.group('Auth current user', (group) => {
  // Clean up database before each test
  group.each.setup(async () => {
    await User.query().delete()
  })

  test('should get authenticated user details', async ({ client }) => {
    // Create user
    const user = await User.create(userBody)

    const tokenResponse = await User.accessTokens.create(user, ['*'], { expiresIn: '1 day' })

    // Login
    // const loginResponse = await client.post('/login').json({
    //   email: userBody.email,
    //   password: userBody.password,
    // })
    token = tokenResponse.toJSON().token ?? ''
    // const token = loginResponse.body().token

    // Test /me endpoint
    if (!token) {
      throw new Error('Token was not generated')
    }

    // Make request with token
    const response = await client.get('/me').bearerToken(token)

    response.assertStatus(200)
    response.assertBodyContains({
      data: {
        email: userBody.email,
        fullName: userBody.full_name,
      },
    })
  })

  test('should return 401 for unauthenticated request', async ({ client, assert }) => {
    const response = await client.get('/me')

    console.log(JSON.stringify(response.body()))
    // const newToken = await request.bearerToken(token)

    response.assertStatus(401)
    assert.isTrue(response.body().message === MESSAGES.USER_UNAUTHORIZED)
  })
})
