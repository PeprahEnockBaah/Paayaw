import { getRecentInsightRequests, type InsightRequest } from '@/lib/insight-requests'
import { formatMoney } from '@/lib/giving'
import { formatAnticipated } from '@/lib/insight-settings'
import { setInsightResponded } from './actions'
import { MUTED, NotSetUp, SectionHeader, cardStyle } from './admin-ui'

const CHANNELS: Record<string, string> = { mobile_money: 'MoMo', card: 'Card', bank: 'Bank', bank_transfer: 'Bank transfer' }

const dateFmt = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })

/** Where a request stands, from the admin's point of view. */
function requestState(r: InsightRequest): [string, string] {
  if (['ongoing', 'processing', 'queued'].includes(r.status)) return ['Payment processing', 'bg-amber-50 text-amber-700']
  if (r.status === 'reversed') return ['Refunded', 'bg-red-50 text-red-700']
  if (r.status !== 'success') return ['Not paid', 'bg-gray-100 text-gray-600']
  return r.responded_at ? ['Answered', 'bg-green-50 text-green-700'] : ['To answer', 'bg-amber-100 text-amber-900']
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="inline" style={{ color: MUTED }}>{label}: </dt>
      <dd className="inline break-words">{children}</dd>
    </div>
  )
}

export default async function InsightSection() {
  const requests = await getRecentInsightRequests(100)
  const paid = (requests || []).filter((r) => r.status === 'success')
  const toAnswer = paid.filter((r) => !r.responded_at)
  // Seeds can be in different currencies, so total each one separately.
  const totals = Object.entries(
    paid.reduce<Record<string, number>>((t, r) => ({ ...t, [r.currency]: (t[r.currency] || 0) + r.amount_minor }), {})
  )
  // Unpaid requests are never sent on, so they're only clutter here; Paystack has the full record.
  const shown = (requests || []).filter((r) => r.status !== 'pending' && r.status !== 'abandoned')

  return (
    <div>
      <SectionHeader
        id="insight"
        title="Prophetic Insight"
        hint="One-on-one counselling of destiny requests whose seed has been paid (latest 100). Contact the person, then mark it answered."
      />

      {requests === null ? (
        <NotSetUp what="Prophetic Insight requests" />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="bg-white rounded-xl p-4" style={cardStyle}>
              <p className="text-xs" style={{ color: MUTED }}>Waiting to be answered</p>
              <p className="font-heading text-2xl font-extrabold text-brand-dark">{toAnswer.length}</p>
            </div>
            <div className="bg-white rounded-xl p-4" style={cardStyle}>
              <p className="text-xs" style={{ color: MUTED }}>Seeds received (shown below)</p>
              <p className="font-heading text-2xl font-extrabold text-brand-dark">
                {totals.length ? totals.map(([c, minor]) => formatMoney(minor / 100, c)).join(' + ') : formatMoney(0, 'GHS')}
              </p>
              <p className="text-xs" style={{ color: MUTED }}>
                {paid.length} {paid.length === 1 ? 'request' : 'requests'}
              </p>
            </div>
          </div>

          {shown.length === 0 ? (
            <p className="text-sm" style={{ color: MUTED }}>No requests yet.</p>
          ) : (
            <div className="space-y-2">
              {shown.map((r) => {
                const [label, cls] = requestState(r)
                const canAnswer = r.status === 'success'
                return (
                  <details key={r.id} className="bg-white rounded-xl" style={cardStyle} open={canAnswer && !r.responded_at}>
                    <summary className="list-none cursor-pointer p-3 sm:p-4 flex flex-wrap items-center gap-x-4 gap-y-1">
                      <span className="flex-1 min-w-[10rem] text-sm font-semibold" style={{ color: 'var(--brand-dark)' }}>
                        {r.request_type}
                        <span className="font-normal" style={{ color: MUTED }}> · {r.name}</span>
                      </span>
                      <span className="text-sm font-bold text-brand-dark">{formatMoney(r.amount_minor / 100, r.currency)}</span>
                      <span className="text-xs" style={{ color: MUTED }}>{dateFmt.format(new Date(r.paid_at || r.created_at))}</span>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${cls}`}>{label}</span>
                    </summary>
                    <div className="px-4 pb-4">
                      <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-1 text-sm mb-3">
                        <Row label="Phone">
                          <a href={`tel:${r.phone.replace(/\s/g, '')}`} className="font-semibold text-brand-main underline">
                            {r.phone}
                          </a>
                        </Row>
                        <Row label="Email">
                          <a href={`mailto:${r.email}`} className="font-semibold text-brand-main underline">{r.email}</a>
                        </Row>
                        <Row label="Country">{r.country}</Row>
                        {r.channel && <Row label="Paid with">{CHANNELS[r.channel] || r.channel}</Row>}
                        <Row label="Reference">{r.reference}</Row>
                        {r.responded_at && <Row label="Marked answered">{dateFmt.format(new Date(r.responded_at))}</Row>}
                        <div className="sm:col-span-2 mt-1 p-3 rounded-lg bg-brand-pale">
                          <dt className="text-xs font-bold text-brand-dark mb-0.5">Anticipated date</dt>
                          <dd className="font-semibold">{formatAnticipated(r.preferred_date)}</dd>
                        </div>
                      </dl>
                      {canAnswer && (
                        <form action={setInsightResponded}>
                          <input type="hidden" name="id" value={r.id} />
                          <input type="hidden" name="responded" value={r.responded_at ? '0' : '1'} />
                          {r.responded_at ? (
                            <button type="submit" className="text-xs font-semibold underline" style={{ color: MUTED }}>
                              Undo: move back to &ldquo;To answer&rdquo;
                            </button>
                          ) : (
                            <button type="submit" className="btn-primary text-sm px-5 py-2">
                              Mark as answered
                            </button>
                          )}
                        </form>
                      )}
                    </div>
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
