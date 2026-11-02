import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from './client'

export const keys = {
  home: (homeId: string) => ['home', homeId] as const,
  bills: (homeId: string) => ['bills', homeId] as const,
  balances: (homeId: string) => ['balances', homeId] as const,
}

export const useHome = (homeId: string) =>
  useQuery({ queryKey: keys.home(homeId), queryFn: () => api.getHome(homeId) })

export const useBills = (homeId: string) =>
  useQuery({ queryKey: keys.bills(homeId), queryFn: () => api.listBills(homeId) })

export const useBalances = (homeId: string) =>
  useQuery({ queryKey: keys.balances(homeId), queryFn: () => api.listBalances(homeId) })

/** After any write, refetch everything about this home. */
export function useRefreshHome(homeId: string) {
  const client = useQueryClient()
  return () =>
    Promise.all([
      client.invalidateQueries({ queryKey: keys.home(homeId) }),
      client.invalidateQueries({ queryKey: keys.bills(homeId) }),
      client.invalidateQueries({ queryKey: keys.balances(homeId) }),
    ])
}

export function useAddMember(homeId: string) {
  const refresh = useRefreshHome(homeId)
  return useMutation({
    mutationFn: (name: string) => api.addMember(homeId, name),
    onSuccess: refresh,
  })
}

export function useCreateBill(homeId: string) {
  const refresh = useRefreshHome(homeId)
  return useMutation({
    mutationFn: (input: { title: string; totalCents: number }) =>
      api.createBill(homeId, input.title, input.totalCents),
    onSuccess: refresh,
  })
}
