import { getRecentDonations } from '@/lib/donations'
import { formatMoney, givingTypeLabel } from '@/lib/giving'
import { MUTED, NotSetUp, SectionHeader, cardStyle } from './admin-ui'

const STATUS_STYLES: Record<string, [string, string]> = {
  success: ['Received', 'bg-green-50 text-green-700'],
  pending: ['Not completed', 'bg-gray-100 text-gray-600'],
  ongoing: ['Processing', 'bg-amber-50 text-amber-700'],
  processing: ['Processing', 'bg-amber-50 text-amber-700'],
  abandoned: ['Cancelled', 'bg-gray-100 text-gray-600'],
  failed: ['Failed', 'bg-red-50 text-red-700'],
  reversed: ['Refunded', 'bg-red-50 text-red-700'],
}

const CHANNELS: Record<string, string> = { mobile_money: 'MoMo', card: 'Card', bank: 'Bank', bank_transfer: 'Bank transfer' }

const dateFmt = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })

export default async function DonationsSection() {
  const donations = await getRecentDonations(100)

  const received = (donations || []).filter((d) => d.status === 'success')
  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime()
  // Totals are kept per charged currency (cedis and dollars can't simply be added).
  const sum = (list: typeof received) => {
    const byCurrency: Record<string, number> = {}
    for (const d of list) byCurrency[d.currency] = (byCurrency[d.currency] || 0) + d.amount_minor
    const parts = Object.entries(byCurrency).map(([c, minor]) => formatMoney(minor / 100, c))
    return parts.length ? parts.join(' + ') : formatMoney(0, 'GHS')
  }
  const thisMonth = received.filter((d) => new Date(d.paid_at || d.created_at).getTime() >= monthStart)

  return (
    <div className="mb-16">
      <SectionHeader
        id="donations"
        title="Donations"
        hint="Gifts made through the Give page (latest 100). Full records and payouts are in your Paystack dashboard."
      />

      {donations === null ? (
        <NotSetUp what="Donations" />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 mb-5">
            {[
              ['Received this month', sum(thisMonth), thisMonth.length],
              ['Received (shown below)', sum(received), received.length],
            ].map(([label, total, count]) => (
              <div key={label as string} className="bg-white rounded-xl p-4" style={cardStyle}>
                <p className="text-xs" style={{ color: MUTED }}>{label}</p>
                <p className="font-heading text-xl sm:text-2xl font-extrabold text-brand-dark">{total as string}</p>
                <p className="text-xs" style={{ color: MUTED }}>
                  {count} {count === 1 ? 'gift' : 'gifts'}
                </p>
              </div>
            ))}
          </div>

          {donations.length === 0 ? (
            <p className="text-sm" style={{ color: MUTED }}>No gifts yet.</p>
          ) : (
            <div className="space-y-2">
              {donations.map((d) => {
                const [statusLabel, statusClass] = STATUS_STYLES[d.status] || [d.status, 'bg-gray-100 text-gray-600']
                return (
                  <details key={d.id} className="bg-white rounded-xl group" style={cardStyle}>
                    <summary className="list-none cursor-pointer p-3 sm:p-4 flex flex-wrap items-center gap-x-4 gap-y-1">
                      <span className="font-heading font-bold text-brand-dark w-24">
                        {formatMoney((d.donor_amount_minor ?? d.amount_minor) / 100, d.donor_currency ?? d.currency)}
                      </span>
                      <span className="flex-1 min-w-[8rem] text-sm font-semibold truncate" style={{ color: 'var(--brand-dark)' }}>
                        {d.name}
                        <span className="font-normal" style={{ color: MUTED }}> · {givingTypeLabel(d.giving_type)}</span>
                      </span>
                      <span className="text-xs" style={{ color: MUTED }}>{dateFmt.format(new Date(d.created_at))}</span>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${statusClass}`}>{statusLabel}</span>
                    </summary>
                    <dl className="px-4 pb-4 grid sm:grid-cols-2 gap-x-6 gap-y-1 text-sm">
                      {d.donor_currency && d.donor_currency !== d.currency && (
                        <div>
                          <dt className="inline" style={{ color: MUTED }}>Charged: </dt>
                          <dd className="inline">{formatMoney(d.amount_minor / 100, d.currency)} (at {d.fx_rate} per {d.donor_currency})</dd>
                        </div>
                      )}
                      <div><dt className="inline" style={{ color: MUTED }}>Email: </dt><dd className="inline break-all">{d.email}</dd></div>
                      {d.phone && <div><dt className="inline" style={{ color: MUTED }}>Phone: </dt><dd className="inline">{d.phone}</dd></div>}
                      {d.channel && <div><dt className="inline" style={{ color: MUTED }}>Paid with: </dt><dd className="inline">{CHANNELS[d.channel] || d.channel}</dd></div>}
                      <div><dt className="inline" style={{ color: MUTED }}>Reference: </dt><dd className="inline break-all">{d.reference}</dd></div>
                      {d.message && (
                        <div className="sm:col-span-2 mt-1 p-3 rounded-lg bg-brand-pale">
                          <dt className="text-xs font-bold text-brand-dark mb-0.5">Note / prayer request</dt>
                          <dd className="whitespace-pre-line">{d.message}</dd>
                        </div>
                      )}
                    </dl>
                  </details>
                )
              })}
            </div>
          )}
        </>
      )}
    </div>
  )
}
