import { Op } from 'sequelize'
import { Category, Item, Order, OrderItem, User } from '../models'
import { IOrderRepository } from './Interfaces/IOrderRepository'
import { NotFoundError } from '../utils/errors'
import { OrderStatus } from '../enums/OrderStatus'

export class OrderRepository implements IOrderRepository {
  async create(data: Partial<Order>): Promise<Order> {
    return await Order.create(data)
  }

  async findById(id: number): Promise<Order | null> {
    return await Order.findByPk(id, {
      include: [
        {
          model: User,
          as: 'cashier',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: User,
          as: 'waiter',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: OrderItem,
          as: 'orderItems',
          include: [
            {
              model: Item,
              as: 'item',
              attributes: ['id', 'name', 'price', 'description'],
              include: [
                {
                  model: Category,
                  as: 'category',
                  attributes: ['id', 'name'],
                },
              ],
            },
          ],
        },
      ],
    })
  }
  async findAll(
    filters: any,
    sorting: any,
    pagination: any
  ): Promise<{ orders: Order[]; total: number }> {
    const where: any = {}

    if (filters.status) {
      where.status = filters.status
    }

    if (filters.cashier_id) {
      where.cashier_id = filters.cashier_id
    }

    if (filters.waiter_id) {
      where.waiter_id = filters.waiter_id
    }

    if (filters.startDate || filters.endDate) {
      where.created_at = {}
      if (filters.startDate) {
        where.created_at[Op.gte] = filters.startDate
      }
      if (filters.endDate) {
        where.created_at[Op.lte] = filters.endDate
      }
    }

    const orderSort: any = sorting.sortBy
      ? [[sorting.sortBy, sorting.sortOrder || 'DESC']]
      : [['created_at', 'DESC']]

    const result = await Order.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'cashier',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: User,
          as: 'waiter',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: OrderItem,
          as: 'orderItems',
          include: [
            {
              model: Item,
              as: 'item',
              attributes: ['id', 'name', 'price'],
              include: [
                {
                  model: Category,
                  as: 'category',
                  attributes: ['id', 'name'],
                },
              ],
            },
          ],
        },
      ],
      order: orderSort,
      limit: pagination.limit,
      offset: pagination.offset,
      distinct: true,
    })

    return {
      orders: result.rows,
      total: result.count,
    }
  }

  async update(id: number, data: Partial<Order>): Promise<Order> {
    const order = await Order.findByPk(id)

    if (!order) {
      throw new NotFoundError('Order not found')
    }

    await order.update(data)
    return order
  }

  async delete(id: number): Promise<void> {
    const order = await Order.findByPk(id)

    if (!order) {
      throw new NotFoundError('Order not found')
    }

    await order.destroy()
  }

  async findByWaiterId(waiterId: number): Promise<Order[]> {
    return await Order.findAll({
      where: { waiter_id: waiterId },
      include: [
        {
          model: User,
          as: 'cashier',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: OrderItem,
          as: 'orderItems',
          include: [
            {
              model: Item,
              as: 'item',
              attributes: ['id', 'name', 'price'],
            },
          ],
        },
      ],
      order: [['created_at', 'DESC']],
    })
  }

  async findByCashierId(cashierId: number): Promise<Order[]> {
    return await Order.findAll({
      where: { cashier_id: cashierId },
      include: [
        {
          model: User,
          as: 'waiter',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: OrderItem,
          as: 'orderItems',
          include: [
            {
              model: Item,
              as: 'item',
              attributes: ['id', 'name', 'price'],
            },
          ],
        },
      ],
      order: [['created_at', 'DESC']],
    })
  }

  async findExpiredOrders(): Promise<Order[]> {
    const fourHoursAgo = new Date()
    fourHoursAgo.setHours(fourHoursAgo.getHours() - 4)

    return await Order.findAll({
      where: {
        status: OrderStatus.PENDING,
        created_at: {
          [Op.lte]: fourHoursAgo,
        },
      },
    })
  }

  async updateExpiredOrders(): Promise<number> {
    const fourHoursAgo = new Date()
    fourHoursAgo.setHours(fourHoursAgo.getHours() - 4)

    const [affectedCount] = await Order.update(
      { status: OrderStatus.EXPIRED },
      {
        where: {
          status: OrderStatus.PENDING,
          created_at: {
            [Op.lte]: fourHoursAgo,
          },
        },
      }
    )

    return affectedCount
  }
}
