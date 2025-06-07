import { NextFunction, Request, Response } from 'express'
import { UserRole } from '../enums/UserRole'
import { AppError } from '../utils/errors'
import { JWTPayload } from './authMiddleware'

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload
    }
  }
}

export const requireRoles = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!res.locals.user) {
      return next(new AppError(401, 'Authentication required'))
    }

    if (!allowedRoles.includes(res.locals.user.role)) {
      return next(new AppError(403, 'Access denied: insufficient permissions'))
    }
    next()
  }
}

export const requireAdmin = requireRoles(UserRole.SUPER_ADMIN, UserRole.MANAGER)
export const requireSuperAdmin = requireRoles(UserRole.SUPER_ADMIN)
export const requireCashier = requireRoles(UserRole.CASHIER)
export const requireWaiter = requireRoles(UserRole.WAITER)
export const requireStaff = requireRoles(
  UserRole.SUPER_ADMIN,
  UserRole.MANAGER,
  UserRole.CASHIER
)
export const requireAll = requireRoles(
  UserRole.SUPER_ADMIN,
  UserRole.MANAGER,
  UserRole.CASHIER,
  UserRole.WAITER
)
