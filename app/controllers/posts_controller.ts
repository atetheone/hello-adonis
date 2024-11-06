import type { HttpContext } from '@adonisjs/core/http'
import { createPostValidator, updatePostValidator } from '#validators/post'
import Post from '#models/post'

export default class PostsController {
  /**
   * Display a list of posts
   */
  async index({ request }: HttpContext) {
    const page = request.input('page')
    const limit = 5

    if (!page) {
      return await Post.all()
    }
    return await Post.query().orderBy('id', 'desc').paginate(page, limit)
  }

  /**
   * Create a new post
   */
  async store({ request, response, auth }: HttpContext) {
    const data = await request.validateUsing(createPostValidator)
    const user = auth.user!
    // const post = await Post.create(data)
    const post = await user.related('posts').create(data)

    return response.status(201).json(post)
  }

  /**
   * Show a post
   */
  async show({ response, params }: HttpContext) {
    const post = await Post.findOrFail(params.id)

    if (!post) {
      return response.status(404).json({ message: 'Post not found' })
    }

    return response.status(200).json(post)
  }

  /**
   * Update individual record
   */
  async update({ request, response, params }: HttpContext) {
    const { title, content } = await request.validateUsing(updatePostValidator)
    // check if the post exists
    const post = await Post.findOrFail(params.id)

    if (!post) {
      return response.status(404).json({ message: 'Post not found' })
    }

    post.title = title
    post.content = content

    await post.save()
    // update the post
    return post
  }

  /**
   * Delete record
   */
  async destroy({ response, params }: HttpContext) {
    const post = await Post.findOrFail(params.id)
    await post.delete()
    return response.status(200).json({
      message: 'Post deleted successfully',
    })
  }
}
