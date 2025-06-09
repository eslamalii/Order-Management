export interface IEmailService {
  sendExpiryWarningEmail(items: any[], daysUntilExpiry: number): Promise<void>
  sendExpiryNotificationEmail(items: any[]): Promise<void>
}
