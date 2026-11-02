import type { Home } from '../api/types'

const KEY = 'bill-splitter:homes'
const OLD_KEY = 'bill-splitter:last-home'
const MAX = 20

const isHome = (value: unknown): value is Home =>
  !!value &&
  typeof value === 'object' &&
  'id' in value &&
  typeof value.id === 'string' &&
  'name' in value &&
  typeof value.name === 'string'

function read(key: string): unknown {
  try {
    return JSON.parse(localStorage.getItem(key) ?? 'null')
  } catch {
    return null
  }
}

/** Homes opened in this browser, last opened first. Storage can be blocked, so never throw. */
export function loadHomes(): Home[] {
  const list = read(KEY)
  if (Array.isArray(list)) return list.filter(isHome)
  const old = read(OLD_KEY)
  return isHome(old) ? [old] : []
}

/** Moves the home to the top of the list (adds it if new). */
export function saveHome({ id, name }: Home) {
  const homes = [{ id, name }, ...loadHomes().filter((h) => h.id !== id)].slice(0, MAX)
  try {
    localStorage.setItem(KEY, JSON.stringify(homes))
  } catch {}
}
