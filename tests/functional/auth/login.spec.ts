import { test } from '@japa/runner'
import User from '#models/User'
import { MESSAGES } from '#config/messages'

const userBody = {
  email: 'test@example.com',
  password: 'password123',
  full_name: 'Test User',
}

test.group('Auth login', (group) => {
  group.each.setup(async () => {
    await User.query().delete()
    await User.create(userBody)
  })

  test('should login with valid credentials', async ({ client, assert }) => {
    const loginResponse = await client.post('/login').json({
      email: userBody.email,
      password: userBody.password,
    })
    const loginBody = loginResponse.body()

    loginResponse.assertStatus(200)
    assert.equal(loginBody.message, MESSAGES.USER_LOGGED_IN)
  })

  test('should fail with invalid credentials', async ({ client, assert }) => {
    const unknownUser = {
      email: 'unk@nown.com',
      password: 'failed.Succ',
    }

    const response = await client.post('/login').json(unknownUser)

    console.log(JSON.stringify(response.body(), null, 3))

    response.assertStatus(400)
    assert.equal(
      response.body().errors.some((err) => err.message === MESSAGES.USER_INVALID_CREDENTIALS),
      true
    )
  })

  test('should fail with missing required fields', async ({ client, assert }) => {
    const user = {
      password: 'passwpdreo123',
    }
    // TODO: Implement test
    const response = await client.post('/login').json(user)

    response.assertStatus(422)
    assert.deepEqual(response.body().errors[0].message, 'The email field must be defined')
  })

  test('should fail with invalid email format', async ({ client, assert }) => {
    const data = {
      email: 'john',
      password: 'password123',
    }

    try {
      await client.post('/login').json(data)
    } catch (error) {
      assert.equal(error.messages[0].field, 'email')
    }
  })

  test('should fail validation with empty fields', async ({ client, assert }) => {
    // TODO: Implement test
    const user = {
      email: '',
      password: '',
    }

    const response = await client.post('/login').json(user)

    assert.equal(
      response.body().errors.some((err) => err.rule === 'required'),
      true
    )
  })
})
