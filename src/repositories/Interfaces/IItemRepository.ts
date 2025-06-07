import { Item } from '../../models'

export interface IItemRepository {
  create(data: Partial<Item>): Promise<Item>
  findById(id: number): Promise<Item | null>
  findAll(
    filters: any,
    sorting: any,
    pagination: any
  ): Promise<{ items: Item[]; total: number }>
  update(id: number, data: Partial<Item>): Promise<Item>
  delete(id: number): Promise<void>
  findAvailableItems(): Promise<Item[]>
  findExpiringItems(days: number): Promise<Item[]>
}
