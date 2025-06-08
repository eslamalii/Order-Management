import { ExportFormat } from '../ExportFormat'

export interface ICommissionQuery {
  startDate?: Date
  endDate?: Date
  waiterName?: string
  export?: boolean
  format?: ExportFormat
}
