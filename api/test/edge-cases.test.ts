import { exports } from 'cloudflare:workers'
import { describe, expect, it } from 'vitest'
import { call, createBill, createHome, type Share } from './helpers'

async function billWithShare() {
  const { homeId } = await createHome(['Asha', 'Ben'])
  const bill = await createBill(homeId, 1000)
  const share = bill.body.shares[0]
  if (!share) throw new Error('bill has no shares')
  return { homeId, billId: bill.body.id, share }
}

const pay = (billId: string, shareId: string, key: string) =>
  call<Share>('POST', `/api/bills/${billId}/shares/${shareId}/pay`, {
    headers: { 'Idempotency-Key': key },
  })

describe('concurrent payments', () => {
  it('lets only one of two different keys pay the same share', async () => {
    const { billId, share } = await billWithShare()

    const results = await Promise.all([
      pay(billId, share.id, crypto.randomUUID()),
      pay(billId, share.id, crypto.randomUUID()),
    ])

    expect(results.map((r) => r.status).sort()).toEqual([200, 409])
  })

  it('answers the same for the same key sent at the same time', async () => {
    const { billId, share } = await billWithShare()
    const key = crypto.randomUUID()

    const [a, b] = await Promise.all([pay(billId, share.id, key), pay(billId, share.id, key)])

    expect([a.status, b.status]).toEqual([200, 200])
    expect(a.body.paidAt).toBe(b.body.paidAt)
  })
})

describe('wrong input', () => {
  it('rejects a share that belongs to another bill', async () => {
    const first = await billWithShare()
    const second = await billWithShare()

    const paid = await pay(second.billId, first.share.id, crypto.randomUUID())

    expect(paid.status).toBe(404)
  })

  it.each([{}, { name: '' }, { name: '   ' }, { name: 42 }])(
    'rejects the home %j',
    async (body) => {
      const home = await call('POST', '/api/homes', { body })

      expect(home.status).toBe(422)
      expect(home.body).toEqual({ error: expect.any(String) })
    },
  )

  it('rejects a body that is not JSON', async () => {
    const response = await exports.default.fetch(
      new Request('http://localhost/api/homes', { method: 'POST', body: '{oops' }),
    )

    expect(response.status).toBe(400)
    expect(await response.json()).toEqual({ error: expect.any(String) })
  })

  it('answers unknown routes with JSON', async () => {
    const response = await call('GET', '/api/nope')

    expect(response.status).toBe(404)
    expect(response.body).toEqual({ error: expect.any(String) })
  })
})

describe('reading a home', () => {
  it('lists bills newest first with their shares', async () => {
    const { homeId } = await createHome(['Asha', 'Ben', 'Chitra'])
    await createBill(homeId, 300)
    await createBill(homeId, 1000)

    const list = await call<{ bills: { totalCents: number; shares: Share[] }[] }>(
      'GET',
      `/api/homes/${homeId}/bills`,
    )

    expect(list.body.bills.map((b) => b.totalCents)).toEqual([1000, 300])
    expect(list.body.bills[0]?.shares.map((s) => s.amountCents)).toEqual([334, 333, 333])
  })
})
