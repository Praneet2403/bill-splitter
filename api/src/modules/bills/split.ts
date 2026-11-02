/**
 * Splits a total in whole cents between people.
 * Leftover cents go one by one to the first people in the list.
 * Example: 1000 between 3 → 334, 333, 333.
 */
export function splitCents<T>(totalCents: number, people: T[]) {
  const base = Math.floor(totalCents / people.length)
  const extra = totalCents % people.length
  return people.map((person, i) => ({ person, amountCents: base + (i < extra ? 1 : 0) }))
}
