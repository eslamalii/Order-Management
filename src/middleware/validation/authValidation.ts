import { z } from 'zod'

// Accepts numbers or numeric strings; rejects anything else.
export const positiveInt = z.coerce
  .number({ invalid_type_error: 'Must be a number or numeric string' })
  .int({ message: 'Must be an integer' })
  .positive({ message: 'Must be a positive integer' })

// Zero or any positive integer
export const nonNegativeInt = z.coerce
  .number({ invalid_type_error: 'Must be a number or numeric string' })
  .int({ message: 'Must be an integer' })
  .min(0, { message: 'Must be zero or a positive integer' })

// Any positive (possibly decimal) number
export const positiveDecimal = z.coerce
  .number({ invalid_type_error: 'Must be a number or numeric string' })
  .positive({ message: 'Must be a positive number' })

// “ISO‐8601 date string → Date, and must be in the future.”
export const futureDate = z.coerce
  .date({ invalid_type_error: 'Invalid date format' })
  .refine((date) => date.getTime() >= Date.now(), {
    message: 'Date must be in the future',
  })

export const email = z
  .string()
  .email('Invalid email format')
  .max(150, { message: 'Email is too long (max 150 chars)' })

export const password = z
  .string()
  .min(6, { message: 'Password must be at least 6 characters' })
  .max(255, { message: 'Password is too long (max 255 chars)' })

export const registerUserSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters' })
    .max(100, { message: 'Name is too long (max 100 chars)' }),
  email,
  password,
  roleId: positiveInt,
})

export const loginUserSchema = z.object({
  email,
  password,
})

export const verifyEmailSchema = z.object({
  token: z.string().min(1, { message: 'Token is required' }),
})

export const forgotPasswordSchema = z.object({
  email,
})

export const resetPasswordSchema = z.object({
  token: z.string().min(1, { message: 'Token is required' }),
  newPassword: password,
})

export type RegisterUserInput = z.infer<typeof registerUserSchema>
export type LoginUserInput = z.infer<typeof loginUserSchema>
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
