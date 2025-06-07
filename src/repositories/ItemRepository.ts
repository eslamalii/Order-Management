import { Category, Item } from '../models'
import { IItemRepository } from './Interfaces/IItemRepository'
import { SortOrder } from '../enums/SortOrder'
import { NotFoundError } from '../utils/errors'
import { Op } from 'sequelize'
import { QueryBuilder } from '../utils/QueryBuilder'
import { injectable } from 'inversify'

@injectable()
export class ItemRepository implements IItemRepository {
  async create(data: Partial<Item>): Promise<Item> {
    return await Item.create(data)
  }

  async findById(id: number): Promise<Item | null> {
    return await Item.findByPk(id)
  }

  async findAll(
    filters: any,
    sorting: any,
    pagination: any
  ): Promise<{ items: Item[]; total: number }> {
    const where = QueryBuilder.buildItemFilters(filters)
    const order = QueryBuilder.buildSorting(sorting.sortBy, sorting.sortOrder)
    const { limit, offset } = QueryBuilder.buildPagination(
      pagination.page,
      pagination.limit
    )

    const result = await Item.findAndCountAll({
      where,
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name'],
        },
      ],
      order,
      limit,
      offset,
      distinct: true,
    })

    return {
      items: result.rows,
      total: result.count,
    }
  }

  async update(id: number, data: Partial<Item>): Promise<Item> {
    const item = await Item.findByPk(id)

    if (!item) {
      throw new NotFoundError(`Item not found`)
    }

    await item.update(data)
    return item
  }

  async delete(id: number): Promise<void> {
    const item = await Item.findByPk(id)

    if (!item) {
      throw new NotFoundError(`Item not found`)
    }

    await item.destroy()
  }

  async findAvailableItems(): Promise<Item[]> {
    return await Item.findAll({
      where: {
        stock_qty: { [Op.gt]: 0 },
        expiry_date: { [Op.gte]: new Date() },
        is_active: true,
      },
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name'],
        },
      ],
      order: [['name', SortOrder.ASC]],
    })
  }

  async findExpiringItems(days: number): Promise<Item[]> {
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + days)

    return await Item.findAll({
      where: {
        expiry_date: {
          [Op.and]: [{ [Op.lte]: futureDate }, { [Op.gte]: new Date() }],
        },
        stock_qty: { [Op.gt]: 0 },
      },
      order: [['expiry_date', SortOrder.ASC]],
    })
  }
}
