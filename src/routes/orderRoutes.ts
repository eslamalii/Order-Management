import { Router } from 'express'
import { OrderController } from '../controllers/orderController'
import { TYPES } from '../config/types'
import { isAuthenticated } from '../middleware/authMiddleware'
import {
  requireStaff,
  requireCashier,
  requireAdmin,
} from '../middleware/roleMiddleware'
import { validateZodRequest } from '../middleware/validation/validateZodRequest'
import { validateCombinedRequest } from '../middleware/validation/validateCombinedRequest'
import {
  createOrderSchema,
  updateOrderSchema,
  getAllOrdersSchema,
  addItemToOrderSchema,
  removeItemFromOrderSchema,
  OrderIdSchema,
} from '../middleware/validation/orderValidation'
import { Container } from 'inversify'

export const orderContainer = (container: Container) => {
  const router = Router()

  const orderController = container.get<OrderController>(TYPES.OrderController)

  router.use(isAuthenticated)

  router.post(
    '/',
    requireCashier,
    validateZodRequest(createOrderSchema, 'body'),
    orderController.createOrder
  )

  router.get(
    '/',
    requireAdmin,
    validateZodRequest(getAllOrdersSchema, 'query'),
    orderController.getAllOrders
  )

  router.get(
    '/:id',
    requireStaff,
    validateZodRequest(OrderIdSchema, 'params'),
    orderController.getOrderById
  )

  router.put(
    '/:id',
    requireStaff,
    validateCombinedRequest(updateOrderSchema),
    orderController.updateOrder
  )

  router.delete(
    '/:id',
    requireAdmin,
    validateZodRequest(OrderIdSchema, 'params'),
    orderController.deleteOrder
  )

  router.post(
    '/:id/items',
    requireStaff,
    validateCombinedRequest(addItemToOrderSchema),
    orderController.addItemToOrder
  )

  router.delete(
    '/:orderId/items/:itemId',
    requireStaff,
    validateZodRequest(removeItemFromOrderSchema, 'params'),
    orderController.removeItemFromOrder
  )

  router.patch(
    '/:id/complete',
    requireStaff,
    validateZodRequest(OrderIdSchema, 'params'),
    orderController.completeOrder
  )

  router.patch(
    '/:orderId/assign-waiter',
    requireStaff,
    orderController.assignWaiter
  )

  return router
}
