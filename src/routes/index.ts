import { Router } from 'express'
import { authContainer } from './authRoutes'
import { itemContainer } from './itemRoutes'
import { Container } from 'inversify'
import { orderContainer } from './orderRoutes'

export const createRoutes = (container: Container) => {
  const router = Router()

  router.use('/auth', authContainer(container))
  router.use('/items', itemContainer(container))
  router.use('/orders', orderContainer(container))

  return router
}
