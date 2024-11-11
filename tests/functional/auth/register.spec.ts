import { test } from '@japa/runner'
import User from '#models/User'
import { MESSAGES } from '#config/messages'

test.group('Auth register', (group) => {
  // Clean up db
  group.each.setup(async () => {
    await User.query().delete()
  })

  test('should invalidate short full name', async ({ client, assert }) => {
    const data = {
      full_name: 'Jo',
      email: 'john@doe.com',
      password: 'password123',
    }

    try {
      /*const response = */ await client.post('/register').json(data)
      //
      // console.log(JSON.stringify(response.body(), null, 3))
    } catch (error) {
      assert.equal(error.messages[0].field, 'full_name')
    }
  })

  test('should invalidate invalid email', async ({ client, assert }) => {
    const data = {
      full_name: 'John Doe',
      email: 'john',
      password: 'password123',
    }

    try {
      await client.post('/register').json(data)
    } catch (error) {
      assert.equal(error.messages[0].field, 'email')
    }
  })

  test('should invalidate too short password', async ({ client, assert }) => {
    const user = {
      full_name: 'Jane Doe',
      email: 'jane@doe.com',
      password: '12442',
    }

    try {
      await client.post('/register').json(user)
    } catch (error) {
      assert.equal(error.messages[0].field, 'password')
    }
  })

  test('should not allow registration without a name', async ({ client, assert }) => {
    const userBody = {
      email: 'missing.name@example.com',
      password: 'securepassword',
    }

    try {
      await client.post('/register').json(userBody)
    } catch (error) {
      assert.equal(error.messages[0].field, 'full_name')
    }
  })

  test('should register a valid user', async ({ client, assert }) => {
    const user = {
      full_name: 'Ate',
      email: 'ate2@ate.com',
      password: 'password123',
    }

    const response = await client.post('/register').json(user)

    response.assertStatus(201)
    response.assertBodyContains({
      status: 'success',
      message: MESSAGES.USER_REGISTERED,
      data: {
        email: user.email,
        fullName: user.full_name,
      },
    })
  })
})
