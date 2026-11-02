import { useBills } from '../../api/queries'
import type { Member } from '../../api/types'
import { Button } from '../../components/ui/Button'
import { Empty, ErrorState } from '../../components/ui/states'
import type { PaidInfo } from '../payments/ShareRow'
import { BillCard } from './BillCard'

type Props = {
  homeId: string
  members: Member[]
  onPaid: (info: PaidInfo) => void
  onAddBill: () => void
  onAddMember: () => void
}

export function BillList({ homeId, members, onPaid, onAddBill, onAddMember }: Props) {
  const bills = useBills(homeId)
  const names = new Map(members.map((m) => [m.id, m.name]))
  const nameOf = (memberId: string) => names.get(memberId) ?? 'Former member'

  if (bills.isPending) return <BillSkeleton />
  if (bills.isError)
    return <ErrorState message={bills.error.message} onRetry={() => bills.refetch()} />

  if (bills.data.length === 0) {
    return members.length === 0 ? (
      <Empty
        title="No members yet"
        hint="Add the people who live here, then add your first bill."
        action={
          <Button variant="solid" onClick={onAddMember}>
            Add member
          </Button>
        }
      />
    ) : (
      <Empty
        title="No bills yet"
        hint="Add a bill and it will be split between everyone."
        action={
          <Button variant="solid" onClick={onAddBill}>
            Add bill
          </Button>
        }
      />
    )
  }

  return (
    <div className="space-y-4">
      {bills.data.map((bill, i) => (
        <BillCard
          key={bill.id}
          homeId={homeId}
          bill={bill}
          index={i}
          nameOf={nameOf}
          onPaid={onPaid}
        />
      ))}
    </div>
  )
}

function BillSkeleton() {
  return (
    <div role="status" aria-label="Loading bills" className="space-y-4">
      <div className="h-40 animate-pulse rounded-[26px] bg-neutral-100" />
      <div className="h-40 animate-pulse rounded-[26px] bg-neutral-100" />
    </div>
  )
}
