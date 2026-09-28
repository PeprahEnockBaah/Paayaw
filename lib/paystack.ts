import crypto from 'crypto'

/**
 * Minimal server-only Paystack client.
 * Docs: https://paystack.com/docs/api/transaction/
 * Needs PAYSTACK_SECRET_KEY in .env.local (sk_test_… while testing, sk_live_… when live).
 * NEVER import this into a Client Component.
 */

const API = 'https://api.paystack.co'

function secretKey() {
  const key = process.env.PAYSTACK_SECRET_KEY
  if (!key) throw new Error('Paystack is not configured. Set PAYSTACK_SECRET_KEY in .env.local')
  return key
}

export const isPaystackConfigured = () => !!process.env.PAYSTACK_SECRET_KEY

/** True when using a test key: payments are simulated and no real money moves. */
export const isPaystackTestMode = () => (process.env.PAYSTACK_SECRET_KEY || '').startsWith('sk_test_')

async function call<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${secretKey()}`,
      'Content-Type': 'application/json',
      ...init?.headers,
    },
    cache: 'no-store',
  })
  const body = await res.json().catch(() => ({}))
  if (!res.ok || !body.status) {
    throw new Error(`Paystack ${path} failed: ${body.message || res.status}`)
  }
  return body.data as T
}

/** Start a payment; returns the Paystack checkout URL to send the donor to. */
export async function initializeTransaction(params: {
  email: string
  /** In the smallest unit of `currency` (pesewas, cents). */
  amountMinor: number
  currency: string
  reference: string
  callbackUrl: string
  metadata: Record<string, unknown>
}) {
  return call<{ authorization_url: string; reference: string }>('/transaction/initialize', {
    method: 'POST',
    body: JSON.stringify({
      email: params.email,
      amount: params.amountMinor,
      currency: params.currency,
      reference: params.reference,
      callback_url: params.callbackUrl,
      metadata: params.metadata,
    }),
  })
}

export type PaystackTransaction = {
  reference: string
  status: 'success' | 'failed' | 'abandoned' | 'ongoing' | 'pending' | 'processing' | 'queued' | 'reversed'
  amount: number // smallest unit of `currency`
  currency: string
  channel: string | null
  paid_at: string | null
  customer: { email: string }
  metadata?: Record<string, unknown> | null
}

/** Ask Paystack for the real status of a payment (never trust the browser's word for it). */
export function verifyTransaction(reference: string) {
  return call<PaystackTransaction>(`/transaction/verify/${encodeURIComponent(reference)}`)
}

/** Check that a webhook request really came from Paystack. */
export function isValidWebhookSignature(rawBody: string, signature: string | null) {
  if (!signature || !isPaystackConfigured()) return false
  const expected = crypto.createHmac('sha512', secretKey()).update(rawBody).digest('hex')
  const a = Buffer.from(expected)
  const b = Buffer.from(signature)
  return a.length === b.length && crypto.timingSafeEqual(a, b)
}
