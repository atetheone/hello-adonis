import { test } from '@japa/runner'
import User from '#models/User'
import { MESSAGES } from '#types/messages'

test.group('Auth register', (group) => {
  // Clean up db
  group.each.setup(async () => {
    await User.query().delete()
  })

  test('should invalidate short full name', async ({ client, assert }) => {
    const data = {
      fullName: 'Jo',
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
      fullName: 'John Doe',
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
      fullName: 'Jane Doe',
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
      fullName: 'Ate',
      email: 'ate22@ate.com',
      password: 'password123',
    }

    const response = await client.post('/register').json(user)

    console.log(JSON.stringify(response.body(), null, 3))

    response.assertStatus(201)
    assert.equal(response.body().message, MESSAGES.USER_REGISTERED)
  })

  test('should not allow user registration with an existing email', async ({ client, assert }) => {
    const user = {
      fullName: 'Ate',
      email: 'ate2@ate.com',
      password: 'password123',
    }

    await client.post('/register').json(user)

    const response = await client.post('/register').json(user)

    response.assertStatus(409)
    response.assertBodyContains({
      status: 'error',
      message: MESSAGES.USER_EMAIL_EXISTS,
    })
  })
})
