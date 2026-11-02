import type { ButtonHTMLAttributes } from 'react'

const VARIANTS = {
  light: 'bg-white text-neutral-900', // on dark backgrounds
  dark: 'bg-white/10 text-white', // secondary, on dark backgrounds
  solid: 'bg-neutral-900 text-white', // on white backgrounds
}

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: keyof typeof VARIANTS }

/** Pill button, like "Send" / "Request" in the design. */
export function Button({ variant = 'light', className = '', type = 'button', ...rest }: Props) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition active:scale-95 disabled:pointer-events-none disabled:opacity-40 ${VARIANTS[variant]} ${className}`}
      {...rest}
    />
  )
}
