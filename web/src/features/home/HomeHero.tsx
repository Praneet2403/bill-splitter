import { Link } from '@tanstack/react-router'
import { useBalances } from '../../api/queries'
import { Button } from '../../components/ui/Button'
import { PlusIcon } from '../../components/ui/icons'
import { moneyParts } from '../../lib/money'

type Props = {
  homeId: string
  name: string
  canAddBill: boolean
  onAddBill: () => void
  onAddMember: () => void
}

/** Dark header: total still owed in the home + the two main actions. */
export function HomeHero({ homeId, name, canAddBill, onAddBill, onAddMember }: Props) {
  const balances = useBalances(homeId)
  const owed = balances.data?.reduce((sum, b) => sum + b.outstandingCents, 0)
  const parts = owed === undefined ? null : moneyParts(owed)

  return (
    <header className="px-6 pt-6">
      <div className="flex items-center justify-between gap-4">
        <Link to="/" className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-black">
          Homes
        </Link>
        <span className="truncate text-sm font-semibold text-white/70">{name}</span>
      </div>

      <p className="mt-10 text-sm text-white/50">Still owed</p>
      <p className="mt-1 overflow-hidden text-[44px] leading-none font-bold tracking-tight tabular-nums">
        {/* key={owed}: a new total re-mounts the span, so it rolls in like the video. */}
        <span key={owed} className="animate-roll">
          {parts ? `₹ ${parts.rupees}` : '₹ —'}
          {parts && <span className="text-2xl text-white/40"> .{parts.paise}</span>}
        </span>
      </p>

      <div className="mt-5 flex gap-2">
        <Button onClick={onAddBill} disabled={!canAddBill}>
          <PlusIcon /> Add bill
        </Button>
        <Button variant="dark" onClick={onAddMember}>
          Add member
        </Button>
      </div>
    </header>
  )
}
