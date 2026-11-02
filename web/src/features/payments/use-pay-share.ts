import { useMutation } from '@tanstack/react-query'
import { useRef } from 'react'
import { api } from '../../api/client'
import { useRefreshHome } from '../../api/queries'
import { isTemporary } from '../../lib/http'

/**
 * Pays one share. The Idempotency-Key is kept until we get a clear answer:
 * if a timed-out request actually reached the server, pressing Pay again
 * sends the same key, so the server replays the first result instead of paying twice.
 */
export function usePayShare(homeId: string, billId: string, shareId: string) {
  const refresh = useRefreshHome(homeId)
  const key = useRef<string | null>(null)

  return useMutation({
    mutationFn: () => {
      key.current ??= crypto.randomUUID()
      return api.payShare(billId, shareId, key.current)
    },
    onError: (err) => {
      if (!isTemporary(err)) key.current = null
    },
    onSettled: refresh,
  })
}
