import Comment from '#models/comment'
import Post from '#models/post'
import type { HttpContext } from '@adonisjs/core/http'
import { createCommentValidator } from '#validators/comment'

export default class CommentsController {
  /**
   * Display a list of comments related to a post
   */
  public async index({ request, params }: HttpContext) {
    const page = request.input('page')
    const limit = 5

    // const posts = await Post.findByOrFail(params.postId)
    const baseComments = Comment.query()
    if (!page) {
      return baseComments.where('post_id', params.postId).orderBy('id', 'desc')
    }

    return baseComments.orderBy('id', 'desc').paginate(page, limit)
  }

  /**
   * Get a single comment of a post
   */
  public async show({ params }: HttpContext) {
    const comment = await Comment.query()
      .where('id', params.commentId)
      .where('post_id', params.postId)
      .firstOrFail()

    return comment
  }

  /**
   * Create a new comment for a post
   */
  public async store({ request, response, auth, params }: HttpContext) {
    const data = await request.validateUsing(createCommentValidator)
    const user = auth.user!
    const post = await Post.firstOrFail(params.postId)

    const comment = await post.related('comments').create({
      content: data.content,
    })

    return response.created(comment)
  }

  /**
   * Update a comment for a post
   */
  public async update({ request, response, params }: HttpContext) {
    const data = await request.validateUsing(createCommentValidator)
    const comment = await Comment.query()
      .where('id', params.commentId)
      .where('post_id', params.postId)
      .firstOrFail()

    comment.merge(data)
    await comment.save()

    return response.status(200).json(comment)
  }

  /**
   * Delete a comment for a post
   */
  public async destroy({ response, params }: HttpContext) {
    const comment = await Comment.query()
      .where('id', params.commentId)
      .where('post_id', params.postId)
      .firstOrFail()

    await comment.delete()

    return response.status(204).json({ message: 'Comment deleted successfully' })
  }
}
