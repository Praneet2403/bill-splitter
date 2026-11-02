import { createFileRoute, Link } from '@tanstack/react-router'
import { useCallback, useEffect, useState } from 'react'
import { useHome } from '../api/queries'
import { PhoneShell, WhitePanel } from '../components/ui/PhoneShell'
import { ErrorState, Loading } from '../components/ui/states'
import { BillList } from '../features/bills/BillList'
import { NewBillSheet } from '../features/bills/NewBillSheet'
import { AddMemberSheet } from '../features/home/AddMemberSheet'
import { HomeHero } from '../features/home/HomeHero'
import { MembersCard } from '../features/home/MembersCard'
import { PaidScreen } from '../features/payments/PaidScreen'
import type { PaidInfo } from '../features/payments/ShareRow'
import { isTemporary } from '../lib/http'
import { saveHome } from '../lib/saved-homes'

export const Route = createFileRoute('/homes/$homeId')({ component: HomePage })

function HomePage() {
  const { homeId } = Route.useParams()
  const home = useHome(homeId)
  const [sheet, setSheet] = useState<'bill' | 'member' | null>(null)
  const [paid, setPaid] = useState<PaidInfo | null>(null)
  const closeSheet = useCallback(() => setSheet(null), [])
  const closePaid = useCallback(() => setPaid(null), [])

  useEffect(() => {
    if (home.data) saveHome(home.data)
  }, [home.data])

  if (home.isPending) {
    return <PhoneShell>{<Loading label="Opening home…" dark />}</PhoneShell>
  }
  if (home.isError) {
    return (
      <PhoneShell>
        <ErrorState
          dark
          message={home.error.message}
          onRetry={isTemporary(home.error) ? () => home.refetch() : undefined}
        />
        <Link to="/" className="text-center text-sm text-white/60 underline">
          Back to homes
        </Link>
      </PhoneShell>
    )
  }

  const { members } = home.data
  return (
    <PhoneShell>
      <HomeHero
        homeId={homeId}
        name={home.data.name}
        canAddBill={members.length > 0}
        onAddBill={() => setSheet('bill')}
        onAddMember={() => setSheet('member')}
      />
      <MembersCard homeId={homeId} />
      <WhitePanel title="Bills">
        <BillList
          homeId={homeId}
          members={members}
          onPaid={setPaid}
          onAddBill={() => setSheet('bill')}
          onAddMember={() => setSheet('member')}
        />
      </WhitePanel>

      {sheet === 'bill' && (
        <NewBillSheet homeId={homeId} memberCount={members.length} onClose={closeSheet} />
      )}
      {sheet === 'member' && <AddMemberSheet homeId={homeId} onClose={closeSheet} />}
      {paid && <PaidScreen {...paid} onClose={closePaid} />}
    </PhoneShell>
  )
}
