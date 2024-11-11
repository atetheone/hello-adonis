import User from '#models/user'

export class AuthService {
  public async register(userData: any) {
    const user = await User.create(userData)
    return user
  }

  public async login(email: string, password: string) {
    const user = await User.verifyCredentials(email, password)
    const tokenResponse = await User.accessTokens.create(user, ['*'], { expiresIn: '1 day' })
    return { user, token: tokenResponse.toJSON() }
  }

  public async logout(user: User) {
    await User.accessTokens.delete(user, user!.currentAccessToken.identifier)
  }
}
