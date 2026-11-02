import { z } from 'zod'

/** Used for both a home and a member: just a non-blank name. */
export const nameSchema = z.object({
  name: z.string('must be text').trim().min(1, 'is required').max(100, 'is too long'),
})
