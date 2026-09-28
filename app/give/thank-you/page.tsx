import Link from 'next/link'
import { redirect } from 'next/navigation'
import { verifyTransaction, type PaystackTransaction } from '@/lib/paystack'
import { saveVerifiedTransaction } from '@/lib/donations'
import { formatMoney } from '@/lib/giving'

export const metadata = { title: 'Thank You – Gideon Peprah Ministries', robots: { index: false } }
export const dynamic = 'force-dynamic'

const CHANNEL_LABELS: Record<string, string> = {
  mobile_money: 'Mobile Money',
  card: 'Card',
  bank: 'Bank',
  bank_transfer: 'Bank transfer',
}

function Icon({ kind }: { kind: 'success' | 'pending' | 'failed' }) {
  const styles = {
    success: 'bg-green-50 text-green-600',
    pending: 'bg-brand-pale text-brand-main',
    failed: 'bg-red-50 text-red-600',
  }[kind]
  const path = {
    success: 'M4.5 12.75l6 6 9-13.5',
    pending: 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z',
    failed: 'M6 18L18 6M6 6l12 12',
  }[kind]
  return (
    <div className={`w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center ${styles}`}>
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d={path} />
      </svg>
    </div>
  )
}

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: { reference?: string; trxref?: string }
}) {
  const reference = searchParams.reference || searchParams.trxref
  if (!reference) redirect('/give')

  // Always ask Paystack directly; the address bar can be edited by anyone.
  let tx: PaystackTransaction | null = null
  try {
    tx = await verifyTransaction(reference)
  } catch (e) {
    console.error('Paystack verify failed', reference, e)
  }
  // The webhook also saves it, so a failure here only needs logging.
  if (tx) await saveVerifiedTransaction(tx).catch((e) => console.error('Could not save donation', reference, e))

  const kind = tx?.status === 'success' ? 'success' : !tx || ['failed', 'abandoned', 'reversed'].includes(tx.status) ? 'failed' : 'pending'
  const charged = tx ? formatMoney(tx.amount / 100, tx.currency) : null
  // What the donor chose, if it was converted (e.g. €50 charged in USD).
  const m = tx?.metadata || {}
  const donorCurrency = typeof m.donor_currency === 'string' ? m.donor_currency : null
  const donorAmount = Number(m.donor_amount_minor) / 100
  const amount =
    tx && donorCurrency && donorCurrency !== tx.currency && donorAmount
      ? `${formatMoney(donorAmount, donorCurrency)} (charged as ${charged})`
      : charged

  return (
    <section className="px-4 sm:px-6 py-14 sm:py-24 bg-paper min-h-[60vh] flex items-center">
      <div className="max-w-lg w-full mx-auto bg-white rounded-3xl shadow-xl p-8 sm:p-10 text-center">
        <Icon kind={kind} />

        {kind === 'success' && (
          <>
            <h1 className="font-heading text-3xl font-extrabold text-brand-main mb-3">Thank you!</h1>
            <p className="text-ink-muted leading-relaxed mb-6">
              Your gift of <strong className="text-ink">{amount}</strong> has been received. May God bless you
              abundantly for your generosity.
            </p>
            <p className="font-heading italic text-brand-dark mb-8">
              &ldquo;God loves a cheerful giver.&rdquo; — 2 Corinthians 9:7
            </p>
          </>
        )}

        {kind === 'pending' && (
          <>
            <h1 className="font-heading text-3xl font-extrabold text-brand-main mb-3">Almost there…</h1>
            <p className="text-ink-muted leading-relaxed mb-8">
              Your payment of <strong className="text-ink">{amount}</strong> is still being processed. If you paid
              with Mobile Money, please approve the prompt on your phone. You&apos;ll receive a receipt by email once
              it&apos;s confirmed.
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
              <dt className="text-ink-soft">Reference</dt>
              <dd className="font-semibold text-ink break-all text-right">{tx.reference}</dd>
            </div>
            {tx.channel && (
              <div className="flex justify-between gap-4">
                <dt className="text-ink-soft">Paid with</dt>
                <dd className="font-semibold text-ink">{CHANNEL_LABELS[tx.channel] || tx.channel}</dd>
              </div>
            )}
            <div className="flex justify-between gap-4">
              <dt className="text-ink-soft">Receipt sent to</dt>
              <dd className="font-semibold text-ink break-all text-right">{tx.customer.email}</dd>
            </div>
          </dl>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {kind === 'failed' ? (
            <Link href="/give" className="btn-primary">Try Again</Link>
          ) : (
            <Link href="/" className="btn-primary">Back to Home</Link>
          )}
          <Link href="/contact" className="btn-outline-brand">Contact Us</Link>
        </div>
      </div>
    </section>
  )
}
