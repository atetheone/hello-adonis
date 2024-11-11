import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { loginValidator, registerValidator } from '#validators/auth'
import { MESSAGES } from '#config/messages'
import { AuthService } from '#services/auth_service'
import { ResponseService } from '#services/response_service'

@inject()
export default class AuthController {
  constructor(
    protected authService: AuthService,
    protected responseService: ResponseService
  ) {}

  public async register({ request, response }: HttpContext) {
    const userData = await request.validateUsing(registerValidator)
    const user = await this.authService.register(userData)

    return this.responseService.success(response, MESSAGES.USER_REGISTERED, user, 201)
  }

  public async login({ request, response }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)
    const { user, token } = await this.authService.login(email, password)

    return this.responseService.success(response, MESSAGES.USER_LOGGED_IN, { user, token })
  }

  public async logout({ auth, response }: HttpContext) {
    const user = auth.user!
    await this.authService.logout(user)

    return this.responseService.success(response, MESSAGES.USER_LOGGED_OUT)
  }

  public async me({ auth, response }: HttpContext) {
    await auth.check()
    return this.responseService.success(response, 'User details', auth.user)
  }
}
