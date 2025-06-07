import { ItemCategory } from '../ItemCategory'
import { ItemSortField } from '../ItemSortField'
import { SortOrder } from '../SortOrder'

export interface ItemQuery {
  category?: ItemCategory
  sortBy?: ItemSortField
  sortOrder?: SortOrder
  page?: number
  limit?: number
}
