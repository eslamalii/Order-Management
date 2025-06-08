import { Router } from 'express'
import { authContainer } from './authRoutes'
import { itemContainer } from './itemRoutes'
import { Container } from 'inversify'
import { orderContainer } from './orderRoutes'
import { commissionContainer } from './commissionRoutes'

export const createRoutes = (container: Container) => {
  const router = Router()

  router.use('/auth', authContainer(container))
  router.use('/items', itemContainer(container))
  router.use('/orders', orderContainer(container))
  router.use('/reports', commissionContainer(container))

  return router
}
