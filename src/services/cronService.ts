import * as cron from 'node-cron'
import { injectable, inject } from 'inversify'
import { TYPES } from '../config/types'
import { IEmailService } from './Interfaces/IEmailService'
import { IOrderService } from './Interfaces/IOrderService'
import { IItemService } from './Interfaces/IItemService'
import { ICronService } from './Interfaces/ICronService'

@injectable()
export class CronService implements ICronService {
  constructor(
    @inject(TYPES.EmailService) private emailService: IEmailService,
    @inject(TYPES.OrderService) private orderService: IOrderService,
    @inject(TYPES.ItemService) private itemService: IItemService
  ) {}

  init(): void {
    console.log('🕐 Initializing cron jobs...')

    // Check for expiring items every day at 9 AM
    cron.schedule(
      '0 9 * * *',
      async () => {
        console.log('📅 Running expiring items check...')
        await this.checkExpiringItems()
      },
      {
        scheduled: true,
        timezone: 'UTC',
      }
    )

    // Check for expired orders every hour
    cron.schedule(
      '0 * * * *',
      async () => {
        console.log('⏰ Running expired orders check...')
        await this.updateExpiredOrders()
      },
      {
        scheduled: true,
        timezone: 'UTC',
      }
    )

    console.log('✅ Cron jobs scheduled successfully')
  }

  private async checkExpiringItems(): Promise<void> {
    try {
      const fiveDaysFromNow = new Date()
      fiveDaysFromNow.setDate(fiveDaysFromNow.getDate() + 5)
      fiveDaysFromNow.setHours(23, 59, 59, 999)

      const today = new Date()
      today.setHours(23, 59, 59, 999)

      // Get items expiring in 5 days
      const itemsExpiringSoon =
        await this.itemService.getItemsExpiringOn(fiveDaysFromNow)

      // Get items expiring today
      const itemsExpiringToday =
        await this.itemService.getItemsExpiringOn(today)

      if (itemsExpiringSoon.length > 0) {
        await this.emailService.sendExpiryWarningEmail(itemsExpiringSoon, 5)
        console.log(
          `📧 Sent warning emails for ${itemsExpiringSoon.length} items expiring in 5 days`
        )
      }

      if (itemsExpiringToday.length > 0) {
        await this.emailService.sendExpiryNotificationEmail(itemsExpiringToday)
        console.log(
          `📧 Sent expiry notifications for ${itemsExpiringToday.length} items expiring today`
        )
      }

      if (itemsExpiringSoon.length === 0 && itemsExpiringToday.length === 0) {
        console.log('✅ No expiring items found')
      }
    } catch (error) {
      console.error('❌ Error checking expiring items:', error)
    }
  }

  private async updateExpiredOrders(): Promise<void> {
    try {
      const fourHoursAgo = new Date()
      fourHoursAgo.setHours(fourHoursAgo.getHours() - 4)

      const expiredOrders = await this.orderService.getOrdersOlderThan(
        fourHoursAgo,
        'pending'
      )

      if (expiredOrders.length > 0) {
        for (const order of expiredOrders) {
          await this.orderService.updateOrderStatus(order.id, 'expired')
          console.log(`⏰ Order ${order.id} marked as expired`)
        }
        console.log(`✅ Updated ${expiredOrders.length} expired orders`)
      } else {
        console.log('✅ No expired orders found')
      }
    } catch (error) {
      console.error('❌ Error updating expired orders:', error)
    }
  }
}
