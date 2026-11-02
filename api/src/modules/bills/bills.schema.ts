import { z } from 'zod'

// readBody puts the field name in front of each message, e.g. "totalCents: must be more than 0".
export const createBillSchema = z.object({
  title: z.string().trim().min(1, 'is required').max(100, 'is too long'),
  // Strict number: "1000" (a string), null, 10.5, 0 and negatives are all rejected.
  totalCents: z
    .number('must be a number')
    .int('must be a whole number of cents')
    .positive('must be more than 0'),
})
