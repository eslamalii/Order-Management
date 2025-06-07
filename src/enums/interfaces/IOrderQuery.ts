import { OrderStatus } from '../OrderStatus'
import { SortOrder } from '../SortOrder'

export interface OrderQuery {
  status?: OrderStatus
  cashier_id?: number
  waiter_id?: number
  startDate?: string
  endDate?: string
  sortBy?: string
  sortOrder?: SortOrder
  page?: number
  limit?: number
}
