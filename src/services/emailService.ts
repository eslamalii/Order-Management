import * as nodemailer from 'nodemailer'
import { injectable, inject } from 'inversify'
import { IUserService } from './Interfaces/IUserService'
import { TYPES } from '../config/types'
import { IEmailService } from './Interfaces/IEmailService'
import { config } from '../config/config'

@injectable()
export class EmailService implements IEmailService {
  private transporter: nodemailer.Transporter

  constructor(@inject(TYPES.UserService) private userService: IUserService) {
    this.transporter = nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      secure: false,
      auth: {
        user: config.smtp.user,
        pass: config.smtp.pass,
      },
    })
  }

  async sendExpiryWarningEmail(
    items: any[],
    daysUntilExpiry: number
  ): Promise<void> {
    try {
      const admins = await this.userService.getAdminsAndManagers()
      const itemsList = items
        .map(
          (item) =>
            `- ${item.name}: Quantity ${item.quantity}, Expires: ${item.expiryDate.toDateString()}`
        )
        .join('\n')

      const subject = `Items Expiring in ${daysUntilExpiry} Days - Warning`
      const text = `
        The following items will expire in ${daysUntilExpiry} days:
        
        ${itemsList}
        
        Please take necessary action to manage these expiring items.
      `

      await this.sendToAdmins(admins, subject, text)
    } catch (error) {
      console.error('Error sending expiry warning email:', error)
    }
  }

  async sendExpiryNotificationEmail(items: any[]): Promise<void> {
    try {
      const admins = await this.userService.getAdminsAndManagers()
      const itemsList = items
        .map(
          (item) =>
            `- ${item.name}: Quantity ${item.quantity}, Expired: ${item.expiryDate.toDateString()}`
        )
        .join('\n')

      const subject = 'Items Expired Today - Immediate Action Required'
      const text = `
        The following items have expired today:
        
        ${itemsList}
        
        These items require immediate attention.
      `

      await this.sendToAdmins(admins, subject, text)
    } catch (error) {
      console.error('Error sending expiry notification email:', error)
    }
  }

  private async sendToAdmins(
    admins: any[],
    subject: string,
    text: string
  ): Promise<void> {
    const emailPromises = admins.map((admin) =>
      this.transporter.sendMail({
        from: config.smtp.fromEmail,
        to: admin.email,
        subject,
        text,
      })
    )

    await Promise.all(emailPromises)
  }
}
