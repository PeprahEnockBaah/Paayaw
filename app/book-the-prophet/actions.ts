'use server'

import { detailRows, detailTable, emailLayout, esc, isEmailConfigured, prophetEmails, sendEmail } from '@/lib/email'
import { contactFallback } from '@/lib/contact-info'
import { EVENT_TYPES } from './event-types'

type Field = 'name' | 'organisation' | 'email' | 'phone' | 'event_type' | 'event_name' | 'event_date' | 'location'

export type BookingState = {
  sent?: boolean
  error?: string
  fields?: Partial<Record<Field, string>>
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export async function requestBooking(_prev: BookingState, formData: FormData): Promise<BookingState> {
  const get = (k: string, max = 200) => String(formData.get(k) || '').trim().slice(0, max)

  // Hidden field that people never see; bots that fill it in are quietly ignored.
  if (get('website')) return { sent: true }

  const name = get('name')
  const organisation = get('organisation')
  const email = get('email').toLowerCase()
  const phone = get('phone', 30)
  const eventType = get('event_type')
  const eventName = get('event_name')
  const eventDate = get('event_date', 10)
  const location = get('location')
  const details = get('details', 2000)

  const fields: BookingState['fields'] = {}
  if (name.length < 2) fields.name = 'Please enter your name.'
  if (organisation.length < 2) fields.organisation = 'Please enter your church or organisation.'
  if (!EMAIL_RE.test(email)) fields.email = 'Please enter a valid email so we can reply.'
  if (!/^\+?[\d\s-]{9,16}$/.test(phone)) fields.phone = 'Please enter a phone number we can reach you on.'
  if (!(EVENT_TYPES as readonly string[]).includes(eventType)) fields.event_type = 'Please choose the type of event.'
  if (eventName.length < 2) fields.event_name = 'Please enter the name of the event.'
  const today = new Date().toISOString().slice(0, 10)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(eventDate)) fields.event_date = 'Please choose the event date.'
  else if (eventDate < today) fields.event_date = 'The event date has already passed.'
  if (location.length < 2) fields.location = 'Please enter where the event will be held.'
  if (Object.keys(fields).length) return { error: 'Please check the highlighted fields.', fields }

  const to = prophetEmails()
  if (!isEmailConfigured() || !to.length) {
    return { error: `Online booking requests are being set up. ${await contactFallback()}` }
  }

  const prettyDate = new Date(`${eventDate}T12:00:00Z`).toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
  })
  const rows = detailTable(
    detailRows([
      ['Name', esc(name)],
      ['Church / organisation', esc(organisation)],
      ['Email', esc(email)],
      ['Phone', esc(phone)],
      ['Type of event', esc(eventType)],
      ['Event name', esc(eventName)],
      ['Date', esc(prettyDate)],
      ['Location', esc(location)],
      ['Details', esc(details).replace(/\n/g, '<br>')],
    ])
  )

  const sent = await sendEmail({
    to,
    replyTo: email,
    subject: `Booking request: ${eventType} on ${prettyDate}`,
    html: emailLayout({
      heading: 'New booking request',
      intro: `${esc(name)} would like to invite Prophet Gideon Peprah to minister. Reply to this email to answer them directly.`,
      body: rows,
    }),
  })
  if (!sent) return { error: `Sorry, your request could not be sent just now. ${await contactFallback()}` }

  // Confirmation to the person who asked (best effort).
  await sendEmail({
    to: email,
    replyTo: process.env.EMAIL_REPLY_TO || undefined,
    subject: 'We received your booking request',
    html: emailLayout({
      heading: 'Thank you for your invitation',
      intro: `Dear ${esc(name)}, we have received your request for Prophet Gideon Peprah to minister at your event. Our team will be in touch with you soon.`,
      body: rows,
      footer: 'If anything changes, simply reply to this email.',
    }),
  })

  return { sent: true }
}
