import type { HttpContext } from '@adonisjs/core/http'

export default class GreetingsController {
  public async sayHello({ params }: HttpContext) {
    return {
      message: `Bonjour, ${params.name}`,
    }
  }
}
