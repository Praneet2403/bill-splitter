import { Hono } from 'hono'
import { ApiError } from '../../lib/errors'
import type { AppEnv } from '../../lib/types'
import { payShare } from './payments.service'

const MAX_KEY_LENGTH = 200

export const paymentsRoutes = new Hono<AppEnv>()

paymentsRoutes.post('/bills/:billId/shares/:shareId/pay', async (c) => {
  const key = c.req.header('Idempotency-Key')?.trim()
  if (!key) throw new ApiError(400, 'Idempotency-Key header is required')
  if (key.length > MAX_KEY_LENGTH) throw new ApiError(400, 'Idempotency-Key is too long')

  const { billId, shareId } = c.req.param()
  return c.json(await payShare(c.env.DB, billId, shareId, key))
})
