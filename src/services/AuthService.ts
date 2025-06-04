import { inject, injectable } from 'inversify'
import { TYPES } from '../config/types'
import { IUserRepository } from '../repositories/Interfaces/IUserRepository'
import { comparePassword, hashPassword } from '../utils/bycrpt'
import {
  EmailVerificationToken,
  PasswordResetToken,
  Role,
  User,
} from '../models'
import { signToken } from '../utils/jwt'
import crypto from 'crypto'
import { config } from '../config/config'
import { IAuthService } from './Interfaces/IAuthService'

@injectable()
export class AuthService implements IAuthService {
  constructor(
    @inject(TYPES.UserRepository) private readonly userRepo: IUserRepository
  ) {}

  async registerUser(data: {
    name: string
    email: string
    password: string
    roleId: number
  }): Promise<{
    user: User
    emailToken: string
    emailTokenExpires: Date
  }> {
    const { name, email, password, roleId } = data

    const existing = await this.userRepo.findByEmail(email)

    if (existing) {
      throw new Error('User with this email already exists')
    }

    const passwordHash = await hashPassword(password)

    const user = await this.userRepo.create({
      name,
      email,
      password: passwordHash,
      roleId,
    })

    // Will be change to actual email service later
    const emailToken = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date()
    expiresAt.setHours(
      expiresAt.getHours() + config.tokens.passwordResetExpirationHours
    )

    await EmailVerificationToken.create({
      user_id: user.id,
      token: emailToken,
      expires_at: expiresAt,
    })

    return { user, emailToken, emailTokenExpires: expiresAt }
  }

  async verifyEmailToken(token: string): Promise<boolean> {
    const tokenRecord = await EmailVerificationToken.findOne({
      where: { token },
    })

    if (!tokenRecord) return false

    if (tokenRecord.expires_at < new Date()) {
      await tokenRecord.destroy()
      return false
    }

    const user = await this.userRepo.findById(tokenRecord.user_id)

    if (!user) return false

    user.is_verified = true
    await this.userRepo.save(user)
    await tokenRecord.destroy()
    return true
  }

  async loginUser(data: { email: string; password: string }): Promise<string> {
    const { email, password } = data

    const user = await this.userRepo.findByEmail(email)

    if (!user) {
      throw new Error('User not found')
    }

    if (!user.is_verified) {
      throw new Error('Email not verified')
    }

    const isPasswordValid = await comparePassword(password, user.password)

    if (!isPasswordValid) {
      throw new Error('Invalid credentials')
    }

    const role = (await Role.findByPk(user.role_id))?.name || 'Unknown'

    const token = signToken({ userId: user.id.toString(), role })
    return token
  }

  async requestPasswordReset(email: string): Promise<boolean> {
    const user = await this.userRepo.findByEmail(email)

    if (!user) return true

    // Will be change to actual email service later
    const resetToken = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date()
    expiresAt.setHours(
      expiresAt.getHours() + config.tokens.passwordResetExpirationHours
    )

    await PasswordResetToken.create({
      user_id: user.id,
      token: resetToken,
      expires_at: expiresAt,
    })

    console.log(
      `  http://localhost:${process.env.PORT}/api/auth/reset-password?token=${resetToken}`
    )
    return true
  }

  async resetPassword(token: string, newPassword: string): Promise<boolean> {
    const tokenRecord = await PasswordResetToken.findOne({ where: { token } })
    if (!tokenRecord) return false

    if (tokenRecord.expires_at < new Date()) {
      await tokenRecord.destroy()
      return false
    }

    const user = await this.userRepo.findById(tokenRecord.user_id)
    if (!user) return false

    user.password = await hashPassword(newPassword)
    await this.userRepo.save(user)
    await tokenRecord.destroy()
    return true
  }
}
