import { z } from 'zod'

const positiveInt = z.coerce
  .number({ invalid_type_error: 'Must be a number or numeric string' })
  .int({ message: 'Must be an integer' })
  .positive({ message: 'Must be a positive integer' })

export const commissionReportSchema = z
  .object({
    startDate: z.string().datetime('Start date must be a valid date and time'),
    endDate: z.string().datetime('End date must be a valid date and time'),
    waiterId: positiveInt.optional(),
    export: z
      .string()
      .optional()
      .transform((val) => val === 'true'),
    format: z.enum(['csv', 'json']).default('json'),
  })
  .refine(
    (data) => {
      const start = new Date(data.startDate)
      const end = new Date(data.endDate)
      return start <= end
    },
    {
      message: 'Start date must be before or equal to end date',
      path: ['startDate', 'endDate'],
    }
  )

export type CommissionReportInput = z.infer<typeof commissionReportSchema>
