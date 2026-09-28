import { CURRENCY_CODES } from './giving'

/**
 * Exchange rates per 1 USD for the donor currencies, from the free open.er-api.com
 * feed (updated daily, no API key). Cached for 6 hours. Returns null if unavailable,
 * in which case only directly chargeable currencies can be used.
 */
export async function getRatesPerUsd(): Promise<Record<string, number> | null> {
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/USD', { next: { revalidate: 6 * 60 * 60 } })
    const body = await res.json()
    if (body.result !== 'success') throw new Error(body['error-type'] || 'bad response')
    const rates: Record<string, number> = {}
    for (const c of CURRENCY_CODES) {
      if (c !== 'USD' && typeof body.rates?.[c] === 'number') rates[c] = body.rates[c]
    }
    return rates
  } catch (e) {
    console.error('Exchange rates unavailable', e)
    return null
  }
}

/** Currencies the Paystack account can charge, from PAYSTACK_CURRENCIES (default: GHS). */
export function chargeableCurrencies(): string[] {
  const list = (process.env.PAYSTACK_CURRENCIES || 'GHS')
    .split(',')
    .map((c) => c.trim().toUpperCase())
    .filter(Boolean)
  return list.includes('GHS') ? list : ['GHS', ...list]
}
