import { type FormEvent, useEffect, useState } from 'react'
import { useCreateBill } from '../../api/queries'
import { Button } from '../../components/ui/Button'
import { Sheet } from '../../components/ui/Sheet'
import { formatMoney, toPaise } from '../../lib/money'
import { isKeypadKey, pressKey } from './amount-input'
import { Keypad } from './Keypad'

type Props = { homeId: string; memberCount: number; onClose: () => void }

export function NewBillSheet({ homeId, memberCount, onClose }: Props) {
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const create = useCreateBill(homeId)

  const paise = toPaise(amount)
  const valid = title.trim() !== '' && paise !== null && paise > 0

  // A physical keyboard works like the keypad, except while typing the title.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement instanceof HTMLInputElement) return
      const key = e.key === 'Backspace' ? 'back' : e.key
      if (isKeypadKey(key)) setAmount((value) => pressKey(value, key))
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!valid) return
    create.mutate({ title: title.trim(), totalCents: paise }, { onSuccess: onClose })
  }

  return (
    <Sheet label="New bill" onClose={onClose}>
      <form onSubmit={submit} className="flex flex-col pt-6">
        <h2 className="text-center text-lg font-semibold">New bill</h2>
        <p className="text-center text-xs text-neutral-400">Split between {memberCount} members</p>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What is it for?"
          aria-label="Bill title"
          maxLength={100}
          className="mt-4 rounded-2xl bg-neutral-100 px-4 py-3 text-center outline-none focus:ring-2 focus:ring-neutral-900"
        />

        <output
          aria-live="polite"
          className="mt-6 flex justify-center text-5xl font-bold tracking-tight tabular-nums"
        >
          <span className={amount ? '' : 'text-neutral-200'}>₹</span>
          {amount ? (
            [...amount].map((char, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: a typed digit is identified by its position
              <span key={i} className="animate-digit">
                {char}
              </span>
            ))
          ) : (
            <span className="text-neutral-200">0.00</span>
          )}
        </output>
        <p className="mt-1 text-center text-xs text-neutral-400">
          {paise ? `Up to ${formatMoney(Math.ceil(paise / memberCount))} each` : 'Enter the total'}
        </p>

        <Keypad onKey={(key) => setAmount((value) => pressKey(value, key))} />

        {create.isError && (
          <p role="alert" className="mt-3 text-center text-sm text-red-600">
            {create.error.message}
          </p>
        )}
        <Button
          type="submit"
          variant="solid"
          className="mt-4 py-3.5 text-base"
          disabled={!valid || create.isPending}
        >
          {create.isPending ? 'Splitting…' : 'Split bill'}
        </Button>
      </form>
    </Sheet>
  )
}
