import { inject, injectable } from 'inversify'
import { TYPES } from '../config/types'
import { IOrderRepository } from '../repositories/Interfaces/IOrderRepository'
import { IItemService } from './Interfaces/IItemService'
import { Order, OrderItem, User } from '../models'
import { OrderStatus } from '../enums/OrderStatus'
import { QueryBuilder } from '../utils/QueryBuilder'
import { IOrderService } from './Interfaces/IOrderService'
import { NotFoundError, BadRequestError } from '../utils/errors'
import { OrderQuery } from '../enums/interfaces/IOrderQuery'

@injectable()
export class OrderService implements IOrderService {
  constructor(
    @inject(TYPES.OrderRepository) private readonly orderRepo: IOrderRepository,
    @inject(TYPES.ItemService) private readonly itemService: IItemService
  ) {}

  async createOrder(data: {
    cashier_id: number
    waiter_id?: number
    items: Array<{ item_id: number; quantity: number }>
  }): Promise<Order> {
    const { cashier_id, waiter_id, items } = data

    const cashier = await User.findByPk(cashier_id)
    if (!cashier) {
      throw new NotFoundError('Cashier not found')
    }

    if (waiter_id) {
      const waiter = await User.findByPk(waiter_id)
      if (!waiter) {
        throw new NotFoundError('Waiter not found')
      }
    }

    let totalCost = 0
    const orderItems: Array<{
      item_id: number
      quantity: number
      unit_price: number
    }> = []

    for (const orderItem of items) {
      const item = await this.itemService.getItemById(orderItem.item_id)
      if (!item) {
        throw new NotFoundError(`Item with ID ${orderItem.item_id} not found`)
      }

      const isAvailable = await this.itemService.checkItemAvailability(
        orderItem.item_id,
        orderItem.quantity
      )

      if (!isAvailable) {
        throw new BadRequestError(
          `Item "${item.name}" is not available in the requested quantity`
        )
      }

      const itemTotal = Number(item.price) * orderItem.quantity
      totalCost += itemTotal

      orderItems.push({
        item_id: orderItem.item_id,
        quantity: orderItem.quantity,
        unit_price: Number(item.price),
      })
    }

    const order = await this.orderRepo.create({
      cashier_id,
      waiter_id,
      total_cost: totalCost,
      status: OrderStatus.PENDING,
    })

    for (const orderItem of orderItems) {
      await OrderItem.create({
        order_id: order.id,
        item_id: orderItem.item_id,
        quantity: orderItem.quantity,
        unit_price: orderItem.unit_price,
      })

      await this.itemService.deductStock(orderItem.item_id, orderItem.quantity)
    }

    return (await this.orderRepo.findById(order.id)) as Order
  }

  async getOrderById(id: number): Promise<Order | null> {
    return await this.orderRepo.findById(id)
  }

  async getAllOrders(queryParams: OrderQuery): Promise<{
    orders: Order[]
    total: number
    page: number
    limit: number
    totalPages: number
  }> {
    const {
      status,
      cashier_id,
      waiter_id,
      startDate,
      endDate,
      sortBy,
      sortOrder,
      page = 1,
      limit = 10,
    } = queryParams

    const filters: any = {}

    if (cashier_id) filters.cashier_id = cashier_id
    if (waiter_id) filters.waiter_id = waiter_id
    if (status) filters.status = status
    if (startDate) filters.startDate = new Date(startDate)
    if (endDate) filters.endDate = new Date(endDate)

    const pagination = QueryBuilder.buildPagination(page, limit)
    const sorting = { sortBy, sortOrder }

    const result = await this.orderRepo.findAll(filters, sorting, pagination)
    const totalPages = Math.ceil(result.total / limit)

    return {
      orders: result.orders,
      total: result.total,
      page,
      limit,
      totalPages,
    }
  }

  async updateOrder(id: number, data: Partial<Order>): Promise<Order> {
    const order = await this.orderRepo.findById(id)

    if (!order) {
      throw new NotFoundError('Order not found')
    }

    if (order.status === OrderStatus.COMPLETED) {
      throw new BadRequestError('Cannot update completed orders')
    }

    return await this.orderRepo.update(id, data)
  }

  async deleteOrder(id: number): Promise<void> {
    const order = await this.orderRepo.findById(id)

    if (!order) {
      throw new NotFoundError('Order not found')
    }

    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestError('Only pending orders can be deleted')
    }

    await this.orderRepo.delete(id)
  }

  async addItemToOrder(
    orderId: number,
    itemId: number,
    quantity: number
  ): Promise<Order> {
    const order = await this.orderRepo.findById(orderId)

    if (!order) {
      throw new NotFoundError('Order not found')
    }

    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestError('Can only add items to pending orders')
    }

    const isAvailable = await this.itemService.checkItemAvailability(
      itemId,
      quantity
    )
    if (!isAvailable) {
      throw new BadRequestError(
        'Item is not available in the requested quantity'
      )
    }

    const item = await this.itemService.getItemById(itemId)
    if (!item) {
      throw new NotFoundError('Item not found')
    }

    const existingOrderItem = await OrderItem.findOne({
      where: { order_id: orderId, item_id: itemId },
    })

    if (existingOrderItem) {
      const newQuantity = existingOrderItem.quantity + quantity
      const additionalCost = Number(item.price) * quantity

      await existingOrderItem.update({ quantity: newQuantity })
      await order.update({
        total_cost: Number(order.total_cost) + additionalCost,
      })
    } else {
      // Add new item
      const itemCost = Number(item.price) * quantity

      await OrderItem.create({
        order_id: orderId,
        item_id: itemId,
        quantity,
        unit_price: Number(item.price),
      })

      await order.update({
        total_cost: Number(order.total_cost) + itemCost,
      })
    }

    await this.itemService.deductStock(itemId, quantity)

    return (await this.orderRepo.findById(orderId)) as Order
  }

  async removeItemFromOrder(orderId: number, itemId: number): Promise<Order> {
    const order = await this.orderRepo.findById(orderId)

    if (!order) {
      throw new NotFoundError('Order not found')
    }

    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestError('Can only remove items from pending orders')
    }

    const orderItem = await OrderItem.findOne({
      where: { order_id: orderId, item_id: itemId },
    })

    if (!orderItem) {
      throw new NotFoundError('Item not found in this order')
    }

    const itemCost = Number(orderItem.unit_price) * orderItem.quantity

    await orderItem.destroy()
    await order.update({
      total_cost: Number(order.total_cost) - itemCost,
    })

    return (await this.orderRepo.findById(orderId)) as Order
  }

  async completeOrder(id: number): Promise<Order> {
    const order = await this.orderRepo.findById(id)

    if (!order) {
      throw new NotFoundError('Order not found')
    }

    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestError('Only pending orders can be completed')
    }

    return await this.orderRepo.update(id, { status: OrderStatus.COMPLETED })
  }

  async assignWaiterToOrder(orderId: number, waiterId: number): Promise<Order> {
    const order = await this.orderRepo.findById(orderId)

    if (!order) {
      throw new NotFoundError('Order not found')
    }

    const waiter = await User.findByPk(waiterId)
    if (!waiter) {
      throw new NotFoundError('Waiter not found')
    }

    return await this.orderRepo.update(orderId, { waiter_id: waiterId })
  }

  async updateExpiredOrders(): Promise<number> {
    return await this.orderRepo.updateExpiredOrders()
  }
}
