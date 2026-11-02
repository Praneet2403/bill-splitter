import type { Home } from '../api/types'

const KEY = 'bill-splitter:last-home'

/** Remembers the last opened home in this browser. Storage can be blocked, so never throw. */
export function saveLastHome(home: Home) {
  try {
    localStorage.setItem(KEY, JSON.stringify(home))
  } catch {}
}

export function loadLastHome(): Home | null {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(KEY) ?? 'null')
    if (value && typeof value === 'object' && 'id' in value && 'name' in value) {
      return { id: String(value.id), name: String(value.name) }
    }
  } catch {}
  return null
}
