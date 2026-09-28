import { headers } from 'next/headers'

/** The site's own address (server only), so Paystack can send the buyer back here after paying. */
export function siteOrigin() {
  const h = headers()
  const host = h.get('x-forwarded-host') || h.get('host') || 'localhost:3000'
  const proto = h.get('x-forwarded-proto') || (host.startsWith('localhost') ? 'http' : 'https')
  return `${proto}://${host}`
}
