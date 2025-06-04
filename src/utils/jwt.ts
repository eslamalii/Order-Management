import jwt, { SignOptions } from 'jsonwebtoken'
import { config } from '../config/config'

export interface JWTPayload {
  userId: string
  role: string
}

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
      userId: decoded.userId as string,
      role: decoded.role as string,
    }
  } catch (error) {
    throw new Error('Invalid or expired token')
  }
}
