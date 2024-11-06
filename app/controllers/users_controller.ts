import { HttpContext } from '@adonisjs/core/http'

export default class UsersController {
  index() {
    return [
      {
        id: 1,
        username: 'virk',
      },
      {
        id: 2,
        username: 'romain',
      },
    ]
  }

  async show({ params }: HttpContext) {
    return {
      id: params.id,
      username: 'virk',
    }
  }
}
