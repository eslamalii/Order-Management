import { OrderStatus } from '../OrderStatus'

export interface IOrderFilters {
  status?: OrderStatus
  cashier_id?: number
  waiter_id?: number
  startDate?: Date
  endDate?: Date
}
