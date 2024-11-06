import Comment from '#models/comment'
import type { HttpContext } from '@adonisjs/core/http'

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
  public async show(ctx: HttpContext) {
    const comments = await this.index(ctx)
    return comments.filter((comment) => comment.id === ctx.params.commentId)
  }
}
