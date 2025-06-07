import { z } from 'zod'
import { ItemCategory } from '../../enums/ItemCategory'
import { ItemSortField } from '../../enums/ItemSortField'
import { SortOrder } from '../../enums/SortOrder'

const positiveInt = z.coerce
  .number({ invalid_type_error: 'Must be a number or numeric string' })
  .int({ message: 'Must be an integer' })
  .positive({ message: 'Must be a positive integer' })

const nonNegativeInt = z.coerce
  .number({ invalid_type_error: 'Must be a number or numeric string' })
  .int({ message: 'Must be an integer' })
  .min(0, { message: 'Must be zero or a positive integer' })

const positiveDecimal = z.coerce
  .number({ invalid_type_error: 'Must be a number or numeric string' })
  .positive({ message: 'Must be a positive number' })

const itemName = z
  .string()
  .min(1, 'Name is required')
  .max(100, 'Name too long')
  .trim()

const itemDescription = z
  .string()
  .max(500, 'Description too long')
  .trim()
  .optional()

// Create item validation
export const createItemSchema = z.object({
  name: itemName,
  description: itemDescription,
  price: positiveDecimal,
  category_id: positiveInt,
  expiry_date: z
    .string()
    .datetime({ message: 'Invalid date format. Use ISO 8601 format' })
    .optional(),
  stock_qty: nonNegativeInt.default(0),
  is_active: z.boolean().default(true),
})

// Update item validation
export const updateItemSchema = z.object({
  params: z.object({
    id: positiveInt,
  }),
  body: z.object({
    name: itemName.optional(),
    description: itemDescription,
    price: positiveDecimal.optional(),
    category_id: positiveInt.optional(),
    expiry_date: z
      .string()
      .datetime({ message: 'Invalid date format. Use ISO 8601 format' })
      .optional(),
    stock_qty: nonNegativeInt.optional(),
    is_active: z.boolean().optional(),
  }),
})

// Get item by ID validation
export const ItemIdSchema = z.object({
  id: positiveInt,
})

// Get all items validation
export const getAllItemsSchema = z.object({
  query: z
    .object({
      category: z.nativeEnum(ItemCategory).optional(),
      sortBy: z.nativeEnum(ItemSortField).default(ItemSortField.NAME),
      sortOrder: z.nativeEnum(SortOrder).default(SortOrder.DESC),
      page: z.coerce.number().int().positive().default(1),
      limit: z.coerce.number().int().min(1).max(100).default(10),
    })
    .default({}), // Provide default empty object
})

// Check availability validation
export const checkAvailabilitySchema = z.object({
  params: z.object({
    id: positiveInt,
  }),
  query: z.object({
    quantity: positiveInt,
  }),
})

// Export types for better type safety
export type CreateItemInput = z.infer<typeof createItemSchema>
export type UpdateItemInput = z.infer<typeof updateItemSchema>
export type ItemIdInput = z.infer<typeof ItemIdSchema>
export type GetAllItemsInput = z.infer<typeof getAllItemsSchema>
export type CheckAvailabilityInput = z.infer<typeof checkAvailabilitySchema>
