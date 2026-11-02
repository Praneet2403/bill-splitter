import type { Share } from '../../lib/types'

const SHARE_COLUMNS = 'id, member_id AS memberId, amount_cents AS amountCents, paid_at AS paidAt'

/**
 * Pays the share only if it is still unpaid. This one statement is the lock:
 * if two requests race, SQLite runs them one after the other and only the first matches.
 * Returns null when no row changed.
 */
export function markPaid(db: D1Database, billId: string, shareId: string, key: string) {
  return db
    .prepare(
      `UPDATE shares SET paid_at = ?, idempotency_key = ?
       WHERE id = ? AND bill_id = ? AND paid_at IS NULL
       RETURNING ${SHARE_COLUMNS}`,
    )
    .bind(new Date().toISOString(), key, shareId, billId)
    .first<Share>()
}

export function findShare(db: D1Database, billId: string, shareId: string) {
  return db
    .prepare(
      `SELECT ${SHARE_COLUMNS}, idempotency_key AS idempotencyKey
       FROM shares WHERE id = ? AND bill_id = ?`,
    )
    .bind(shareId, billId)
    .first<Share & { idempotencyKey: string | null }>()
}
