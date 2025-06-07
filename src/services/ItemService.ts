import { inject, injectable } from 'inversify'
import { IItemService } from './Interfaces/IItemService'
import { TYPES } from '../config/types'
import { IItemRepository } from '../repositories/Interfaces/IItemRepository'
import { Category, Item } from '../models'
import { AppError } from '../utils/errors'
import { UserRole } from '../enums/UserRole'

@injectable()
export class ItemService implements IItemService {
  constructor(
    @inject(TYPES.ItemRepository) private readonly itemRepo: IItemRepository
  ) {}

  async createItem(data: Partial<Item>): Promise<Item> {
    if (data.category_id) {
      const category = await Category.findByPk(data.category_id)
      if (!category) {
        throw new AppError(400, `Category with ID doesn't exist`)
      }
    }
    return await this.itemRepo.create(data)
  }

  async getItemById(id: number): Promise<Item | null> {
    return await this.itemRepo.findById(id)
  }

  async getAllItems(
    queryParams: any = {},
    userRole: UserRole
  ): Promise<{
    items: Item[]
    total: number
    page: number
    limit: number
    totalPages: number
  }> {
    const { category, sortBy, sortOrder, page, limit } = queryParams

    const filters: any = {}
    if (category) {
      filters.category = category
    }

    if (userRole === UserRole.WAITER) {
      filters.available = true
    }

    const result = await this.itemRepo.findAll(
      filters,
      { sortBy, sortOrder },
      { page, limit }
    )

    const totalPages = Math.ceil(result.total / limit)

    return {
      items: result.items,
      total: result.total,
      page,
      limit,
      totalPages,
    }
  }

  async updateItem(id: number, data: Partial<Item>): Promise<Item> {
    const existingItem = await this.itemRepo.findById(id)
    if (!existingItem) {
      throw new AppError(404, `Item not found`)
    }

    return await this.itemRepo.update(id, data)
  }

  async deleteItem(id: number): Promise<void> {
    const existingItem = await this.itemRepo.findById(id)
    if (!existingItem) {
      throw new AppError(404, `Item not found`)
    }

    await this.itemRepo.delete(id)
  }

  async checkItemAvailability(id: number, quantity: number): Promise<boolean> {
    const item = await this.itemRepo.findById(id)
    if (!item) return false
    if (this.isExpired(item)) return false

    return (item.stock_qty || 0) >= quantity
  }

  async deductStock(id: number, quantity: number): Promise<void> {
    const item = await this.itemRepo.findById(id)
    if (!item) {
      throw new AppError(404, `Item not found`)
    }

    const currStock = item.stock_qty || 0
    if (currStock < quantity) {
      throw new AppError(400, `Insufficient stock available`)
    }

    const newStock = currStock - quantity
    await this.itemRepo.update(id, { stock_qty: newStock })
  }

  async findAvailableItems(): Promise<Item[]> {
    return await this.itemRepo.findAvailableItems()
  }

  async findExpiringItems(days: number): Promise<Item[]> {
    return await this.itemRepo.findExpiringItems(days)
  }

  private isExpired(item: Item): boolean {
    if (!item.expiry_date) return false
    return new Date(item.expiry_date) < new Date()
  }
}
