import User from '#models/user'
import { LoginCredentials, RegitrationUser } from '#types'

export class AuthService {
  public async register(userData: RegitrationUser) {
    // Check if email already exists in the db
    // try {
    const existingUser = await User.query().where('email', userData.email).first()

    if (existingUser) {
      // throw new ConflictException(MESSAGES.USER_EMAIL_EXISTS)
      return false
    }
    // } catch (err) {
    // console.log(JSON.stringify(err, null, 3))
    // }

    const user = await User.create(userData)
    return user
  }

  public async login(credentials: LoginCredentials) {
    const user = await User.verifyCredentials(credentials.email, credentials.password)
    const tokenResponse = await User.accessTokens.create(user, ['*'], { expiresIn: '1 day' })
    return { user, token: tokenResponse.toJSON() }
  }

  public async logout(user: User) {
    await User.accessTokens.delete(user, user.currentAccessToken.identifier)
  }
}
