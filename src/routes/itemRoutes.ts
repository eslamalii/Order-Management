import { validateCombinedRequest } from '../middleware/validation/validateCombinedRequest'
import {
  createItemSchema,
  updateItemSchema,
  getAllItemsSchema,
  checkAvailabilitySchema,
  ItemIdSchema,
} from '../middleware/validation/itemValidation'
import { Router } from 'express'
import { ItemController } from '../controllers/itemController'
import { TYPES } from '../config/types'
import { isAuthenticated } from '../middleware/authMiddleware'
import {
  requireAdmin,
  requireAll,
  requireStaff,
} from '../middleware/roleMiddleware'
import { validateZodRequest } from '../middleware/validation/validateZodRequest'
import { Container } from 'inversify'

export const itemContainer = (container: Container) => {
  const router = Router()

  const itemController = container.get<ItemController>(TYPES.ItemController)

  router.use(isAuthenticated)
  router.post(
    '/',
    requireAdmin,
    validateZodRequest(createItemSchema, 'body'),
    itemController.createItem
  )
  router.get(
    '/',
    requireAll,
    validateZodRequest(getAllItemsSchema, 'query'),
    itemController.getAllItems
  )
  router.get(
    '/:id',
    requireStaff,
    validateZodRequest(ItemIdSchema, 'params'),
    itemController.getItemById
  )
  router.put(
    '/:id',
    requireAdmin,
    validateCombinedRequest(updateItemSchema),
    itemController.updateItem
  )
  router.delete(
    '/:id',
    requireAdmin,
    validateZodRequest(ItemIdSchema, 'params'),
    itemController.deleteItem
  )
  router.get(
    '/:id/availability',
    requireStaff,
    validateCombinedRequest(checkAvailabilitySchema),
    itemController.checkAvailability
  )

  return router
}
