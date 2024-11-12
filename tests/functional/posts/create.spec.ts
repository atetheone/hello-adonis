import { test } from '@japa/runner'
import User from '#models/user'
import Post from '#models/post'
import { MESSAGES } from '#config/messages'

const userBody = {
  email: 'test@example.com',
  password: 'password123',
  full_name: 'Test User',
}

test.group('Posts create', (group) => {
  let token: string

  // Setup: Clean database and create test user with token
  group.each.setup(async () => {
    await Post.query().delete()
    await User.query().delete()

    const user = await User.create(userBody)
    const tokenResponse = await User.accessTokens.create(user, ['*'], { expiresIn: '1 day' })
    token = tokenResponse.toJSON().token
  })

  test('should create a new post', async ({ assert, client }) => {
    const postData = {
      title: 'Test Post Title',
      content: 'Test post content',
    }

    const response = await client.post('/posts').json(postData).bearerToken(token)

    response.assertStatus(201)
    assert.isTrue(response.body().message === MESSAGES.POST_CREATED)
  })

  test('should fail with unauthenticated request', async ({ assert, client }) => {
    const postData = {
      title: 'Test Post Title',
      content: 'Test post content',
    }

    const response = await client.post('/posts').json(postData)

    // console.log(JSON.stringify(response.body().errors, null, 2))
    response.assertStatus(401)
    assert.isTrue(
      response.body().errors.some((error) => error.message === MESSAGES.USER_UNAUTHORIZED)
    )
  })

  test('should fail with invalid title length', async ({ client }) => {
    const postData = {
      title: 'Short', // Less than 6 characters
      content: 'Test post content',
    }

    const response = await client.post('/posts').json(postData).bearerToken(token)

    response.assertStatus(422)
  })

  test('should fail with missing required fields', async ({ client }) => {
    const postData = {
      title: 'Test Post Title',
      // missing content field
    }

    const response = await client.post('/posts').json(postData).bearerToken(token)

    response.assertStatus(422)
  })
})
