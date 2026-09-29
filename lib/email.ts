// Sending email through Resend (https://resend.com). Server only.
//
// Settings (.env.local and the hosting dashboard):
//   RESEND_API_KEY   – from Resend → API Keys
//   EMAIL_FROM       – e.g. "Gideon Peprah Ministries <no-reply@yourdomain.org>"; the domain
//                      must be verified in Resend → Domains
//   PROPHET_EMAIL    – who is told about new orders and gifts (several: separate with commas)
//   EMAIL_REPLY_TO   – optional: where replies to buyer/donor emails go
//   SITE_URL         – optional: e.g. https://gideonpeprahministries.org, for links in emails
//
// Without RESEND_API_KEY no emails are sent; the rest of the site works as normal.

export const isEmailConfigured = () => !!process.env.RESEND_API_KEY

/** Addresses that are told about new orders and gifts. */
export const prophetEmails = () =>
  (process.env.PROPHET_EMAIL || '')
    .split(',')
    .map((e) => e.trim())
    .filter(Boolean)

export const siteUrl = () => (process.env.SITE_URL || '').replace(/\/+$/, '')

/** Send one email. Returns true on success; never throws. */
export async function sendEmail(msg: { to: string | string[]; subject: string; html: string; replyTo?: string }) {
  const key = process.env.RESEND_API_KEY
  if (!key) return false
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || 'Gideon Peprah Ministries <onboarding@resend.dev>',
        to: msg.to,
        subject: msg.subject,
        html: msg.html,
        ...(msg.replyTo ? { reply_to: msg.replyTo } : {}),
      }),
      cache: 'no-store',
    })
    if (!res.ok) {
      console.error('Email not sent:', res.status, await res.text().catch(() => ''))
      return false
    }
    return true
  } catch (e) {
    console.error('Email not sent:', e)
    return false
  }
}

// ── Layout ───────────────────────────────────────────────────

const BRAND = '#0e5a45'
const BRAND_DARK = '#072e24'
const MUTED = '#66736d'

/** Make user-entered text safe to put in an email. */
export function esc(value: unknown) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/** Label / value table rows; empty values are skipped. Values must already be escaped. */
export function detailRows(rows: [string, string | null | undefined][]) {
  return rows
    .filter(([, v]) => v)
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:8px 12px 8px 0;color:${MUTED};font-size:14px;vertical-align:top;white-space:nowrap">${label}</td>
          <td style="padding:8px 0;color:${BRAND_DARK};font-size:14px;font-weight:600">${value}</td>
        </tr>`
    )
    .join('')
}

/** Wrap the body in the ministry's simple email layout. */
export function emailLayout({ heading, intro, body = '', footer = '' }: { heading: string; intro: string; body?: string; footer?: string }) {
  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f4f6f5;font-family:Arial,Helvetica,sans-serif">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f5;padding:24px 12px">
      <tr><td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:12px;overflow:hidden">
          <tr><td style="background:${BRAND_DARK};padding:20px 28px">
            <div style="color:#ffffff;font-size:20px;font-weight:800">Gideon Peprah Ministries</div>
            <div style="color:#e8c35a;font-size:11px;letter-spacing:3px;text-transform:uppercase;margin-top:4px">Interpreting Destinies</div>
          </td></tr>
          <tr><td style="padding:28px">
            <h1 style="margin:0 0 12px;color:${BRAND};font-size:22px">${heading}</h1>
            <p style="margin:0 0 20px;color:#333;font-size:15px;line-height:1.6">${intro}</p>
            ${body}
            ${footer ? `<p style="margin:24px 0 0;color:${MUTED};font-size:13px;line-height:1.6">${footer}</p>` : ''}
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`
}

export const detailTable = (rows: string) =>
  `<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-top:1px solid #e5ebe8;border-bottom:1px solid #e5ebe8;margin:4px 0">${rows}</table>`
