// Shared by the Give page (client) and the server code; no server-only imports here.

export type GivingTypeId = 'partnership' | 'seed'

export const GIVING_TYPES: readonly { id: GivingTypeId; label: string; hint: string }[] = [
  { id: 'partnership', label: 'Partnership/Donation', hint: 'Support the work of the ministry' },
  { id: 'seed', label: 'Seed/Offering', hint: 'Sow a seed or give an offering' },
] as const

/** Used when a gift's purpose is missing or unrecognised. */
export const DEFAULT_GIVING_TYPE: GivingTypeId = 'partnership'


/** Currencies donors can choose on the Give page. */
export const CURRENCIES = {
  GHS: { symbol: '₵', short: 'GH₵', label: 'Cedi', name: 'Ghana cedi', presets: [20, 50, 100, 200, 500, 1000], max: 100_000 },
  USD: { symbol: '$', short: 'US$', label: 'Dollar', name: 'US dollar', presets: [5, 10, 25, 50, 100, 250], max: 10_000 },
  EUR: { symbol: '€', short: '€', label: 'Euro', name: 'Euro', presets: [5, 10, 25, 50, 100, 250], max: 10_000 },
  GBP: { symbol: '£', short: '£', label: 'Pound', name: 'British pound', presets: [5, 10, 25, 50, 100, 250], max: 10_000 },
  NGN: { symbol: '₦', short: '₦', label: 'Naira', name: 'Nigerian naira', presets: [1000, 2000, 5000, 10_000, 20_000, 50_000], max: 10_000_000 },
} as const

export type CurrencyCode = keyof typeof CURRENCIES
export const CURRENCY_CODES = Object.keys(CURRENCIES) as CurrencyCode[]
export const DEFAULT_CURRENCY: CurrencyCode = 'USD'

/** Smallest gift accepted online, in any currency. */
export const MIN_AMOUNT = 1

export const isCurrencyCode = (c: string): c is CurrencyCode => c in CURRENCIES

export const givingTypeLabel = (id: string) => GIVING_TYPES.find((t) => t.id === id)?.label ?? id

/** "₵1,250", "$12.50", "€50". Unknown codes fall back to "12.50 XYZ". */
export function formatMoney(amount: number, currency: string) {
  const digits = { minimumFractionDigits: Number.isInteger(amount) ? 0 : 2, maximumFractionDigits: 2 }
  const n = amount.toLocaleString('en-GB', digits)
  return isCurrencyCode(currency) ? `${CURRENCIES[currency].symbol}${n}` : `${n} ${currency}`
}

/** "₵1 and ₵100,000" — the allowed range, for messages. */
export const amountRange = (c: CurrencyCode) =>
  `${formatMoney(MIN_AMOUNT, c)} and ${formatMoney(CURRENCIES[c].max, c)}`

/**
 * Parse a typed amount like "1,000" or "50.5". Returns the amount rounded to two
 * decimals, or null if it isn't a valid gift amount in that currency.
 */
export function parseAmount(input: string, currency: CurrencyCode): number | null {
  const cleaned = input.replace(/[,\s₵$€£₦]/g, '')
  if (!/^\d+(\.\d{1,2})?$/.test(cleaned)) return null
  const n = Math.round(Number(cleaned) * 100) / 100
  return n >= MIN_AMOUNT && n <= CURRENCIES[currency].max ? n : null
}

/**
 * Which currency a gift is actually charged in. Paystack Ghana can charge GHS, and USD
 * once enabled on the account; anything else is converted (to USD if possible, else GHS).
 */
export function chargeCurrency(donorCurrency: CurrencyCode, chargeable: string[]): CurrencyCode {
  if (chargeable.includes(donorCurrency)) return donorCurrency
  return chargeable.includes('USD') ? 'USD' : 'GHS'
}

/** Convert using rates quoted per 1 USD (e.g. { GHS: 11.6, EUR: 0.88 }). Rounded to 2 decimals. */
export function convert(amount: number, from: string, to: string, ratesPerUsd: Record<string, number>) {
  if (from === to) return amount
  const f = from === 'USD' ? 1 : ratesPerUsd[from]
  const t = to === 'USD' ? 1 : ratesPerUsd[to]
  if (!f || !t) return null
  return Math.round(((amount / f) * t) * 100) / 100
}
