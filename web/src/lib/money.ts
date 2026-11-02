// Money is whole paise (1 rupee = 100 paise). The API names these fields "cents".

/** 785443 → { rupees: "7,854", paise: "43" }. 12345678 → "1,23,456". Integer math only. */
export function moneyParts(totalPaise: number) {
  const rupees = Math.floor(totalPaise / 100).toLocaleString('en-IN')
  const paise = String(totalPaise % 100).padStart(2, '0')
  return { rupees, paise }
}

export function formatMoney(totalPaise: number) {
  const { rupees, paise } = moneyParts(totalPaise)
  return `₹${rupees}.${paise}`
}

/** "12.5" → 1250 paise. Parses the text, never goes through a float. null when invalid. */
export function toPaise(text: string): number | null {
  const match = /^(\d{1,7})(?:\.(\d{0,2}))?$/.exec(text)
  if (!match) return null
  return Number(match[1] ?? '0') * 100 + Number((match[2] ?? '').padEnd(2, '0'))
}
