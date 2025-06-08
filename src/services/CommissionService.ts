import { injectable } from 'inversify'
import { ICommissionService } from './Interfaces/ICommissionService'
import { IWaiterCommissionReport } from '../enums/interfaces/IWaiterCommissionReport'
import { ICommissionQuery } from '../enums/interfaces/ICommissionQuery'
import { UserRole } from '../enums/UserRole'
import { sequelize } from '../config/database'
import { QueryTypes } from 'sequelize'

@injectable()
export class CommissionService implements ICommissionService {
  async getWaiterCommissionReport(
    query: ICommissionQuery,
    userRole: UserRole,
    userId: number
  ): Promise<IWaiterCommissionReport[]> {
    const { startDate, endDate, waiterName } = query

    let sqlQuery = `
      SELECT 
        u.id as waiter_id,
        u.name as waiter_name,
        u.email as waiter_email,
        COALESCE(SUM(oi.quantity), 0) as total_items_sold,
        COALESCE(SUM(CASE WHEN LOWER(c.name) = 'others' THEN oi.quantity ELSE 0 END), 0) as others_items,
        COALESCE(SUM(CASE WHEN LOWER(c.name) = 'food' THEN oi.quantity ELSE 0 END), 0) as food_items,
        COALESCE(SUM(CASE WHEN LOWER(c.name) = 'beverages' THEN oi.quantity ELSE 0 END), 0) as beverages_items,
        COALESCE(ROUND(SUM(oi.quantity * oi.unit_price)::numeric, 2), 0) as total_revenue,
        COALESCE(ROUND(SUM(CASE WHEN LOWER(c.name) = 'others' THEN oi.quantity * oi.unit_price * 0.0025 ELSE 0 END)::numeric, 2), 0) as others_commission,
        COALESCE(ROUND(SUM(CASE WHEN LOWER(c.name) = 'food' THEN oi.quantity * oi.unit_price * 0.01 ELSE 0 END)::numeric, 2), 0) as food_commission,
        COALESCE(ROUND(SUM(CASE WHEN LOWER(c.name) = 'beverages' THEN oi.quantity * oi.unit_price * 0.005 ELSE 0 END)::numeric, 2), 0) as beverages_commission,
        COALESCE(ROUND(SUM(
          CASE 
            WHEN LOWER(c.name) = 'others' THEN oi.quantity * oi.unit_price * 0.0025
            WHEN LOWER(c.name) = 'food' THEN oi.quantity * oi.unit_price * 0.01
            WHEN LOWER(c.name) = 'beverages' THEN oi.quantity * oi.unit_price * 0.005
            ELSE 0
          END
        )::numeric, 2), 0) as total_commission
      FROM users u
      INNER JOIN roles r ON u.role_id = r.id
      LEFT JOIN orders o ON u.id = o.waiter_id 
        AND o.status = 'completed'
        AND o.created_at >= :startDate
        AND o.created_at <= :endDate
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN items i ON oi.item_id = i.id
      LEFT JOIN categories c ON i.category_id = c.id
      WHERE r.name = :waiterRole
    `

    const replacements: Record<string, any> = {
      startDate: new Date(startDate!),
      endDate: new Date(endDate!),
      waiterRole: UserRole.WAITER,
    }

    if (waiterName) {
      sqlQuery += ` AND u.name LIKE :waiterName`
      replacements.waiterId = `%${waiterName}%`
    }

    // Add role-based filtering
    if (userRole === UserRole.WAITER) {
      sqlQuery += ` AND u.id = :userId`
      replacements.userId = userId
    }

    sqlQuery += `
      GROUP BY u.id, u.name, u.email
      ORDER BY u.name
    `

    const results = await sequelize.query(sqlQuery, {
      type: QueryTypes.SELECT,
      replacements,
    })

    return results as IWaiterCommissionReport[]
  }

  exportWaiterCommissionReport(data: IWaiterCommissionReport[]): string {
    if (data.length === 0) {
      return 'Waiter ID,Waiter Name,Waiter Email,Total Items Sold,Others Items,Food Items,Beverages Items,Total Revenue,Others Commission,Food Commission,Beverages Commission,Total Commission\nNo data available'
    }

    // CSV headers
    const headers = [
      'Waiter ID',
      'Waiter Name',
      'Waiter Email',
      'Total Items Sold',
      'Others Items',
      'Food Items',
      'Beverages Items',
      'Total Revenue',
      'Others Commission',
      'Food Commission',
      'Beverages Commission',
      'Total Commission',
    ]

    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...data.map((row) =>
        [
          row.waiter_id,
          `"${row.waiter_name}"`,
          `"${row.waiter_email}"`,
          row.total_items_sold,
          row.others_items,
          row.food_items,
          row.beverages_items,
          row.total_revenue,
          row.others_commission,
          row.food_commission,
          row.beverages_commission,
          row.total_commission,
        ].join(',')
      ),
    ].join('\n')

    return csvContent
  }
}
