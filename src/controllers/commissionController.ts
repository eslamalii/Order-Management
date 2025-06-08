import { ApiResponseHandler } from '../utils/apiResponse'
import { TYPES } from '../config/types'
import { ICommissionService } from '../services/Interfaces/ICommissionService'
import { asyncHandler } from '../utils/errorHandler'
import { Request, Response } from 'express'
import { inject, injectable } from 'inversify'

@injectable()
export class CommissionController {
  constructor(
    @inject(TYPES.CommissionService)
    private commissionService: ICommissionService
  ) {}

  getWaiterCommissionReport = asyncHandler(
    async (req: Request, res: Response) => {
      const params = res.locals.validatedData
      const { role, id } = res.locals.user

      const reportData = await this.commissionService.getWaiterCommissionReport(
        params,
        role,
        id
      )

      if (params.export && params.format === 'csv') {
        const csvContent =
          this.commissionService.exportWaiterCommissionReport(reportData)

        const filename = `waiter-commission-report-${new Date().toISOString().split('T')[0]}.csv`
        res.setHeader('Content-Type', 'text/csv')
        res.setHeader('Content-Disposition', `attachment; filename=${filename}`)
        return res.send(csvContent)
      }

      const summary = {
        totalWaiters: reportData.length,
        totalRevenue: reportData.reduce(
          (sum, row) => sum + Number(row.total_revenue),
          0
        ),
        totalCommission: reportData.reduce(
          (sum, row) => sum + Number(row.total_commission),
          0
        ),
        totalItemsSold: reportData.reduce(
          (sum, row) => sum + Number(row.total_items_sold),
          0
        ),
      }

      return ApiResponseHandler.success(
        res,
        {
          reportData,
          summary,
          dateRange: {
            startDate: params.startDate,
            endDate: params.endDate,
          },
          filters: {
            waiterName: params.waiterName,
          },
        },
        'Commission Report generated successfully'
      )
    }
  )
}
