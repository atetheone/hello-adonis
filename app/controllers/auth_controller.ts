import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { loginValidator, registerValidator } from '#validators/auth'
import { MESSAGES } from '#config/messages'
import { AuthService } from '#services/auth_service'
import { ResponseService } from '#services/response_service'
import type { LoginCredentials, LoginResponse, RegistrationUser } from '#types'
// import { ConflictException } from '#exceptions/conflict'

@inject()
export default class AuthController {
  constructor(
    protected authService: AuthService,
    protected responseService: ResponseService
  ) {}

  public async register({ request, response }: HttpContext) {
    const userData: RegistrationUser = await request.validateUsing(registerValidator)

    // try {
    const user = await this.authService.register(userData)

    if (!user) return this.responseService.error(response, MESSAGES.USER_EMAIL_EXISTS, 409)

    return this.responseService.created<RegistrationUser['data']>(
      response,
      MESSAGES.USER_REGISTERED,
      user
    )
    // } catch (err) {
    // console.log(err instanceof ConflictException)
    // console.log(err instanceof Error)
    // // console.log(err)
    // return this.responseService.error(response, MESSAGES.USER_EMAIL_EXISTS, 409)
    // return this.responseService.error(response, MESSAGES.SERVER_ERROR, 500)
    // }
  }

  public async login({ request, response }: HttpContext) {
    const credentials: LoginCredentials = await request.validateUsing(loginValidator)
    const { user, token } = await this.authService.login(credentials)

    return this.responseService.success<LoginResponse['data']>(response, MESSAGES.USER_LOGGED_IN, {
      user,
      token,
    })
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
