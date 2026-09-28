'use client'

import { useState } from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import { startDonation, type GiveState } from './actions'
import {
  CURRENCIES,
  CURRENCY_CODES,
  DEFAULT_CURRENCY,
  GIVING_TYPES,
  amountRange,
  chargeCurrency,
  convert,
  formatMoney,
  givingTypeLabel,
  parseAmount,
  type CurrencyCode,
} from '@/lib/giving'

const inputClass =
  'w-full h-10 px-3.5 rounded-lg border-2 bg-white text-ink text-[15px] outline-none transition-colors focus:border-brand-main'

/** One column of the form: numbered heading + content. */
function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <fieldset className="min-w-0">
      <legend className="flex items-center gap-2.5 mb-3">
        <span className="w-6 h-6 rounded-full bg-brand-main text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
          {n}
        </span>
        <span className="font-heading text-base font-bold text-brand-dark">{title}</span>
      </legend>
      {children}
    </fieldset>
  )
}

function FieldError({ msg }: { msg?: string }) {
  return msg ? <p className="mt-1 text-xs text-red-700">{msg}</p> : null
}

function Label({ children }: { children: React.ReactNode }) {
  return <span className="block text-xs font-semibold text-ink-muted mb-1">{children}</span>
}

function SubmitButton({ label }: { label: string | null }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full sm:w-auto sm:min-w-[220px] flex items-center justify-center gap-2 h-12 px-8 rounded-full font-bold text-lg bg-gradient-to-b from-gold-light to-gold text-brand-dark shadow-md hover:brightness-105 hover:shadow-lg transition-all disabled:opacity-70"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
      </svg>
      {pending ? 'Opening checkout…' : label ? `Give ${label}` : 'Give'}
    </button>
  )
}

const PAY_OPTIONS = ['MTN MoMo', 'Telecel Cash', 'AirtelTigo', 'Visa', 'Mastercard']

export default function GiveForm({
  testMode,
  header,
  footer,
  chargeable,
  ratesPerUsd,
}: {
  testMode: boolean
  /** Page title, shown left of the currency bar. */
  header?: React.ReactNode
  footer?: React.ReactNode
  /** Currencies the Paystack account can charge directly. */
  chargeable: string[]
  /** Today's exchange rates per 1 USD, or null if unavailable. */
  ratesPerUsd: Record<string, number> | null
}) {
  const [state, formAction] = useFormState<GiveState, FormData>(startDonation, {})
  const [currency, setCurrency] = useState<CurrencyCode>(DEFAULT_CURRENCY)
  const [preset, setPreset] = useState<number | null>(CURRENCIES[DEFAULT_CURRENCY].presets[2])
  const [custom, setCustom] = useState('')
  const [givingType, setGivingType] = useState<string>(GIVING_TYPES[0].id)

  // The custom box wins when something is typed in it.
  const amountText = custom.trim() ? custom : preset ? String(preset) : ''
  const amount = parseAmount(amountText, currency)
  const cur = CURRENCIES[currency]

  // Currencies Paystack can't charge are converted; without rates they can't be offered.
  const charge = chargeCurrency(currency, chargeable)
  const canUse = (c: CurrencyCode) => chargeable.includes(c) || !!ratesPerUsd
  const charged = amount && charge !== currency && ratesPerUsd ? convert(amount, currency, charge, ratesPerUsd) : null
  const chargeNote = charged ? `≈ ${formatMoney(charged, charge)}` : null

  const pickCurrency = (c: CurrencyCode) => {
    setCurrency(c)
    setPreset(CURRENCIES[c].presets[2])
    setCustom('')
  }
  const f = state.fields || {}
  const border = (err?: string) => (err ? 'border-red-400' : 'border-brand-main/20')

  return (
    <form action={formAction} noValidate>
      <input type="hidden" name="amount" value={amountText} />
      <input type="hidden" name="currency" value={currency} />

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-3 lg:mb-4">
        <div className="min-w-0">{header}</div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
          <span id="currency-label" className="text-sm font-bold text-brand-dark">
            Give in:
          </span>
          <div
            role="radiogroup"
            aria-labelledby="currency-label"
            className="grid grid-cols-5 gap-1 p-1 rounded-xl bg-white border-2 border-brand-main/20 shadow-sm"
          >
            {CURRENCY_CODES.map((c) => (
              <button
                key={c}
                type="button"
                role="radio"
                aria-checked={currency === c}
                disabled={!canUse(c)}
                title={canUse(c) ? CURRENCIES[c].name : `${CURRENCIES[c].name} is unavailable right now`}
                onClick={() => pickCurrency(c)}
                className={`px-2 sm:px-3 py-1 rounded-lg leading-tight transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                  currency === c ? 'bg-brand-main text-white shadow' : 'text-brand-dark hover:bg-brand-pale'
                }`}
              >
                <span className="block text-sm font-extrabold">{CURRENCIES[c].short}</span>
                <span className={`block text-[10px] font-semibold ${currency === c ? 'text-white/85' : 'text-ink-soft'}`}>
                  {CURRENCIES[c].label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-5">
      {testMode && (
        <p className="text-xs px-3 py-2 mb-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-800">
          <strong>Test mode:</strong> payments are simulated; no real money is charged.
        </p>
      )}

      <div className="grid gap-7 lg:gap-0 lg:grid-cols-3 lg:divide-x lg:divide-brand-main/10">
        {/* 1 · Amount */}
        <div className="lg:pr-7">
          <Step n={1} title="Amount">
            <div className="grid grid-cols-3 gap-2" role="group" aria-label="Choose an amount">
              {cur.presets.map((a) => {
                const selected = !custom.trim() && preset === a
                return (
                  <button
                    key={a}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => {
                      setPreset(a)
                      setCustom('')
                    }}
                    className={`h-11 rounded-lg font-bold border-2 transition-all ${
                      selected
                        ? 'bg-brand-main border-brand-main text-white shadow'
                        : 'bg-white border-brand-main/20 text-brand-dark hover:border-brand-main'
                    }`}
                  >
                    {formatMoney(a, currency)}
                  </button>
                )
              })}
            </div>
            <label className="block mt-3">
              <Label>Or another amount</Label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-brand-dark">{cur.symbol}</span>
                <input
                  inputMode="decimal"
                  autoComplete="off"
                  placeholder={`e.g. ${(cur.presets[1] * 3).toLocaleString('en-GB')}`}
                  value={custom}
                  onChange={(e) => setCustom(e.target.value)}
                  aria-invalid={!!f.amount}
                  className={`${inputClass} pl-8 font-semibold ${border(f.amount)}`}
                />
              </div>
              {custom.trim() && amount === null && !f.amount && (
                <p className="mt-1 text-xs text-ink-soft">Between {amountRange(currency)}.</p>
              )}
              <FieldError msg={f.amount} />
            </label>
          </Step>
        </div>

        {/* 2 · Purpose */}
        <div className="lg:px-7">
          <Step n={2} title="Purpose">
            <div className="grid grid-cols-2 gap-2">
              {GIVING_TYPES.map((t) => (
                <label key={t.id} className="cursor-pointer" title={t.hint}>
                  <input
                    type="radio"
                    name="giving_type"
                    value={t.id}
                    checked={givingType === t.id}
                    onChange={() => setGivingType(t.id)}
                    className="peer sr-only"
                  />
                  <span className="flex items-center justify-center min-h-10 px-2 py-1.5 rounded-lg border-2 border-brand-main/20 bg-white font-bold text-sm leading-tight text-center text-brand-dark transition-all peer-checked:border-brand-main peer-checked:bg-brand-main peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-brand-main/40 hover:border-brand-main">
                    {/* Two-line labels ("Partnership/ Donation") so both tabs match. */}
                    <span>
                      {t.label.split('/').map((part, k, all) => (
                        <span key={part} className="block">
                          {part}
                          {k < all.length - 1 && '/'}
                        </span>
                      ))}
                    </span>
                  </span>
                </label>
              ))}
            </div>
            <label className="block mt-3">
              <Label>
                Prayer request or note <span className="font-normal text-ink-soft">(optional)</span>
              </Label>
              <textarea
                name="message"
                rows={2}
                maxLength={500}
                placeholder="Share a prayer request or note with the ministry"
                className={`${inputClass} h-auto py-2 border-brand-main/20 resize-none`}
              />
            </label>
          </Step>
        </div>

        {/* 3 · Details */}
        <div className="lg:pl-7">
          <Step n={3} title="Your details">
            <div className="space-y-2.5">
              <label className="block">
                <Label>Name</Label>
                <input name="name" autoComplete="name" className={`${inputClass} ${border(f.name)}`} aria-invalid={!!f.name} />
                <FieldError msg={f.name} />
              </label>
              <div className="grid grid-cols-2 gap-2.5">
              <label className="block">
                <Label>Email (for receipt)</Label>
                <input
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  className={`${inputClass} ${border(f.email)}`}
                  aria-invalid={!!f.email}
                />
                <FieldError msg={f.email} />
              </label>
              <label className="block">
                <Label>
                  Phone <span className="font-normal text-ink-soft">(optional)</span>
                </Label>
                <input
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="024 000 0000"
                  className={`${inputClass} ${border(f.phone)}`}
                  aria-invalid={!!f.phone}
                />
                <FieldError msg={f.phone} />
              </label>
              </div>
            </div>
          </Step>
        </div>
      </div>

      {/* Summary + Give */}
      <div className="mt-4 pt-3.5 border-t border-brand-main/10 flex flex-col-reverse sm:flex-row sm:items-center gap-4">
        <div className="flex-1 min-w-0">
          {state.error ? (
            <p role="alert" className="text-sm text-red-700 font-semibold">{state.error}</p>
          ) : (
            <p className="text-sm text-ink-muted">
              {amount ? (
                <>
                  Giving <strong className="text-brand-dark">{formatMoney(amount, currency)}</strong> as{' '}
                  <strong className="text-brand-dark">{givingTypeLabel(givingType)}</strong>
                  {chargeNote && (
                    <span className="text-ink-soft">
                      {' '}· charged {chargeNote} at today&apos;s rate <span className="text-xs">(your bank may add a small fee)</span>
                    </span>
                  )}
                </>
              ) : (
                'Choose an amount to give'
              )}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
            <span className="text-[11px] text-ink-soft mr-0.5">Secure checkout by Paystack:</span>
            {PAY_OPTIONS.map((o) => (
              <span key={o} className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-brand-pale text-brand-dark">
                {o}
              </span>
            ))}
            {footer && <span className="w-full lg:w-auto lg:ml-3 text-xs text-ink-muted flex flex-wrap gap-x-3">{footer}</span>}
          </div>
        </div>
        <SubmitButton label={amount ? formatMoney(amount, currency) : null} />
      </div>
      </div>
    </form>
  )
}
