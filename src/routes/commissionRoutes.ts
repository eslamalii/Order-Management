import { TYPES } from '../config/types'
import { CommissionController } from '../controllers/commissionController'
import { isAuthenticated } from '../middleware/authMiddleware'
import { requireAll } from '../middleware/roleMiddleware'
import { commissionReportSchema } from '../middleware/validation/commissionValidation'
import { validateZodRequest } from '../middleware/validation/validateZodRequest'
import { Router } from 'express'
import { Container } from 'inversify'

export const commissionContainer = (container: Container) => {
  const router = Router()

  const commissionController = container.get<CommissionController>(
    TYPES.CommissionController
  )

  router.use(isAuthenticated)

  router.get(
    '/waiter-report',
    requireAll,
    validateZodRequest(commissionReportSchema, 'query'),
    commissionController.getWaiterCommissionReport
  )

  return router
}
