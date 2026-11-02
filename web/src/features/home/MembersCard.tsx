import { useBalances } from '../../api/queries'
import { Avatar } from '../../components/ui/Avatar'
import { ErrorState, Loading } from '../../components/ui/states'
import { formatMoney } from '../../lib/money'

/** "Who owes what": one row per member, in the order they joined. */
export function MembersCard({ homeId }: { homeId: string }) {
  const balances = useBalances(homeId)

  return (
    <section className="mx-4 mt-6 rounded-3xl bg-white/[0.07] p-4">
      <h2 className="text-sm text-white/50">Who owes what</h2>

      {balances.isPending && <Loading label="Loading balances…" dark />}
      {balances.isError && (
        <ErrorState message={balances.error.message} onRetry={() => balances.refetch()} dark />
      )}
      {balances.data?.length === 0 && (
        <p className="py-4 text-sm text-white/40">No members yet. Add the people who live here.</p>
      )}

      <ul className="mt-3 space-y-3">
        {balances.data?.map((b) => (
          <li key={b.memberId} className="flex items-center gap-3">
            <Avatar name={b.name} small />
            <span className="flex-1 truncate text-sm font-medium">{b.name}</span>
            {b.outstandingCents > 0 ? (
              <span className="text-sm font-semibold tabular-nums">
                {formatMoney(b.outstandingCents)}
              </span>
            ) : (
              <span className="text-sm text-emerald-400">Settled</span>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
