export const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'back'] as const
export type KeypadKey = (typeof KEYS)[number]

export const isKeypadKey = (key: string): key is KeypadKey =>
  (KEYS as readonly string[]).includes(key)

/** Up to 7 digits, then optionally "." and up to 2 digits. Same rule for typing and the keypad. */
export const isAmountText = (text: string) => /^\d{0,7}(\.\d{0,2})?$/.test(text)

/** What the amount text becomes after one keypad press. Invalid presses change nothing. */
export function pressKey(value: string, key: KeypadKey): string {
  if (key === 'back') return value.slice(0, -1)
  if (key === '.' && value === '') return '0.'
  const next = value === '0' && key !== '.' ? key : value + key
  return isAmountText(next) ? next : value
}
