import { Request, Response, NextFunction } from 'express'
import { inject, injectable } from 'inversify'
import { TYPES } from '../config/types'
import { ApiResponseHandler } from '../utils/apiResponse'
import { asyncHandler } from '../utils/errorHandler'
import { IAuthService } from '../services/Interfaces/IAuthService'

@injectable()
export class AuthController {
  constructor(
    @inject(TYPES.AuthService) private readonly authService: IAuthService
  ) {}

  register = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { name, email, password, roleId } = res.locals.validatedData

      const result = await this.authService.registerUser({
        name,
        email,
        password,
        roleId,
      })

      return ApiResponseHandler.success(
        res,
        {
          user: {
            id: result.user.id,
            name: result.user.name,
            email: result.user.email,
            is_verified: result.user.is_verified,
            role_id: result.user.role_id,
          },
          message:
            'Registration successful. Please check your email for verification.',
          emailTokenExpires: result.emailTokenExpires,
        },
        'User registered successfully. Please verify your email.',
        201
      )
    }
  )

  login = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { email, password } = res.locals.validatedData

      const token = await this.authService.loginUser({ email, password })

      return ApiResponseHandler.success(
        res,
        {
          token,
          expiresIn: process.env.JWT_EXPIRATION || '1d',
        },
        'Login successful',
        200
      )
    }
  )

  verifyEmail = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { token } = res.locals.validatedData

      const isVerified = await this.authService.verifyEmailToken(token)

      if (!isVerified) {
        return ApiResponseHandler.badRequest(
          res,
          'Invalid or expired verification token'
        )
      }

      return ApiResponseHandler.success(
        res,
        { verified: true },
        'Email verified successfully',
        200
      )
    }
  )

  forgotPassword = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { email } = res.locals.validatedData

      await this.authService.requestPasswordReset(email)

      return ApiResponseHandler.success(
        res,
        { requested: true },
        'If the email exists, a password reset link has been sent',
        200
      )
    }
  )

  resetPassword = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { token, newPassword } = res.locals.validatedData

      const result = await this.authService.resetPassword(token, newPassword)

      if (!result) {
        return ApiResponseHandler.badRequest(
          res,
          'Invalid or expired reset token'
        )
      }

      return ApiResponseHandler.success(
        res,
        { reset: true },
        'Password reset successfully',
        200
      )
    }
  )
}
