import { z } from 'zod'
import { OrderStatus } from '../../enums/OrderStatus'
import { SortOrder } from '../../enums/SortOrder'

const positiveInt = z.coerce
  .number({ invalid_type_error: 'Must be a number or numeric string' })
  .int({ message: 'Must be an integer' })
  .positive({ message: 'Must be a positive integer' })

export const createOrderSchema = z.object({
  waiter_id: positiveInt.optional(),
  items: z
    .array(
      z.object({
        item_id: positiveInt,
        quantity: positiveInt,
      })
    )
    .min(1, 'At least one item is required'),
})

export const updateOrderSchema = z.object({
  params: z.object({
    id: positiveInt,
  }),
  body: z.object({
    status: z.nativeEnum(OrderStatus).optional(),
    waiter_id: positiveInt.optional(),
  }),
})

export const OrderIdSchema = z.object({
  id: positiveInt,
})

export const getAllOrdersSchema = z.object({
  status: z.nativeEnum(OrderStatus).optional(),
  cashier_id: positiveInt.optional(),
  waiter_id: positiveInt.optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.nativeEnum(SortOrder).default(SortOrder.DESC),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
})

export const addItemToOrderSchema = z.object({
  params: z.object({
    id: positiveInt,
  }),
  body: z.object({
    item_id: positiveInt,
    quantity: positiveInt,
  }),
})

export const removeItemFromOrderSchema = z.object({
  orderId: positiveInt,
  itemId: positiveInt,
})

export type CreateOrderInput = z.infer<typeof createOrderSchema>
export type UpdateOrderInput = z.infer<typeof updateOrderSchema>
export type OrderIdInput = z.infer<typeof OrderIdSchema>
export type GetAllOrdersInput = z.infer<typeof getAllOrdersSchema>
export type AddItemToOrderInput = z.infer<typeof addItemToOrderSchema>
export type RemoveItemFromOrderInput = z.infer<typeof removeItemFromOrderSchema>
