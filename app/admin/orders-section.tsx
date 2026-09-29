import { getRecentOrders, type BookOrder } from '@/lib/orders'
import { formatMoney } from '@/lib/giving'
import { setOrderFulfilled } from './actions'
import { MUTED, NotSetUp, SectionHeader, cardStyle } from './admin-ui'

const CHANNELS: Record<string, string> = { mobile_money: 'MoMo', card: 'Card', bank: 'Bank', bank_transfer: 'Bank transfer' }

const dateFmt = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })

/** Where an order stands, from the admin's point of view. */
function orderState(o: BookOrder): [string, string] {
  if (['ongoing', 'processing', 'queued'].includes(o.status)) return ['Payment processing', 'bg-amber-50 text-amber-700']
  if (o.status === 'reversed') return ['Refunded', 'bg-red-50 text-red-700']
  if (o.status !== 'success') return ['Not paid', 'bg-gray-100 text-gray-600']
  return o.fulfilled_at
    ? [o.fulfilment === 'pickup' ? 'Collected' : 'Sent', 'bg-green-50 text-green-700']
    : [o.fulfilment === 'pickup' ? 'To collect' : 'To send', 'bg-amber-100 text-amber-900']
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="inline" style={{ color: MUTED }}>{label}: </dt>
      <dd className="inline break-words">{children}</dd>
    </div>
  )
}

export default async function OrdersSection() {
  const orders = await getRecentOrders(100)
  const paid = (orders || []).filter((o) => o.status === 'success')
  const toSend = paid.filter((o) => !o.fulfilled_at)
  // Unpaid orders are only clutter here (e.g. the buyer closed checkout); Paystack has the full record.
  const shown = (orders || []).filter((o) => o.status !== 'pending' && o.status !== 'abandoned')

  return (
    <div>
      <SectionHeader
        id="orders"
        title="Book Orders"
        hint="Paid orders from the Order page (latest 100). Call the buyer, send or hand over the book, then mark it done."
      />

      {orders === null ? (
        <NotSetUp what="Book orders" />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="bg-white rounded-xl p-4" style={cardStyle}>
              <p className="text-xs" style={{ color: MUTED }}>Waiting to send / collect</p>
              <p className="font-heading text-2xl font-extrabold text-brand-dark">{toSend.length}</p>
            </div>
            <div className="bg-white rounded-xl p-4" style={cardStyle}>
              <p className="text-xs" style={{ color: MUTED }}>Paid orders (shown below)</p>
              <p className="font-heading text-2xl font-extrabold text-brand-dark">
                {formatMoney(paid.reduce((sum, o) => sum + o.amount_minor, 0) / 100, 'GHS')}
              </p>
              <p className="text-xs" style={{ color: MUTED }}>
                {paid.length} {paid.length === 1 ? 'order' : 'orders'}
              </p>
            </div>
          </div>

          {shown.length === 0 ? (
            <p className="text-sm" style={{ color: MUTED }}>No orders yet.</p>
          ) : (
            <div className="space-y-2">
              {shown.map((o) => {
                const [label, cls] = orderState(o)
                const canFulfil = o.status === 'success'
                return (
                  <details key={o.id} className="bg-white rounded-xl" style={cardStyle} open={canFulfil && !o.fulfilled_at}>
                    <summary className="list-none cursor-pointer p-3 sm:p-4 flex flex-wrap items-center gap-x-4 gap-y-1">
                      <span className="flex-1 min-w-[10rem] text-sm font-semibold" style={{ color: 'var(--brand-dark)' }}>
                        {o.book_title} × {o.quantity}
                        <span className="font-normal" style={{ color: MUTED }}> · {o.name}</span>
                      </span>
                      <span className="text-sm font-bold text-brand-dark">{formatMoney(o.amount_minor / 100, o.currency)}</span>
                      <span className="text-xs" style={{ color: MUTED }}>{dateFmt.format(new Date(o.paid_at || o.created_at))}</span>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${cls}`}>{label}</span>
                    </summary>
                    <div className="px-4 pb-4">
                      <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-1 text-sm mb-3">
                        <Row label="Phone">
                          <a href={`tel:${o.phone.replace(/\s/g, '')}`} className="font-semibold text-brand-main underline">
                            {o.phone}
                          </a>
                        </Row>
                        <Row label="Email">{o.email}</Row>
                        <Row label={o.fulfilment === 'pickup' ? 'Pickup' : 'Deliver to'}>
                          {o.fulfilment === 'pickup' ? 'Will collect at GPM HQ' : o.address}
                        </Row>
                        {o.channel && <Row label="Paid with">{CHANNELS[o.channel] || o.channel}</Row>}
                        <Row label="Reference">{o.reference}</Row>
                        {o.fulfilled_at && <Row label="Marked done">{dateFmt.format(new Date(o.fulfilled_at))}</Row>}
                        {o.note && (
                          <div className="sm:col-span-2 mt-1 p-3 rounded-lg bg-brand-pale">
                            <dt className="text-xs font-bold text-brand-dark mb-0.5">Buyer&apos;s note</dt>
                            <dd className="whitespace-pre-line">{o.note}</dd>
                          </div>
                        )}
                      </dl>
                      {canFulfil && (
                        <form action={setOrderFulfilled}>
                          <input type="hidden" name="id" value={o.id} />
                          <input type="hidden" name="fulfilled" value={o.fulfilled_at ? '0' : '1'} />
                          {o.fulfilled_at ? (
                            <button type="submit" className="text-xs font-semibold underline" style={{ color: MUTED }}>
                              Undo: move back to &ldquo;{o.fulfilment === 'pickup' ? 'To collect' : 'To send'}&rdquo;
                            </button>
                          ) : (
                            <button type="submit" className="btn-primary text-sm px-5 py-2">
                              Mark as {o.fulfilment === 'pickup' ? 'collected' : 'sent'}
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
