import { inject, injectable } from 'inversify'
import { TYPES } from '../config/types'
import { IItemService } from '../services/Interfaces/IItemService'
import { asyncHandler } from '../utils/errorHandler'
import { ApiResponseHandler } from '../utils/apiResponse'
import { UserRole } from '../enums/UserRole'
import { Request, Response } from 'express'

@injectable()
export class ItemController {
  constructor(@inject(TYPES.ItemService) private itemService: IItemService) {}

  createItem = asyncHandler(async (req: Request, res: Response) => {
    const data = res.locals.validatedData

    const item = await this.itemService.createItem(data)

    return ApiResponseHandler.success(
      res,
      item,
      'Item created successfully',
      201
    )
  })

  getAllItems = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = res.locals.validatedData
    const query = validatedData.query || {}
    const { role } = res.locals.user

    const result = await this.itemService.getAllItems(query, role)

    return ApiResponseHandler.success(
      res,
      result,
      'Items retrieved successfully'
    )
  })

  getItemById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = res.locals.validatedData
    const { role } = res.locals.user

    const item = await this.itemService.getItemById(id)

    if (!item) {
      return ApiResponseHandler.notFound(res, 'Item not found')
    }

    // For waiters, check if item is available
    if (role === UserRole.WAITER) {
      const isAvailable = await this.itemService.checkItemAvailability(id, 1)
      if (!isAvailable) {
        return ApiResponseHandler.notFound(res, 'Item not found')
      }
    }

    return ApiResponseHandler.success(res, item, 'Item retrieved successfully')
  })

  updateItem = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = res.locals.validatedData
    const { id } = validatedData.params
    const updateData = validatedData.body

    const item = await this.itemService.updateItem(id, updateData)

    return ApiResponseHandler.success(res, item, 'Item updated successfully')
  })

  deleteItem = asyncHandler(async (req: Request, res: Response) => {
    const { id } = res.locals.validatedData

    await this.itemService.deleteItem(id)

    return ApiResponseHandler.success(res, null, 'Item deleted successfully')
  })

  checkAvailability = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = res.locals.validatedData
    const { id } = validatedData.params
    const { quantity } = validatedData.query

    const isAvailable = await this.itemService.checkItemAvailability(
      id,
      quantity
    )

    return ApiResponseHandler.success(
      res,
      {
        itemId: id,
        quantity,
        available: isAvailable,
      },
      'Item availability checked successfully'
    )
  })

  getAvailableItems = asyncHandler(async (req: Request, res: Response) => {
    const items = await this.itemService.findAvailableItems()

    return ApiResponseHandler.success(
      res,
      items,
      'Available items retrieved successfully'
    )
  })

  getExpiringItems = asyncHandler(async (req: Request, res: Response) => {
    const days = parseInt(req.query.days as string) || 5
    const items = await this.itemService.findExpiringItems(days)

    return ApiResponseHandler.success(
      res,
      {
        items,
        daysAhead: days,
      },
      `Items expiring within ${days} days retrieved successfully`
    )
  })
}
