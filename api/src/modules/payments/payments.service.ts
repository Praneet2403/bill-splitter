import { ApiError } from '../../lib/errors'
import type { Share } from '../../lib/types'
import { findShare, markPaid } from './payments.repo'

/**
 * 1. Try to pay. If it worked, done.
 * 2. Otherwise look at the share: missing → 404,
 *    paid with this same key → replay the first answer, paid with another key → 409.
 */
export async function payShare(db: D1Database, billId: string, shareId: string, key: string) {
  const paid = await markPaid(db, billId, shareId, key)
  if (paid) return paid

  const share = await findShare(db, billId, shareId)
  if (!share) throw new ApiError(404, 'Bill or share not found')
  if (share.idempotencyKey !== key) throw new ApiError(409, 'This share is already paid')

  const { id, memberId, amountCents, paidAt }: Share = share
  return { id, memberId, amountCents, paidAt }
}
