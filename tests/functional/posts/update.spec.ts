import { test } from '@japa/runner'
import User from '#models/user'
import Post from '#models/post'
import { MESSAGES } from '#types/messages'

const userBody = {
  email: 'test@example.com',
  password: 'password123',
  full_name: 'Test User',
}

test.group('Posts update', (group) => {
  let token: string
  let testPost: Post

  // Setup: Clean database, create test user and post
  group.each.setup(async () => {
    await Post.query().delete()
    await User.query().delete()

    const user = await User.create(userBody)
    const tokenResponse = await User.accessTokens.create(user, ['*'], { expiresIn: '1 day' })
    token = tokenResponse.toJSON().token!

    // Create a test post
    testPost = await Post.create({
      title: 'Original Title',
      content: 'Original content',
      userId: user.id,
    })
  })

  test('should update post with valid data', async ({ client }) => {
    const updateData = {
      title: 'Updated Post Title',
      content: 'Updated post content',
    }

    const response = await client.put(`/posts/${testPost.id}`).json(updateData).bearerToken(token)

    response.assertStatus(200)
    response.assertBodyContains({
      status: 'success',
      message: MESSAGES.POST_UPDATED,
      data: {
        id: testPost.id,
        title: updateData.title,
        content: updateData.content,
      },
    })
  })

  test('should fail with non-existent post id', async ({ client }) => {
    const updateData = {
      title: 'Updated Post Title',
      content: 'Updated post content',
    }

    const response = await client.put('/posts/999999').json(updateData).bearerToken(token)

    response.assertStatus(404)
    response.assertBodyContains({
      status: 'error',
      message: MESSAGES.ROW_NOT_FOUND,
    })
  })

  test('should fail with invalid title length', async ({ client }) => {
    const updateData = {
      title: 'Short', // Less than 6 characters
      content: 'Updated post content',
    }

    const response = await client.put(`/posts/${testPost.id}`).json(updateData).bearerToken(token)

    response.assertStatus(422)
  })

  test('should fail with missing required fields', async ({ client }) => {
    const updateData = {
      // Missing title
      content: 'Updated post content',
    }

    const response = await client.put(`/posts/${testPost.id}`).json(updateData).bearerToken(token)

    response.assertStatus(422)
  })

  test('should fail with unauthenticated request', async ({ client }) => {
    const updateData = {
      title: 'Updated Post Title',
      content: 'Updated post content',
    }

    const response = await client.put(`/posts/${testPost.id}`).json(updateData)

    response.assertStatus(401)
    response.assertBodyContains({
      status: 'error',
      message: MESSAGES.USER_UNAUTHORIZED,
    })
  })

  test('should fail with invalid post id format', async ({ client }) => {
    const updateData = {
      title: 'Updated Post Title',
      content: 'Updated post content',
    }

    const response = await client.put('/posts/invalid-id').json(updateData).bearerToken(token)

    response.assertStatus(404)
  })
})
