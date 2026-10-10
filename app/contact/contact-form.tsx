'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { sendMessage, type ContactState } from './actions'
import { SUBJECTS } from './subjects'

const fieldClass = 'w-full px-4 py-2.5 rounded-lg text-sm outline-none transition-shadow focus:ring-2 focus:ring-gold'

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="block text-xs font-bold tracking-wide uppercase mb-1.5" style={{ color: 'var(--brand-dark)' }}>
      {children}
    </span>
  )
}

function FieldError({ msg }: { msg?: string }) {
  return msg ? <p className="mt-1 text-xs text-red-700">{msg}</p> : null
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full py-2.5 rounded-full font-bold text-sm transition-all hover:opacity-90 hover:-translate-y-0.5 disabled:opacity-70 disabled:translate-y-0"
      style={{ background: 'var(--brand-dark)', color: '#fff' }}
    >
      {pending ? 'Sending…' : 'Send Message'}
    </button>
  )
}

export default function ContactForm() {
  const [state, formAction] = useFormState<ContactState, FormData>(sendMessage, {})
  const f = state.fields || {}
  const style = (err?: string) => ({
    border: `1px solid ${err ? '#f87171' : 'rgba(14,90,69,0.2)'}`,
    background: 'var(--paper)',
  })

  if (state.sent) {
    return (
      <div role="status" className="text-center py-8">
        <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-brand-pale flex items-center justify-center text-brand-main">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h4 className="font-heading text-xl font-bold mb-2 text-brand-dark">Message sent</h4>
        <p className="text-sm text-ink-muted">Thank you for reaching out. We&apos;ll get back to you soon.</p>
      </div>
    )
  }

  return (
    <form action={formAction} noValidate className="space-y-3">
      {/* Spam trap: hidden from people, filled in by bots. */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
        <label className="block">
          <Label>First Name</Label>
          <input name="first_name" autoComplete="given-name" placeholder="John" aria-invalid={!!f.first_name} className={fieldClass} style={style(f.first_name)} />
          <FieldError msg={f.first_name} />
        </label>
        <label className="block">
          <Label>Last Name</Label>
          <input name="last_name" autoComplete="family-name" placeholder="Mensah" className={fieldClass} style={style()} />
        </label>
        <label className="block">
          <Label>Email</Label>
          <input
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="john@example.com"
            aria-invalid={!!f.email}
            className={fieldClass}
            style={style(f.email)}
          />
          <FieldError msg={f.email} />
        </label>
        <label className="block">
          <Label>Subject</Label>
          <select name="subject" defaultValue="" aria-invalid={!!f.subject} className={fieldClass} style={{ ...style(f.subject), color: '#4f5d57' }}>
            <option value="" disabled>Select a subject</option>
            {SUBJECTS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <FieldError msg={f.subject} />
        </label>
      </div>
      <label className="block">
        <Label>Message</Label>
        <textarea
          name="message"
          rows={2}
          maxLength={5000}
          placeholder="Your message here..."
          aria-invalid={!!f.message}
          className={`${fieldClass} resize-none`}
          style={style(f.message)}
        />
        <FieldError msg={f.message} />
      </label>
      {state.error && <p role="alert" className="text-sm text-red-700 font-semibold">{state.error}</p>}
      <SubmitButton />
    </form>
  )
}
