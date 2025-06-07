import { UserRole } from '../../enums/UserRole'
import { Item } from '../../models'

export interface IItemService {
  createItem(data: Partial<Item>): Promise<Item>
  getItemById(id: number): Promise<Item | null>
  getAllItems(
    queryParams: any,
    userRole?: UserRole
  ): Promise<{
    items: Item[]
    total: number
    page: number
    limit: number
    totalPages: number
  }>
  updateItem(id: number, data: Partial<Item>): Promise<Item>
  deleteItem(id: number): Promise<void>
  checkItemAvailability(id: number, quantity: number): Promise<boolean>
  deductStock(id: number, quantity: number): Promise<void>
  findAvailableItems(): Promise<Item[]>
  findExpiringItems(days: number): Promise<Item[]>
}
