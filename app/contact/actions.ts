'use server'

import { detailRows, detailTable, emailLayout, esc, isEmailConfigured, prophetEmails, sendEmail } from '@/lib/email'
import { contactFallback } from '@/lib/contact-info'
import { SUBJECTS } from './subjects'

type Field = 'first_name' | 'email' | 'subject' | 'message'

export type ContactState = {
  sent?: boolean
  error?: string
  fields?: Partial<Record<Field, string>>
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/** Where contact messages go: CONTACT_EMAIL if set, otherwise the Prophet's address(es). */
const contactEmails = () => {
  const list = (process.env.CONTACT_EMAIL || '').split(',').map((e) => e.trim()).filter(Boolean)
  return list.length ? list : prophetEmails()
}

export async function sendMessage(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const get = (k: string, max = 200) => String(formData.get(k) || '').trim().slice(0, max)

  // Hidden field that people never see; bots that fill it in are quietly ignored.
  if (get('website')) return { sent: true }

  const firstName = get('first_name', 80)
  const lastName = get('last_name', 80)
  const email = get('email').toLowerCase()
  const subject = get('subject')
  const message = get('message', 5000)

  const fields: ContactState['fields'] = {}
  if (firstName.length < 2) fields.first_name = 'Please enter your first name.'
  if (!EMAIL_RE.test(email)) fields.email = 'Please enter a valid email so we can reply.'
  if (!(SUBJECTS as readonly string[]).includes(subject)) fields.subject = 'Please choose a subject.'
  if (message.length < 5) fields.message = 'Please write your message.'
  if (Object.keys(fields).length) return { error: 'Please check the highlighted fields.', fields }

  const to = contactEmails()
  if (!isEmailConfigured() || !to.length) {
    return { error: `Our contact form is being set up. ${await contactFallback()}` }
  }

  const name = [firstName, lastName].filter(Boolean).join(' ')
  const sent = await sendEmail({
    to,
    replyTo: email,
    subject: `${subject} from ${name}`,
    html: emailLayout({
      heading: subject,
      intro: `New message from the website contact form. Reply to this email to answer ${esc(firstName)} directly.`,
      body: detailTable(
        detailRows([
          ['Name', esc(name)],
          ['Email', esc(email)],
          ['Message', esc(message).replace(/\n/g, '<br>')],
        ])
      ),
    }),
  })
  if (!sent) return { error: `Sorry, your message could not be sent just now. ${await contactFallback()}` }

  return { sent: true }
}
