import { BackspaceIcon } from '../../components/ui/icons'
import { KEYS, type KeypadKey } from './amount-input'

/** 3×4 number pad from the design. A pressed key flashes grey and fades back (~200 ms). */
export function Keypad({ onKey }: { onKey: (key: KeypadKey) => void }) {
  return (
    <div className="mt-6 grid grid-cols-3 gap-2">
      {KEYS.map((key) => (
        <button
          key={key}
          type="button"
          onClick={() => onKey(key)}
          aria-label={key === 'back' ? 'Delete' : key}
          className="grid h-14 place-items-center rounded-2xl bg-neutral-100 text-2xl font-medium text-neutral-700 transition-colors duration-200 ease-out active:bg-neutral-400 active:text-white active:duration-0"
        >
          {key === 'back' ? <BackspaceIcon /> : key}
        </button>
      ))}
    </div>
  )
}
