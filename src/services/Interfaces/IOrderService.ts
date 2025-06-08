import { Order } from '../../models'
import { UserRole } from '../../enums/UserRole'
import { OrderQuery } from '../../enums/interfaces/IOrderQuery'

export interface IOrderService {
  createOrder(data: {
    cashier_id: number
    waiter_id?: number
    items: Array<{ item_id: number; quantity: number }>
  }): Promise<Order>
  getOrderById(id: number): Promise<Order | null>
  getAllOrders(queryParams: OrderQuery): Promise<{
    orders: Order[]
    total: number
    page: number
    limit: number
    totalPages: number
  }>
  updateOrder(id: number, data: Partial<Order>): Promise<Order>
  deleteOrder(id: number, userRole: UserRole, userId: number): Promise<void>
  addItemToOrder(
    orderId: number,
    itemId: number,
    quantity: number
  ): Promise<Order>
  removeItemFromOrder(orderId: number, itemId: number): Promise<Order>
  completeOrder(id: number, userRole: UserRole, userId: number): Promise<Order>
  assignWaiterToOrder(orderId: number, waiterId: number): Promise<Order>
  updateExpiredOrders(): Promise<number>
}
