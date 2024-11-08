import { HttpContext } from '@adonisjs/core/http'
import User from '#models/User'

export default class UsersController {
  async index({ request, response }: HttpContext) {
    return User.all()
  }

  async show({ request, params }: HttpContext) {
    return User.findOrFail(params.id)
  }
}
