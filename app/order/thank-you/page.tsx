import Link from 'next/link'
import { redirect } from 'next/navigation'
import { verifyTransaction, type PaystackTransaction } from '@/lib/paystack'
import { isOrderReference, saveVerifiedOrder } from '@/lib/orders'
import { formatMoney } from '@/lib/giving'
import { PICKUP_LOCATION } from '@/lib/order-settings'

export const metadata = { title: 'Order Received – Gideon Peprah Ministries', robots: { index: false } }
export const dynamic = 'force-dynamic'

export default async function OrderThankYouPage({
  searchParams,
}: {
  searchParams: { reference?: string; trxref?: string }
}) {
  const reference = searchParams.reference || searchParams.trxref
  if (!reference || !isOrderReference(reference)) redirect('/order')

  // Always ask Paystack directly; the address bar can be edited by anyone.
  let tx: PaystackTransaction | null = null
  try {
    tx = await verifyTransaction(reference)
  } catch (e) {
    console.error('Paystack verify failed', reference, e)
  }
  // The webhook also saves it, so a failure here only needs logging.
  if (tx) await saveVerifiedOrder(tx).catch((e) => console.error('Could not save order', reference, e))

  const kind = tx?.status === 'success' ? 'success' : !tx || ['failed', 'abandoned', 'reversed'].includes(tx.status) ? 'failed' : 'pending'
  const m = tx?.metadata || {}
  const book = typeof m.book_title === 'string' ? `${m.book_title}${Number(m.quantity) > 1 ? ` × ${m.quantity}` : ''}` : 'your book'
  const pickup = m.fulfilment === 'pickup'

  return (
    <section className="px-4 sm:px-6 py-14 sm:py-24 bg-paper min-h-[60vh] flex items-center">
      <div className="max-w-lg w-full mx-auto bg-white rounded-3xl shadow-xl p-8 sm:p-10 text-center">
        {kind === 'success' && (
          <>
            <h1 className="font-heading text-3xl font-extrabold text-brand-main mb-3">Order received!</h1>
            <p className="text-ink-muted leading-relaxed mb-8">
              Thank you. We&apos;ve received your payment of{' '}
              <strong className="text-ink">{formatMoney(tx!.amount / 100, tx!.currency)}</strong> for{' '}
              <strong className="text-ink">{book}</strong>.{' '}
              {pickup
                ? `We'll call you when it's ready to collect at ${PICKUP_LOCATION}.`
                : 'We’ll call you shortly to arrange delivery.'}
            </p>
          </>
        )}

        {kind === 'pending' && (
          <>
            <h1 className="font-heading text-3xl font-extrabold text-brand-main mb-3">Almost there…</h1>
            <p className="text-ink-muted leading-relaxed mb-8">
              Your payment is still being processed. If you paid with Mobile Money, please approve the prompt on your
              phone. You&apos;ll receive a receipt by email once it&apos;s confirmed.
            </p>
          </>
        )}

        {kind === 'failed' && (
          <>
            <h1 className="font-heading text-3xl font-extrabold text-brand-main mb-3">Payment not completed</h1>
            <p className="text-ink-muted leading-relaxed mb-8">
              {tx
                ? 'Your payment was cancelled or didn’t go through, and you have not been charged.'
                : 'We couldn’t confirm your payment just now. If money left your account, you’ll get a receipt by email; otherwise please try again.'}
            </p>
          </>
        )}

        {tx && (
          <dl className="text-sm text-left bg-brand-pale rounded-xl px-5 py-4 mb-8 space-y-1.5">
            <div className="flex justify-between gap-4">
              <dt className="text-ink-soft">Order reference</dt>
              <dd className="font-semibold text-ink break-all text-right">{tx.reference}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-soft">Receipt sent to</dt>
              <dd className="font-semibold text-ink break-all text-right">{tx.customer.email}</dd>
            </div>
          </dl>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {kind === 'failed' ? (
            <Link href="/order" className="btn-primary">Try Again</Link>
          ) : (
            <Link href="/" className="btn-primary">Back to Home</Link>
          )}
          <Link href="/contact" className="btn-outline-brand">Contact Us</Link>
        </div>
      </div>
    </section>
  )
}
