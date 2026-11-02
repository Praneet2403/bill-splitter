import type { MouseEvent } from 'react'
import type { Share } from '../../api/types'
import { Avatar } from '../../components/ui/Avatar'
import { Button } from '../../components/ui/Button'
import { CheckIcon } from '../../components/ui/icons'
import { formatMoney } from '../../lib/money'
import { usePayShare } from './use-pay-share'

/** x / y: where the Pay button was, so the success screen can grow out of it. */
export type PaidInfo = { name: string; amountCents: number; x: number; y: number }

type Props = {
  homeId: string
  billId: string
  share: Share
  name: string
  onPaid: (info: PaidInfo) => void
}

/** One person's part of a bill. Shows "Paid" only after the server confirms it. */
export function ShareRow({ homeId, billId, share, name, onPaid }: Props) {
  const pay = usePayShare(homeId, billId, share.id)
  const paid = share.paidAt !== null || pay.isSuccess

  const onPay = (e: MouseEvent<HTMLButtonElement>) => {
    const box = e.currentTarget.getBoundingClientRect()
    const x = box.left + box.width / 2
    const y = box.top + box.height / 2
    pay.mutate(undefined, { onSuccess: (s) => onPaid({ name, amountCents: s.amountCents, x, y }) })
  }

  return (
    <li className="py-3">
      <div className="flex items-center gap-3">
        <Avatar name={name} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-medium">{name}</p>
          <p className="text-xs text-neutral-400">{paid ? 'Paid' : 'Unpaid'}</p>
        </div>
        <span className="text-[15px] font-semibold tabular-nums">
          {formatMoney(share.amountCents)}
        </span>
        {paid ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-2 text-sm font-semibold text-emerald-700">
            <CheckIcon /> Paid
          </span>
        ) : (
          <Button variant="solid" onClick={onPay} disabled={pay.isPending} className="min-w-[76px]">
            {pay.isPending ? 'Paying…' : 'Pay'}
          </Button>
        )}
      </div>
      {pay.isError && !paid && (
        <p role="alert" className="mt-2 rounded-xl bg-red-50 px-3 py-2 text-xs text-red-600">
          {pay.error.message} The share is still unpaid.
        </p>
      )}
    </li>
  )
}
