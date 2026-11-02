const COLORS = ['bg-amber-300', 'bg-emerald-300', 'bg-sky-300', 'bg-rose-300', 'bg-violet-300']

/** Same name → same color, every time. */
function colorFor(name: string) {
  let hash = 0
  for (const char of name) hash = (hash * 31 + char.charCodeAt(0)) % 997
  return COLORS[hash % COLORS.length]
}

export function Avatar({ name, small = false }: { name: string; small?: boolean }) {
  const initials = name
    .split(/\s+/)
    .map((word) => word[0] ?? '')
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <span
      aria-hidden="true"
      className={`grid shrink-0 place-items-center rounded-full font-semibold text-black/75 ${colorFor(name)} ${small ? 'size-8 text-[11px]' : 'size-10 text-sm'}`}
    >
      {initials}
    </span>
  )
}
