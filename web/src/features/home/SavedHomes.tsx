import { Link } from '@tanstack/react-router'
import { Avatar } from '../../components/ui/Avatar'
import { loadHomes } from '../../lib/saved-homes'

/** Every home opened in this browser, so creating a new one never hides the old ones. */
export function SavedHomes() {
  const homes = loadHomes()
  if (homes.length === 0) return null

  return (
    <section className="mt-8">
      <h2 className="text-sm font-medium text-neutral-500">Your homes</h2>
      <ul className="mt-2 divide-y divide-neutral-100">
        {homes.map((home) => (
          <li key={home.id}>
            <Link
              to="/homes/$homeId"
              params={{ homeId: home.id }}
              className="flex items-center gap-3 py-3 hover:opacity-70"
            >
              <Avatar name={home.name} small />
              <span className="flex-1 truncate font-medium">{home.name}</span>
              <span aria-hidden="true" className="text-neutral-400">
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
