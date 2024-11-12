import { test } from '@japa/runner'
import User from '#models/user'
import Post from '#models/post'
import { MESSAGES } from '#config/messages'

const userBody = {
  email: 'test@example.com',
  password: 'password123',
  full_name: 'Test User',
}

test.group('Posts show', (group) => {
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

  test('should show a single post', async ({ client }) => {
    const response = await client.get(`/posts/${testPost.id}`).bearerToken(token)

    // console.log(JSON.stringify(response.body(), null, 3))

    response.assertStatus(200)
    response.assertBodyContains({
      status: 'success',
      message: MESSAGES.POST_SHOWED,
      data: {
        id: testPost.id,
        title: testPost.title,
        content: testPost.content,
      },
    })
  })

  test('should fail with non-existent post id', async ({ client }) => {
    const response = await client.get('/posts/999999').bearerToken(token)

    response.assertStatus(404)
    // response.assertBodyContains({
    //   message: MESSAGES.POST_NOT_FOUND,
    // })
  })

  test('should fail with unauthenticated request', async ({ assert, client }) => {
    const response = await client.get(`/posts/${testPost.id}`)


    response.assertStatus(401)
    assert.isTrue(
      response.body().errors.some((error) => error.message === MESSAGES.USER_UNAUTHORIZED)
    )
  })

  test('should fail with invalid post id format', async ({ client }) => {
    const response = await client.get('/posts/invalid-id').bearerToken(token)

    // console.log(JSON.stringify(response.body(), null, 3))

    response.assertStatus(404)
  })
})
