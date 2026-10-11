'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { requestBooking, type BookingState } from './actions'
import { EVENT_TYPES } from './event-types'

const inputClass =
  'w-full h-10 px-3.5 rounded-lg border-2 bg-white text-ink text-[15px] outline-none transition-colors focus:border-brand-main'

function Label({ children, optional }: { children: React.ReactNode; optional?: boolean }) {
  return (
    <span className="block text-xs font-semibold text-ink-muted mb-1">
      {children} {optional && <span className="font-normal text-ink-soft">(optional)</span>}
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
      className="w-full h-11 px-8 rounded-full font-bold text-lg bg-gradient-to-b from-gold-light to-gold text-brand-dark shadow-md hover:brightness-105 hover:shadow-lg transition-all disabled:opacity-70"
    >
      {pending ? 'Sending…' : 'Send'}
    </button>
  )
}

export default function BookingForm() {
  const [state, formAction] = useFormState<BookingState, FormData>(requestBooking, {})
  const f = state.fields || {}
  const border = (err?: string) => (err ? 'border-red-400' : 'border-brand-main/20')

  if (state.sent) {
    return (
      <div role="status" className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 text-center">
        <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-brand-pale flex items-center justify-center text-brand-main">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h2 className="font-heading text-2xl font-extrabold text-brand-dark mb-2">Request sent</h2>
        <p className="text-ink-muted">
          Thank you for your invitation. We&apos;ve emailed you a copy, and our team will be in touch soon.
        </p>
      </div>
    )
  }

  return (
    <form action={formAction} noValidate className="bg-white rounded-2xl shadow-lg p-5">
      {/* Spam trap: hidden from people, filled in by bots. */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-3">
        <label className="block">
          <Label>Your name</Label>
          <input name="name" autoComplete="name" aria-invalid={!!f.name} className={`${inputClass} ${border(f.name)}`} />
          <FieldError msg={f.name} />
        </label>
        <label className="block">
          <Label>Church / organisation</Label>
          <input
            name="organisation"
            autoComplete="organization"
            aria-invalid={!!f.organisation}
            className={`${inputClass} ${border(f.organisation)}`}
          />
          <FieldError msg={f.organisation} />
        </label>
        <label className="block">
          <Label>Email</Label>
          <input
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            aria-invalid={!!f.email}
            className={`${inputClass} ${border(f.email)}`}
          />
          <FieldError msg={f.email} />
        </label>
        <label className="block">
          <Label>Phone</Label>
          <input
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="024 000 0000"
            aria-invalid={!!f.phone}
            className={`${inputClass} ${border(f.phone)}`}
          />
          <FieldError msg={f.phone} />
        </label>
        <label className="block">
          <Label>Type of event</Label>
          <select name="event_type" defaultValue="" aria-invalid={!!f.event_type} className={`${inputClass} ${border(f.event_type)}`}>
            <option value="" disabled>Choose one</option>
            {EVENT_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          <FieldError msg={f.event_type} />
        </label>
        <label className="block">
          <Label>Event name</Label>
          <input
            name="event_name"
            placeholder="e.g. Annual Youth Conference"
            aria-invalid={!!f.event_name}
            className={`${inputClass} ${border(f.event_name)}`}
          />
          <FieldError msg={f.event_name} />
        </label>
        <label className="block">
          <Label>Event date</Label>
          <input name="event_date" type="date" aria-invalid={!!f.event_date} className={`${inputClass} ${border(f.event_date)}`} />
          <FieldError msg={f.event_date} />
        </label>
        <label className="block lg:col-span-2">
          <Label>Location</Label>
          <input
            name="location"
            placeholder="Venue, town / city, country"
            aria-invalid={!!f.location}
            className={`${inputClass} ${border(f.location)}`}
          />
          <FieldError msg={f.location} />
        </label>
        <label className="block sm:col-span-2">
          <Label optional>Anything else we should know</Label>
          <textarea
            name="details"
            rows={2}
            maxLength={2000}
            placeholder="Theme, number of sessions, travel and accommodation arrangements…"
            className={`${inputClass} h-auto py-2 resize-none border-brand-main/20`}
          />
        </label>
        {/* Send button sits beside the details box on wide screens, to keep the page to one screen. */}
        <div className="sm:col-span-2 lg:col-span-1 flex flex-col justify-end gap-2">
          {state.error ? (
            <p role="alert" className="text-sm text-red-700 font-semibold">{state.error}</p>
          ) : (
            <p className="text-xs text-ink-muted">We&apos;ll reply by email or phone to confirm availability.</p>
          )}
          <SubmitButton />
        </div>
      </div>
    </form>
  )
}
