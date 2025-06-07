import { Router } from 'express'
import { authContainer } from './authRoutes'
import { itemContainer } from './itemRoutes'
import { Container } from 'inversify'

export const createRoutes = (container: Container) => {
  const router = Router()

  router.use('/auth', authContainer(container))
  router.use('/items', itemContainer(container))

  return router
}
