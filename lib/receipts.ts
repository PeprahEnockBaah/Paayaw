// Emails sent once a payment is confirmed: a receipt to the buyer / donor and a
// notice to the Prophet. Server only.
import { supabaseAdmin } from './supabase'
import { detailRows, detailTable, emailLayout, esc, isEmailConfigured, prophetEmails, sendEmail, siteUrl } from './email'
import { formatMoney, givingTypeLabel } from './giving'
import { PICKUP_LOCATION } from './order-settings'
import type { BookOrder } from './orders'
import type { Donation } from './donations'

const money = (minor: number, currency: string) => esc(formatMoney(minor / 100, currency))
const nl2br = (text: string) => esc(text).replace(/\n/g, '<br>')

/**
 * Mark a paid row as emailed and return it, or null if it was already emailed (or isn't paid).
 * Doing this in one update means the webhook and thank-you page can't both send.
 */
async function claim<T>(table: 'book_orders' | 'donations', reference: string): Promise<T | null> {
  const { data, error } = await supabaseAdmin()
    .from(table)
    .update({ emailed_at: new Date().toISOString() })
    .eq('reference', reference)
    .eq('status', 'success')
    .is('emailed_at', null)
    .select('*')
  if (error) {
    console.error(`Emails skipped for ${reference}: could not mark ${table} as emailed (has the emailed_at column been added?)`, error.message)
    return null
  }
  return (data?.[0] as T) ?? null
}

/** Let a later confirmation try again if nothing could be sent. */
async function unclaim(table: 'book_orders' | 'donations', reference: string) {
  await supabaseAdmin().from(table).update({ emailed_at: null }).eq('reference', reference)
}

async function sendAll(table: 'book_orders' | 'donations', reference: string, sends: Promise<boolean>[]) {
  const results = await Promise.all(sends)
  if (!results.some(Boolean)) await unclaim(table, reference)
}

// ── Book orders ──────────────────────────────────────────────

export async function sendOrderEmails(reference: string) {
  if (!isEmailConfigured()) return
  try {
    const o = await claim<BookOrder>('book_orders', reference)
    if (!o) return

    const pickup = o.fulfilment === 'pickup'
    const rows = detailRows([
      ['Book', esc(o.book_title)],
      ['Copies', String(o.quantity)],
      ['Delivery fee', o.delivery_fee_minor ? money(o.delivery_fee_minor, o.currency) : null],
      ['Total paid', money(o.amount_minor, o.currency)],
      ['Reference', esc(o.reference)],
    ])
    const fulfilRows = detailRows([
      ['Name', esc(o.name)],
      ['Phone', esc(o.phone)],
      ['Email', esc(o.email)],
      [pickup ? 'Pickup at' : 'Deliver to', pickup ? esc(PICKUP_LOCATION) : nl2br(o.address || '')],
      ['Note', o.note ? nl2br(o.note) : null],
    ])

    const toBuyer = sendEmail({
      to: o.email,
      subject: `Your order: ${o.book_title}`,
      replyTo: process.env.EMAIL_REPLY_TO || undefined,
      html: emailLayout({
        heading: 'Thank you for your order!',
        intro: `Dear ${esc(o.name)}, we’ve received your payment for <strong>${esc(o.book_title)}</strong>. ${
          pickup
            ? `Your copy will be ready for collection at ${esc(PICKUP_LOCATION)}. We’ll contact you on ${esc(o.phone)} when it’s ready.`
            : `We’ll contact you on ${esc(o.phone)} to arrange delivery.`
        }`,
        body: detailTable(rows + fulfilRows),
        footer: 'God bless you. Keep this email as your receipt.',
      }),
    })

    const admin = prophetEmails()
    const adminLink = siteUrl() ? `<a href="${siteUrl()}/admin#orders" style="color:#0e5a45">Open Book Orders in the admin</a>` : ''
    const toProphet = admin.length
      ? sendEmail({
          to: admin,
          subject: `New book order: ${o.book_title} × ${o.quantity} (${formatMoney(o.amount_minor / 100, o.currency)})`,
          replyTo: o.email,
          html: emailLayout({
            heading: 'New book order',
            intro: `${esc(o.name)} has paid for ${o.quantity} ${o.quantity === 1 ? 'copy' : 'copies'} of <strong>${esc(o.book_title)}</strong> for ${
              pickup ? 'pickup' : 'delivery'
            }.`,
            body: detailTable(rows + fulfilRows),
            footer: `${adminLink}${adminLink ? '<br>' : ''}Reply to this email to contact the buyer.`,
          }),
        })
      : Promise.resolve(false)

    await sendAll('book_orders', reference, [toBuyer, toProphet])
  } catch (e) {
    console.error('Order emails failed', reference, e)
  }
}

// ── Donations ────────────────────────────────────────────────

export async function sendDonationEmails(reference: string) {
  if (!isEmailConfigured()) return
  try {
    const d = await claim<Donation>('donations', reference)
    if (!d) return

    const charged = money(d.amount_minor, d.currency)
    // Show what the donor chose too, if it was converted (e.g. EUR charged as USD).
    const chosen =
      d.donor_currency && d.donor_amount_minor && d.donor_currency !== d.currency
        ? `${money(d.donor_amount_minor, d.donor_currency)} (charged as ${charged})`
        : charged
    const kind = givingTypeLabel(d.giving_type)
    const rows = detailRows([
      ['Gift', esc(kind)],
      ['Amount', chosen],
      ['Reference', esc(d.reference)],
    ])

    const toDonor = sendEmail({
      to: d.email,
      subject: 'Thank you for your gift to Gideon Peprah Ministries',
      replyTo: process.env.EMAIL_REPLY_TO || undefined,
      html: emailLayout({
        heading: 'Thank you for your generosity!',
        intro: `Dear ${esc(d.name)}, we’ve received your ${esc(kind.toLowerCase())} gift. Your support helps us spread the Gospel and reach more lives. May the Lord bless you abundantly.`,
        body: detailTable(rows),
        footer: 'Keep this email as your receipt.',
      }),
    })

    const admin = prophetEmails()
    const adminLink = siteUrl() ? `<a href="${siteUrl()}/admin#donations" style="color:#0e5a45">Open Donations in the admin</a>` : ''
    const toProphet = admin.length
      ? sendEmail({
          to: admin,
          subject: `New gift: ${formatMoney(d.amount_minor / 100, d.currency)} from ${d.name}`,
          replyTo: d.email,
          html: emailLayout({
            heading: 'New gift received',
            intro: `${esc(d.name)} has given a ${esc(kind.toLowerCase())} gift through the website.`,
            body: detailTable(
              rows +
                detailRows([
                  ['Email', esc(d.email)],
                  ['Phone', d.phone ? esc(d.phone) : null],
                  ['Message', d.message ? nl2br(d.message) : null],
                ])
            ),
            footer: `${adminLink}${adminLink ? '<br>' : ''}Reply to this email to thank the giver.`,
          }),
        })
      : Promise.resolve(false)

    await sendAll('donations', reference, [toDonor, toProphet])
  } catch (e) {
    console.error('Donation emails failed', reference, e)
  }
}
