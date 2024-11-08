import { test } from '@japa/runner'
import { apiClient } from '@japa/api-client'
import { loginValidator } from '#validators/auth'
import User from '#models/User'

test.group('Auth login', (group) => {
  group.each(setup(async () => {
    await User.query().delete()
  }))
  test('should login with valid credentials', async ({ client, assert }) => {
    // TODO: Implement test
  })

  test('should fail with invalid credentials', async ({ client, assert }) => {
    // TODO: Implement test
  })

  test('should fail with missing required fields', async ({ client, assert }) => {
    // TODO: Implement test
  })

  test('should fail with invalid email format', async ({ client, assert }) => {
    // TODO: Implement test
  })

  test('should fail validation with empty fields', async ({ client, assert }) => {
    // TODO: Implement test
  })
})