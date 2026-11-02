import type { ReactNode } from 'react'
import { Button } from './Button'

// Loading, empty and error views. `dark` is for the black part of the page.

export function Loading({ label, dark = false }: { label: string; dark?: boolean }) {
  return (
    <div
      role="status"
      className={`flex flex-col items-center gap-3 py-12 text-sm ${dark ? 'text-white/50' : 'text-neutral-400'}`}
    >
      <span className="size-6 animate-spin rounded-full border-2 border-current border-t-transparent" />
      {label}
    </div>
  )
}

export function Empty({
  title,
  hint,
  action,
}: {
  title: string
  hint: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center gap-1 px-6 py-12 text-center">
      <p className="font-semibold">{title}</p>
      <p className="text-sm text-neutral-400">{hint}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

type ErrorProps = { message: string; onRetry?: () => void; dark?: boolean }

export function ErrorState({ message, onRetry, dark = false }: ErrorProps) {
  return (
    <div role="alert" className="flex flex-col items-center gap-1 px-6 py-12 text-center">
      <p className="font-semibold">Something went wrong</p>
      <p className={`text-sm ${dark ? 'text-white/50' : 'text-neutral-400'}`}>{message}</p>
      {onRetry && (
        <Button variant={dark ? 'light' : 'solid'} onClick={onRetry} className="mt-4">
          Try again
        </Button>
      )}
    </div>
  )
}
