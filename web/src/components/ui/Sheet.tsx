import { type ReactNode, useEffect, useRef } from 'react'

type Props = { label: string; onClose: () => void; children: ReactNode }

/**
 * Bottom sheet built on the native <dialog>.
 * showModal() gives us focus trapping and Escape-to-close for free.
 */
export function Sheet({ label, onClose, children }: Props) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (dialog && !dialog.open) dialog.showModal()
  }, [])

  return (
    <dialog
      ref={ref}
      aria-label={label}
      onClose={onClose}
      className="animate-sheet mx-auto mt-auto mb-0 max-h-[92dvh] w-full max-w-[420px] rounded-t-[32px] bg-white px-5 pt-3 pb-8 text-neutral-900 backdrop:bg-black/50"
    >
      <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-neutral-200" />
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-5 text-sm font-medium text-neutral-400 hover:text-neutral-900"
      >
        Cancel
      </button>
      {children}
    </dialog>
  )
}
