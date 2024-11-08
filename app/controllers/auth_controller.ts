import User from '#models/user'
import { loginValidator, registerValidator } from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'

export default class AuthController {
  public async register({ request, response }: HttpContext) {
    const userData = await request.validateUsing(registerValidator)
    const user = await User.create(userData)
    // const returnUser = await User.accessTokens.create(user, ['*'], { expiresIn: '1 day' })
    return response.status(201).send(user)
  }

  public async login({ request, response }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)
    const user = await User.verifyCredentials(email, password)
    const tokenResponse = await User.accessTokens.create(user, ['*'], { expiresIn: '1 day' })
    const token = tokenResponse.toJSON()

    return response.ok({
      user,
      token: token.token,
      type: token!.type,
      expiresIn: token.expiresAt,
      lastUsedAt: token.lastUsedAt,
    })
  }

  public async logout({ auth }: HttpContext) {
    const user = auth.user!
    await User.accessTokens.delete(user, user?.currentAccessToken.identifier)

    return {
      message: 'Logged out successfully',
    }
  }

  public async me({ auth }: HttpContext) {
    await auth.check()
    return {
      user: auth.user,
    }
  }
}
