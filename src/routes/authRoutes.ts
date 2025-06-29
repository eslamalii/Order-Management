import { Router } from 'express'
import { TYPES } from '../config/types'
import { AuthController } from '../controllers/authController'
import {
  registerUserSchema,
  loginUserSchema,
  verifyEmailSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../middleware/validation/authValidation'
import { validateZodRequest } from '../middleware/validation/validateZodRequest'
import { Container } from 'inversify'

export const authContainer = (container: Container) => {
  const router = Router()
  const authController = container.get<AuthController>(TYPES.AuthController)

  router.post(
    '/register',
    validateZodRequest(registerUserSchema, 'body'),
    authController.register
  )

  router.post(
    '/login',
    validateZodRequest(loginUserSchema, 'body'),
    authController.login
  )

  router.post(
    '/verify-email',
    validateZodRequest(verifyEmailSchema, 'body'),
    authController.verifyEmail
  )

  router.post(
    '/forgot-password',
    validateZodRequest(forgotPasswordSchema, 'body'),
    authController.forgotPassword
  )

  router.post(
    '/reset-password',
    validateZodRequest(resetPasswordSchema, 'body'),
    authController.resetPassword
  )

  return router
}
