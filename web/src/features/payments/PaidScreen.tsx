import { type CSSProperties, useEffect } from 'react'
import { CheckIcon } from '../../components/ui/icons'
import { formatMoney } from '../../lib/money'
import type { PaidInfo } from './ShareRow'

/**
 * The green success screen from the video: a circle grows out of the Pay button (~170 ms),
 * then the check, amount and name fade up one after another. Closes on tap or after 2.5 s.
 */
export function PaidScreen({
  name,
  amountCents,
  x,
  y,
  onClose,
}: PaidInfo & { onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 2500)
    return () => clearTimeout(timer)
  }, [onClose])

  const origin = { '--x': `${x}px`, '--y': `${y}px` } as CSSProperties

  return (
    <button
      type="button"
      onClick={onClose}
      style={origin}
      className="animate-reveal fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#1FD31F] text-white"
    >
      <span className="animate-fade-up [animation-delay:200ms]">
        <CheckIcon className="size-14" />
      </span>
      <span className="animate-fade-up mt-4 text-4xl font-bold tabular-nums [animation-delay:250ms]">
        {formatMoney(amountCents)}
      </span>
      <span className="animate-fade-up mt-1 text-white/90 [animation-delay:300ms]">
        Paid by {name}
      </span>
      <span className="absolute bottom-10 text-xs text-white/70">Tap anywhere to close</span>
    </button>
  )
}
