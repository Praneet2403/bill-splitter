import { request } from '../lib/http'
import type { Balance, Bill, Home, HomeDetails, Member, Share } from './types'

const post = (body: unknown): RequestInit => ({ method: 'POST', body: JSON.stringify(body) })
const id = encodeURIComponent

/** One function per API endpoint. */
export const api = {
  createHome: (name: string) => request<Home>('/homes', post({ name })),

  getHome: (homeId: string) => request<HomeDetails>(`/homes/${id(homeId)}`),

  addMember: (homeId: string, name: string) =>
    request<Member>(`/homes/${id(homeId)}/members`, post({ name })),

  listBills: (homeId: string) =>
    request<{ bills: Bill[] }>(`/homes/${id(homeId)}/bills`).then((r) => r.bills),

  createBill: (homeId: string, title: string, totalCents: number) =>
    request<Bill>(`/homes/${id(homeId)}/bills`, post({ title, totalCents })),

  listBalances: (homeId: string) =>
    request<{ balances: Balance[] }>(`/homes/${id(homeId)}/balances`).then((r) => r.balances),

  payShare: (billId: string, shareId: string, key: string) =>
    request<Share>(`/bills/${id(billId)}/shares/${id(shareId)}/pay`, {
      method: 'POST',
      headers: { 'Idempotency-Key': key },
    }),
}
