import { Order, literal } from 'sequelize'
import { SortOrder } from '../enums/SortOrder'
import { ItemSortField } from '../enums/ItemSortField'
import { ItemCategory } from '../enums/ItemCategory'
import { Op } from 'sequelize'

export class QueryBuilder {
  static buildPagination(page: number, limit: number) {
    const offset = (page - 1) * limit

    return {
      page,
      limit,
      offset,
    }
  }

  static buildSorting(sortBy?: string, sortOrder?: SortOrder): Order {
    const order = sortOrder || SortOrder.ASC

    if (sortBy === ItemSortField.STOCK_VALUE) {
      return [[literal('price * stock_qty'), order]]
    }

    if (sortBy) {
      return [[sortBy, order]]
    }

    return [['created_at', order]]
  }

  static buildItemFilters(filters: any): any {
    const where: any = {}

    if (filters.category) {
      where['$category.name$'] = filters.category
    }

    if (filters.available) {
      where.stock_qty = { [Op.gt]: 0 }
      where.expiry_date = { [Op.gte]: new Date() }
      where.is_active = true
    }

    return where
  }
}
