import { NextFunction, Request, Response } from 'express'
import { JWTPayload, verifyToken } from '../utils/jwt'

export interface AuthenticatedRequest extends Request {
  user?: JWTPayload & { iat: number; exp: number }
}

export const authenticateJWT = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header is missing' })
  }

  const [scheme, token] = authHeader.split(' ')
  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Invalid authorization format' })
  }

  try {
    const payload = verifyToken(token)

    req.user = payload as any
    next()
  } catch (error) {
    console.error('JWT verification error:', error)
    return res.status(401).json({ message: 'Invalid or expired token' })
  }
}
