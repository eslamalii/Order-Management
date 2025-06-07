import { inject, injectable } from 'inversify'
import { Request, Response } from 'express'
import { TYPES } from '../config/types'
import { IOrderService } from '../services/Interfaces/IOrderService'
import { asyncHandler } from '../utils/errorHandler'
import { ApiResponseHandler } from '../utils/apiResponse'

@injectable()
export class OrderController {
  constructor(
    @inject(TYPES.OrderService) private orderService: IOrderService
  ) {}

  createOrder = asyncHandler(async (req: Request, res: Response) => {
    const data = res.locals.validatedData
    const { id: cashier_id } = res.locals.user

    const order = await this.orderService.createOrder({
      ...data,
      cashier_id,
    })

    return ApiResponseHandler.success(
      res,
      order,
      'Order created successfully',
      201
    )
  })

  getAllOrders = asyncHandler(async (req: Request, res: Response) => {
    const queryParams = req.query
    const { role, id: userId } = res.locals.user

    const result = await this.orderService.getAllOrders(
      queryParams,
      role,
      userId
    )

    return ApiResponseHandler.success(
      res,
      result,
      'Orders retrieved successfully'
    )
  })

  getOrderById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = res.locals.validatedData
    const { role, id: userId } = res.locals.user

    const order = await this.orderService.getOrderById(id, role, userId)

    if (!order) {
      return ApiResponseHandler.notFound(res, 'Order not found')
    }

    return ApiResponseHandler.success(
      res,
      order,
      'Order retrieved successfully'
    )
  })

  updateOrder = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = res.locals.validatedData
    const { id } = validatedData.params
    const updateData = validatedData.body
    const { role, id: userId } = res.locals.user

    const order = await this.orderService.updateOrder(
      id,
      updateData,
      role,
      userId
    )

    return ApiResponseHandler.success(res, order, 'Order updated successfully')
  })

  deleteOrder = asyncHandler(async (req: Request, res: Response) => {
    const { id } = res.locals.validatedData
    const { role, id: userId } = res.locals.user

    await this.orderService.deleteOrder(id, role, userId)

    return ApiResponseHandler.success(res, null, 'Order deleted successfully')
  })

  addItemToOrder = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = res.locals.validatedData
    const { id } = validatedData.params
    const { item_id, quantity } = validatedData.body

    const order = await this.orderService.addItemToOrder(id, item_id, quantity)

    return ApiResponseHandler.success(
      res,
      order,
      'Item added to order successfully'
    )
  })

  removeItemFromOrder = asyncHandler(async (req: Request, res: Response) => {
    const { orderId, itemId } = res.locals.validatedData

    const order = await this.orderService.removeItemFromOrder(orderId, itemId)

    return ApiResponseHandler.success(
      res,
      order,
      'Item removed from order successfully'
    )
  })

  completeOrder = asyncHandler(async (req: Request, res: Response) => {
    const { id } = res.locals.validatedData
    const { role, id: userId } = res.locals.user

    const order = await this.orderService.completeOrder(id, role, userId)

    return ApiResponseHandler.success(
      res,
      order,
      'Order completed successfully'
    )
  })

  assignWaiter = asyncHandler(async (req: Request, res: Response) => {
    const { orderId } = req.params
    const { waiterId } = req.body

    const order = await this.orderService.assignWaiterToOrder(
      parseInt(orderId),
      waiterId
    )

    return ApiResponseHandler.success(
      res,
      order,
      'Waiter assigned to order successfully'
    )
  })
}
