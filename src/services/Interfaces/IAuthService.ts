import { User } from '../../models'

export interface IAuthService {
  registerUser(data: {
    name: string
    email: string
    password: string
    roleId: number
  }): Promise<{
    user: User
    emailToken: string
    emailTokenExpires: Date
  }>

  verifyEmailToken(token: string): Promise<boolean>
  loginUser(data: { email: string; password: string }): Promise<string>
  requestPasswordReset(email: string): Promise<boolean>
  resetPassword(token: string, newPassword: string): Promise<boolean>
}
