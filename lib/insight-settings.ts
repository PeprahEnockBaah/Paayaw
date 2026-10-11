// Prophetic Insight settings, shared by the request page (client) and the server.
// No server-only imports here.

/** The one service requested on this page, saved with each request and shown in emails. */
export const INSIGHT_SERVICE = 'One-on-One Counselling of Destiny'

/** Currency picked first on the form. People can switch to any of the Give page's currencies. */
export const DEFAULT_SEED_CURRENCY = 'USD' as const

/**
 * Phone numbers must be in international format: "+", country code, then the number,
 * e.g. +233 24 000 0000. Spaces, dashes and brackets are allowed and removed.
 * Returns the tidied number (e.g. "+233240000000"), or null if it isn't valid.
 */
export function parseInternationalPhone(input: string): string | null {
  const cleaned = input.replace(/[\s\-().]/g, '')
  return /^\+[1-9]\d{7,14}$/.test(cleaned) ? cleaned : null
}

/** "Monday, 20 October 2026" for the anticipated date (YYYY-MM-DD). */
export function formatAnticipated(date: string) {
  const d = new Date(`${date}T12:00:00Z`)
  if (isNaN(d.getTime())) return date
  return d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
}
