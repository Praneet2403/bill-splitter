// Decorative icons: always next to text, so hidden from screen readers.

type IconProps = { className?: string }

const stroke = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const

export const PlusIcon = ({ className = 'size-4' }: IconProps) => (
  <svg aria-hidden="true" {...stroke} strokeWidth={2.5} className={className}>
    <path d="M12 5v14M5 12h14" />
  </svg>
)

export const CheckIcon = ({ className = 'size-4' }: IconProps) => (
  <svg aria-hidden="true" {...stroke} strokeWidth={3} className={className}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
)

export const BackspaceIcon = ({ className = 'size-6' }: IconProps) => (
  <svg aria-hidden="true" {...stroke} strokeWidth={1.8} className={className}>
    <path d="M9 5h11v14H9l-6-7z" />
    <path d="m12.5 9.5 5 5m0-5-5 5" />
  </svg>
)
