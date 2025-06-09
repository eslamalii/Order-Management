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

  async sendEmailVerification(email: string, token: string): Promise<void> {
    try {
      const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${token}`

      const subject = 'Verify Your Email Address'
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Welcome to Order Management System!</h2>
          <p>Thank you for registering. Please click the button below to verify your email address:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="background-color: #007bff; color: white; padding: 12px 30px; 
                      text-decoration: none; border-radius: 5px; display: inline-block;">
              Verify Email Address
            </a>
          </div>
          
          <p>Or copy and paste this link in your browser:</p>
          <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
          
          <p style="color: #666; font-size: 14px;">
            This verification link will expire in 24 hours.
          </p>
          
          <hr style="border: 1px solid #eee; margin: 30px 0;">
          <p style="color: #999; font-size: 12px;">
            If you didn't create an account, please ignore this email.
          </p>
        </div>
      `

      await this.transporter.sendMail({
        from: config.smtp.fromEmail,
        to: email,
        subject,
        html,
      })

      console.log(`📧 Email verification sent to: ${email}`)
    } catch (error) {
      console.error('❌ Error sending email verification:', error)
      throw new Error('Failed to send verification email')
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
