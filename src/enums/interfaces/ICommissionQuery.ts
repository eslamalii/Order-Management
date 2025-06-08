import { ExportFormat } from '../ExportFormat'

export interface ICommissionQuery {
  startDate?: Date
  endDate?: Date
  waiterId?: number
  export?: boolean
  format?: ExportFormat
}
