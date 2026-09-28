import { NextResponse } from 'next/server'
import { isValidWebhookSignature, verifyTransaction } from '@/lib/paystack'
import { isDonationReference, saveVerifiedTransaction } from '@/lib/donations'
import { isOrderReference, saveVerifiedOrder } from '@/lib/orders'

/**
 * Paystack calls this after every payment, even if the donor closes their browser
 * before reaching the thank-you page. Set it in the Paystack dashboard:
 * Settings → API Keys & Webhooks → Webhook URL = https://<your-site>/api/paystack/webhook
 */
export async function POST(req: Request) {
  const raw = await req.text()
  if (!isValidWebhookSignature(raw, req.headers.get('x-paystack-signature'))) {
    return NextResponse.json({ ok: false }, { status: 401 })
  }

  let event: { event?: string; data?: { reference?: string; metadata?: Record<string, unknown> } }
  try {
    event = JSON.parse(raw)
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 })
  }

  const reference = event.data?.reference
  // Only payments made on this website: gifts ("GPM-…") and book orders ("GPMB-…").
  const isGift = !!reference && isDonationReference(reference)
  const isOrder = !!reference && isOrderReference(reference)
  if (event.event === 'charge.success' && reference && (isGift || isOrder)) {
    try {
      // Re-check with Paystack rather than trusting the payload alone.
      const tx = await verifyTransaction(reference)
      if (isOrder) await saveVerifiedOrder(tx)
      else await saveVerifiedTransaction(tx, event.data?.metadata)
    } catch (e) {
      console.error('Webhook: could not verify or save', reference, e)
      // A non-2xx reply makes Paystack retry later.
      return NextResponse.json({ ok: false }, { status: 500 })
    }
  }

  return NextResponse.json({ ok: true })
}
