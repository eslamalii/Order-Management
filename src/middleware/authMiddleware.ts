import { NextFunction, Request, Response } from 'express'
import { AuthenticationError } from '../utils/errors'
import jwt from 'jsonwebtoken'

export interface JWTPayload {
  id: number
  email?: string
  role: string
  iat?: number
  exp?: number
}

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload
    }
  }
}

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      throw new AuthenticationError('No token provided')
    }

    const jwtSecret = process.env.JWT_SECRET
    if (!jwtSecret) {
      throw new Error('JWT_SECRET environment variable is not set')
    }

    const decoded = jwt.verify(token, jwtSecret) as JWTPayload

    res.locals.user = decoded
    next()
  } catch (error) {
    next(new AuthenticationError('Invalid token'))
  }
}
