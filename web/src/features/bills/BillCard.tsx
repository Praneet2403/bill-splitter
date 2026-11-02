import type { Bill } from '../../api/types'
import { formatMoney } from '../../lib/money'
import { type PaidInfo, ShareRow } from '../payments/ShareRow'

// The yellow / mint / blue cards from the design, in turn.
const COLORS = ['bg-[#FFE14D]', 'bg-[#3EE8B5]', 'bg-[#45A6FF]', 'bg-[#FFA3C2]']

type Props = {
  homeId: string
  bill: Bill
  index: number
  nameOf: (memberId: string) => string
  onPaid: (info: PaidInfo) => void
}

export function BillCard({ homeId, bill, index, nameOf, onPaid }: Props) {
  const paidCount = bill.shares.filter((s) => s.paidAt !== null).length

  return (
    // Cards fan out one after another, 60 ms apart (from the video).
    <article
      style={{ animationDelay: `${index * 60}ms` }}
      className="animate-card overflow-hidden rounded-[26px] bg-neutral-50 ring-1 ring-black/5"
    >
      <div className={`rounded-[26px] p-5 text-black ${COLORS[index % COLORS.length]}`}>
        <div className="flex items-center justify-between gap-3 text-sm font-medium">
          <h3 className="truncate">{bill.title}</h3>
          <span className="shrink-0 font-mono text-black/60">
            •••• {paidCount}/{bill.shares.length} paid
          </span>
        </div>
        <p className="mt-6 text-3xl font-bold tracking-tight tabular-nums">
          {formatMoney(bill.totalCents)}
        </p>
      </div>

      <ul className="divide-y divide-neutral-200/70 px-4">
        {bill.shares.map((share) => (
          <ShareRow
            key={share.id}
            homeId={homeId}
            billId={bill.id}
            share={share}
            name={nameOf(share.memberId)}
            onPaid={onPaid}
          />
        ))}
      </ul>
    </article>
  )
}
