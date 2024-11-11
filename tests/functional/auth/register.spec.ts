import { test } from '@japa/runner'
import { apiClient } from '@japa/api-client'
import { registerValidator } from '#validators/auth'
import User from '#models/User'

test.group('Auth register', (group) => {
  // Clean up db
  group.each.setup(async () => {
    await User.query().delete()
  })

  test('example test', async ({ assert }) => {})

  test('should validate successful registration', async ({ assert }) => {
    const data = {
      full_name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    }
    const validatedData = await registerValidator.validate(data)
    assert.deepEqual(validatedData, data)
  })

  test('should invalidate short full name', async ({ assert }) => {
    const data = {
      full_name: 'Jo',
      email: 'john@doe.com',
      password: 'password123',
    }

    try {
      await registerValidator.validate(data)
    } catch (error) {
      assert.equal(error.messages[0].field, 'full_name')
    }
  })

  test('should invalidate invalid email', async ({ assert }) => {
    const data = {
      full_name: 'John Doe',
      email: 'john',
      password: 'password123',
    }

    try {
      await registerValidator.validate(data)
    } catch (error) {
      assert.equal(error.messages[0].field, 'email')
    }
  })

  test('should invalidate too short password', async ({ assert }) => {
    const user = {
      full_name: 'Jane Doe',
      email: 'jane@doe.com',
      password: '12442',
    }

    try {
      await registerValidator.validate(user)
    } catch (error) {
      assert.equal(error.messages[0].field, 'password')
    }
  })

  test('should not allow registration without a name', async ({ assert }) => {
    const userBody = {
      email: 'missing.name@example.com',
      password: 'securepassword',
    }

    try {
      await registerValidator.validate(userBody)
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
      message: 'user registered successfully',
      data: {
        email: user.email,
        fullName: user.full_name,
      },
    })
  })
})
