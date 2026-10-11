import Link from 'next/link'
import { redirect } from 'next/navigation'
import { verifyTransaction, type PaystackTransaction } from '@/lib/paystack'
import { isInsightReference, saveVerifiedInsightRequest } from '@/lib/insight-requests'
import { formatMoney } from '@/lib/giving'

export const metadata = { title: 'Request Received – Gideon Peprah Ministries', robots: { index: false } }
export const dynamic = 'force-dynamic'

export default async function InsightThankYouPage({
  searchParams,
}: {
  searchParams: { reference?: string; trxref?: string }
}) {
  const reference = searchParams.reference || searchParams.trxref
  if (!reference || !isInsightReference(reference)) redirect('/prophetic-insight')

  // Always ask Paystack directly; the address bar can be edited by anyone.
  let tx: PaystackTransaction | null = null
  try {
    tx = await verifyTransaction(reference)
  } catch (e) {
    console.error('Paystack verify failed', reference, e)
  }
  // The webhook also saves it, so a failure here only needs logging.
  if (tx) await saveVerifiedInsightRequest(tx).catch((e) => console.error('Could not save insight request', reference, e))

  const kind = tx?.status === 'success' ? 'success' : !tx || ['failed', 'abandoned', 'reversed'].includes(tx.status) ? 'failed' : 'pending'

  return (
    <section className="px-4 sm:px-6 py-14 sm:py-24 bg-paper min-h-[60vh] flex items-center">
      <div className="max-w-lg w-full mx-auto bg-white rounded-3xl shadow-xl p-8 sm:p-10 text-center">
        {kind === 'success' && (
          <>
            <h1 className="font-heading text-3xl font-extrabold text-brand-main mb-3">Request received!</h1>
            <p className="text-ink-muted leading-relaxed mb-8">
              Thank you for your seed of <strong className="text-ink">{formatMoney(tx!.amount / 100, tx!.currency)}</strong>.
              Your request has been passed on to Prophet Gideon Peprah, and our team will contact you soon. We&apos;ve
              emailed you a copy.
            </p>
          </>
        )}

        {kind === 'pending' && (
          <>
            <h1 className="font-heading text-3xl font-extrabold text-brand-main mb-3">Almost there…</h1>
            <p className="text-ink-muted leading-relaxed mb-8">
              Your payment is still being processed. If you paid with Mobile Money, please approve the prompt on your
              phone. Your request will be sent, and you&apos;ll get an email, once it&apos;s confirmed.
            </p>
          </>
        )}

        {kind === 'failed' && (
          <>
            <h1 className="font-heading text-3xl font-extrabold text-brand-main mb-3">Request not sent</h1>
            <p className="text-ink-muted leading-relaxed mb-8">
              {tx
                ? 'Your payment was cancelled or didn’t go through, so your request has not been sent and you have not been charged.'
                : 'We couldn’t confirm your payment just now. If money left your account, your request will still be sent and you’ll get an email; otherwise please try again.'}
            </p>
          </>
        )}

        {tx && (
          <dl className="text-sm text-left bg-brand-pale rounded-xl px-5 py-4 mb-8 space-y-1.5">
            <div className="flex justify-between gap-4">
              <dt className="text-ink-soft">Reference</dt>
              <dd className="font-semibold text-ink break-all text-right">{tx.reference}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-soft">Email</dt>
              <dd className="font-semibold text-ink break-all text-right">{tx.customer.email}</dd>
            </div>
          </dl>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {kind === 'failed' ? (
            <Link href="/prophetic-insight" className="btn-primary">Try Again</Link>
          ) : (
            <Link href="/" className="btn-primary">Back to Home</Link>
          )}
          <Link href="/contact" className="btn-outline-brand">Contact Us</Link>
        </div>
      </div>
    </section>
  )
}
