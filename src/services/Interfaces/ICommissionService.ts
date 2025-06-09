import { IWaiterCommissionReport } from '../../enums/interfaces/IWaiterCommissionReport'
import { UserRole } from '../../enums/UserRole'
import { ICommissionQuery } from '../../enums/interfaces/ICommissionQuery'

export interface ICommissionService {
  getWaiterCommissionReport(
    query: ICommissionQuery,
    userRole: UserRole,
    userId: number
  ): Promise<IWaiterCommissionReport[]>

  exportWaiterCommissionReport(data: IWaiterCommissionReport[]): string
}
