import { describe, expect, it } from 'vitest'
import { splitCents } from '../src/modules/bills/split'

const amounts = (total: number, people: number) =>
  splitCents(
    total,
    Array.from({ length: people }, (_, i) => i),
  ).map((s) => s.amountCents)

describe('splitCents', () => {
  it('gives leftover cents to the first people', () => {
    expect(amounts(1000, 3)).toEqual([334, 333, 333])
    expect(amounts(1001, 3)).toEqual([334, 334, 333])
  })

  it('gives 0 to some people when the total is smaller than the group', () => {
    expect(amounts(2, 3)).toEqual([1, 1, 0])
  })

  it('always adds up to the total', () => {
    for (const [total, people] of [
      [1, 1],
      [99_999, 7],
      [123_456_789, 13],
    ] as const) {
      expect(amounts(total, people).reduce((a, b) => a + b, 0)).toBe(total)
    }
  })
})
