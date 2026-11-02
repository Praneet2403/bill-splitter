import type { Bill, Member, Share } from '../../lib/types'
import { splitCents } from './split'

type NewBill = { homeId: string; title: string; totalCents: number; members: Member[] }

/** Saves the bill and every share in one batch. D1 runs a batch as one transaction. */
export async function insertBill(db: D1Database, input: NewBill): Promise<Bill> {
  const { homeId, title, totalCents, members } = input
  const shares: Share[] = splitCents(totalCents, members).map(({ person, amountCents }) => ({
    id: crypto.randomUUID(),
    memberId: person.id,
    amountCents,
    paidAt: null,
  }))
  const bill = { id: crypto.randomUUID(), homeId, title, totalCents, shares }

  await db.batch([
    db
      .prepare(
        'INSERT INTO bills (id, home_id, title, total_cents, created_at) VALUES (?, ?, ?, ?, ?)',
      )
      .bind(bill.id, homeId, title, totalCents, new Date().toISOString()),
    ...shares.map((s) =>
      db
        .prepare('INSERT INTO shares (id, bill_id, member_id, amount_cents) VALUES (?, ?, ?, ?)')
        .bind(s.id, bill.id, s.memberId, s.amountCents),
    ),
  ])
  return bill
}

/** All bills of a home, newest first, each with its shares in member order. */
export async function listBills(db: D1Database, homeId: string): Promise<Bill[]> {
  const bills = await db
    .prepare(
      `SELECT id, home_id AS homeId, title, total_cents AS totalCents FROM bills
       WHERE home_id = ? ORDER BY created_at DESC, rowid DESC`,
    )
    .bind(homeId)
    .all<Omit<Bill, 'shares'>>()
  const shares = await db
    .prepare(
      `SELECT s.id, s.bill_id AS billId, s.member_id AS memberId,
              s.amount_cents AS amountCents, s.paid_at AS paidAt
       FROM shares s
       JOIN bills b ON b.id = s.bill_id
       JOIN members m ON m.id = s.member_id
       WHERE b.home_id = ? ORDER BY m.position`,
    )
    .bind(homeId)
    .all<Share & { billId: string }>()

  return bills.results.map((bill) => ({
    ...bill,
    shares: shares.results
      .filter((s) => s.billId === bill.id)
      .map(({ id, memberId, amountCents, paidAt }) => ({ id, memberId, amountCents, paidAt })),
  }))
}
