'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { startInsightRequest, type InsightState } from './actions'
import { CURRENCIES, type CurrencyCode } from '@/lib/giving'
import { DEFAULT_SEED_CURRENCY } from '@/lib/insight-settings'

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
      className="w-full min-h-11 py-2 px-5 rounded-full font-bold leading-tight text-base sm:text-lg lg:text-base bg-gradient-to-b from-gold-light to-gold text-brand-dark shadow-md hover:brightness-105 hover:shadow-lg transition-all disabled:opacity-70"
    >
      {pending ? 'Opening checkout…' : 'Send'}
    </button>
  )
}

export default function InsightForm({ testMode, currencies }: { testMode: boolean; currencies: CurrencyCode[] }) {
  const [state, formAction] = useFormState<InsightState, FormData>(startInsightRequest, {})
  const f = state.fields || {}
  const border = (err?: string) => (err ? 'border-red-400' : 'border-brand-main/20')
  const today = new Date().toISOString().slice(0, 10)

  return (
    <form action={formAction} noValidate className="bg-white rounded-2xl shadow-lg p-5">
      {/* Spam trap: hidden from people, filled in by bots. */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />

      {testMode && (
        <p className="mb-3 text-xs px-3 py-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-800">
          <strong>Test mode:</strong> payments are simulated; no real money is charged.
        </p>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-3">
        <label className="block">
          <Label>Your name</Label>
          <input name="name" autoComplete="name" aria-invalid={!!f.name} className={`${inputClass} ${border(f.name)}`} />
          <FieldError msg={f.name} />
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
            placeholder="+233 24 000 0000"
            aria-invalid={!!f.phone}
            className={`${inputClass} ${border(f.phone)}`}
          />
          <FieldError msg={f.phone} />
        </label>
        <label className="block">
          <Label>Country</Label>
          <input
            name="country"
            autoComplete="country-name"
            placeholder="e.g. Ghana"
            aria-invalid={!!f.country}
            className={`${inputClass} ${border(f.country)}`}
          />
          <FieldError msg={f.country} />
        </label>

        <label className="block">
          <Label>Anticipated date</Label>
          <input
            name="preferred_date"
            type="date"
            min={today}
            aria-invalid={!!f.preferred_date}
            className={`${inputClass} ${border(f.preferred_date)}`}
          />
          <FieldError msg={f.preferred_date} />
        </label>
        {/* Offering box sits right beside the send button. */}
        <label className="block">
          <Label>Prophet&apos;s offering/seed</Label>
          <div className="flex gap-1.5">
            <select
              name="currency"
              defaultValue={currencies.includes(DEFAULT_SEED_CURRENCY) ? DEFAULT_SEED_CURRENCY : currencies[0]}
              aria-label="Currency"
              className={`${inputClass} !w-auto flex-shrink-0 px-2 font-semibold border-brand-main/20`}
            >
              {currencies.map((c) => (
                <option key={c} value={c} title={CURRENCIES[c].name}>
                  {CURRENCIES[c].short}
                </option>
              ))}
            </select>
            <input
              name="amount"
              inputMode="decimal"
              required
              aria-label="Amount"
              aria-invalid={!!f.amount}
              className={`${inputClass} min-w-0 ${border(f.amount)}`}
            />
          </div>
          <FieldError msg={f.amount} />
        </label>
        <div className="flex flex-col justify-end">
          <span className="hidden sm:block text-xs mb-1" aria-hidden>&nbsp;</span>
          <SubmitButton />
        </div>

        <div className="sm:col-span-2 lg:col-span-1 flex flex-col justify-end gap-1">
          {state.error && <p role="alert" className="text-sm text-red-700 font-semibold">{state.error}</p>}
          <p className="text-xs text-ink-soft">
            Secure checkout by Paystack: Mobile Money or card. Your request is sent once your seed is received, and
            we&apos;ll confirm the date and time with you.
          </p>
        </div>
      </div>
    </form>
  )
}
