import type { Balance } from '../../lib/types'

/** Sum of each member's unpaid shares. LEFT JOIN keeps members with no shares (they owe 0). */
export async function listBalances(db: D1Database, homeId: string): Promise<Balance[]> {
  const { results } = await db
    .prepare(
      `SELECT m.id AS memberId, m.name,
              COALESCE(SUM(CASE WHEN s.paid_at IS NULL THEN s.amount_cents ELSE 0 END), 0)
                AS outstandingCents
       FROM members m
       LEFT JOIN shares s ON s.member_id = m.id
       WHERE m.home_id = ?
       GROUP BY m.id
       ORDER BY m.position`,
    )
    .bind(homeId)
    .all<Balance>()
  return results
}
