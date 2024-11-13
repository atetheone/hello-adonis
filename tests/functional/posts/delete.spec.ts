import { test } from '@japa/runner'
import User from '#models/user'
import Post from '#models/post'
import { MESSAGES } from '#types/messages'

const userBody = {
  email: 'test@example.com',
  password: 'password123',
  fullName: 'Test User',
}

test.group('Posts delete', (group) => {
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
      title: 'Test Post Title',
      content: 'Test post content',
      userId: user.id,
    })
  })

  test('should delete post successfully', async ({ client }) => {
    const response = await client.delete(`/posts/${testPost.id}`).bearerToken(token)

    response.assertStatus(200)
    response.assertBodyContains({
      status: 'success',
      message: MESSAGES.POST_DELETED,
    })
  })

  test('should fail with non-existent post id', async ({ client }) => {
    const response = await client.delete('/posts/999999').bearerToken(token)

    response.assertStatus(404)
    response.assertBodyContains({
      status: 'error',
      message: MESSAGES.ROW_NOT_FOUND,
    })
  })

  test('should fail with unauthenticated request', async ({ client }) => {
    const response = await client.delete(`/posts/${testPost.id}`)

    response.assertStatus(401)
    response.assertBodyContains({
      status: 'error',
      message: MESSAGES.USER_UNAUTHORIZED,
    })
  })

  test('should fail with invalid post id format', async ({ client }) => {
    const response = await client.delete('/posts/invalid-id').bearerToken(token)

    response.assertStatus(404)
  })
})
