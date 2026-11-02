import { QueryClient } from '@tanstack/react-query'
import { isTemporary } from './http'

export const queryClient = new QueryClient({
  defaultOptions: {
    // Reads: retry twice, but only when the failure is temporary.
    queries: { retry: (count, err) => count < 2 && isTemporary(err), staleTime: 5_000 },
    // Writes are never retried automatically. The user decides.
    mutations: { retry: false },
  },
})
