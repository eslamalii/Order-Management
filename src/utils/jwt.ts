import jwt, { SignOptions } from 'jsonwebtoken'
import { config } from '../config/config'
import { JWTPayload } from '../middleware/authMiddleware'

export function signToken(payload: JWTPayload): string {
  const options: SignOptions = {
    expiresIn: config.jwt.expiresIn as SignOptions['expiresIn'],
  }
  return jwt.sign(payload, config.jwt.secret, options)
}

export function verifyToken(token: string): JWTPayload {
  try {
    const decoded = jwt.verify(token, config.jwt.secret) as jwt.JwtPayload
    return {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      iat: decoded.iat,
      exp: decoded.exp,
    }
  } catch (error) {
    throw new Error('Invalid or expired token')
  }
}
