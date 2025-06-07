import { Order } from '../../models'

export interface IOrderRepository {
  create(data: Partial<Order>): Promise<Order>
  findById(id: number): Promise<Order | null>
  findAll(
    filters: any,
    sorting: any,
    pagination: any
  ): Promise<{ orders: Order[]; total: number }>
  update(id: number, data: Partial<Order>): Promise<Order>
  delete(id: number): Promise<void>
  findByWaiterId(waiterId: number): Promise<Order[]>
  findByCashierId(cashierId: number): Promise<Order[]>
  findExpiredOrders(): Promise<Order[]>
  updateExpiredOrders(): Promise<number>
}
