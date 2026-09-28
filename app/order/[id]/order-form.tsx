'use client'

import { useState } from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import { startOrder, type OrderState } from '../actions'
import { formatMoney } from '@/lib/giving'
import { DELIVERY_FEE_GHS, MAX_QUANTITY, PICKUP_LOCATION, type Fulfilment } from '@/lib/order-settings'

const inputClass =
  'w-full h-11 px-3.5 rounded-lg border-2 bg-white text-ink text-[15px] outline-none transition-colors focus:border-brand-main'

function Label({ children }: { children: React.ReactNode }) {
  return <span className="block text-xs font-semibold text-ink-muted mb-1">{children}</span>
}

function FieldError({ msg }: { msg?: string }) {
  return msg ? <p className="mt-1 text-xs text-red-700">{msg}</p> : null
}

function SubmitButton({ total }: { total: string }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full sm:w-auto sm:min-w-[240px] flex items-center justify-center gap-2 h-12 px-8 rounded-full font-bold text-lg bg-gradient-to-b from-gold-light to-gold text-brand-dark shadow-md hover:brightness-105 hover:shadow-lg transition-all disabled:opacity-70"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
      </svg>
      {pending ? 'Opening checkout…' : `Pay ${total}`}
    </button>
  )
}

export default function OrderForm({
  bookId,
  bookTitle,
  unitPriceMinor,
  testMode,
}: {
  bookId: string
  bookTitle: string
  unitPriceMinor: number
  testMode: boolean
}) {
  const [state, formAction] = useFormState<OrderState, FormData>(startOrder, {})
  const [quantity, setQuantity] = useState(1)
  const [fulfilment, setFulfilment] = useState<Fulfilment>('delivery')

  const f = state.fields || {}
  const border = (err?: string) => (err ? 'border-red-400' : 'border-brand-main/20')
  const deliveryFee = fulfilment === 'delivery' ? DELIVERY_FEE_GHS : 0
  const total = (unitPriceMinor * quantity) / 100 + deliveryFee
  const setQty = (n: number) => setQuantity(Math.min(MAX_QUANTITY, Math.max(1, n)))

  return (
    <form action={formAction} noValidate className="bg-white rounded-2xl shadow-lg p-5 sm:p-6 space-y-5">
      <input type="hidden" name="book_id" value={bookId} />
      <input type="hidden" name="quantity" value={quantity} />
      <input type="hidden" name="fulfilment" value={fulfilment} />

      {testMode && (
        <p className="text-xs px-3 py-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-800">
          <strong>Test mode:</strong> payments are simulated; no real money is charged.
        </p>
      )}

      {/* Quantity + how to receive */}
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <Label>Copies</Label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setQty(quantity - 1)}
              disabled={quantity <= 1}
              aria-label="One fewer copy"
              className="w-11 h-11 rounded-lg border-2 border-brand-main/20 text-xl font-bold text-brand-dark hover:border-brand-main disabled:opacity-40"
            >
              −
            </button>
            <span className="w-12 text-center font-heading text-xl font-extrabold text-brand-dark" aria-live="polite">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQty(quantity + 1)}
              disabled={quantity >= MAX_QUANTITY}
              aria-label="One more copy"
              className="w-11 h-11 rounded-lg border-2 border-brand-main/20 text-xl font-bold text-brand-dark hover:border-brand-main disabled:opacity-40"
            >
              +
            </button>
          </div>
          <FieldError msg={f.quantity} />
        </div>

        <div>
          <Label>How would you like to get it?</Label>
          <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Delivery or pickup">
            {(['delivery', 'pickup'] as const).map((opt) => (
              <button
                key={opt}
                type="button"
                role="radio"
                aria-checked={fulfilment === opt}
                onClick={() => setFulfilment(opt)}
                className={`h-11 rounded-lg border-2 font-bold text-sm transition-all ${
                  fulfilment === opt
                    ? 'bg-brand-main border-brand-main text-white shadow'
                    : 'bg-white border-brand-main/20 text-brand-dark hover:border-brand-main'
                }`}
              >
                {opt === 'delivery' ? 'Delivery' : 'Pickup'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {fulfilment === 'delivery' ? (
        <label className="block">
          <Label>Delivery address</Label>
          <textarea
            name="address"
            rows={2}
            maxLength={500}
            autoComplete="street-address"
            placeholder="House number, street, area, town (and a landmark if helpful)"
            aria-invalid={!!f.address}
            className={`${inputClass} h-auto py-2 resize-none ${border(f.address)}`}
          />
          <FieldError msg={f.address} />
          <p className="mt-1 text-xs text-ink-soft">
            {DELIVERY_FEE_GHS > 0
              ? `Delivery fee: ${formatMoney(DELIVERY_FEE_GHS, 'GHS')}.`
              : 'The delivery fee is paid to the rider when your book arrives.'}{' '}
            We&apos;ll call you to arrange delivery.
          </p>
        </label>
      ) : (
        <p className="text-sm px-4 py-3 rounded-lg bg-brand-pale text-brand-dark">
          Collect your book at <strong>{PICKUP_LOCATION}</strong>. We&apos;ll call you when it&apos;s ready.
        </p>
      )}

      {/* Buyer details */}
      <div className="grid sm:grid-cols-2 gap-4">
        <label className="block sm:col-span-2">
          <Label>Name</Label>
          <input name="name" autoComplete="name" aria-invalid={!!f.name} className={`${inputClass} ${border(f.name)}`} />
          <FieldError msg={f.name} />
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
          <Label>Email (for receipt)</Label>
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
        <label className="block sm:col-span-2">
          <Label>
            Note <span className="font-normal text-ink-soft">(optional)</span>
          </Label>
          <input name="note" maxLength={500} placeholder="Anything we should know" className={`${inputClass} border-brand-main/20`} />
        </label>
      </div>

      {/* Summary + pay */}
      <div className="pt-4 border-t border-brand-main/10 flex flex-col-reverse sm:flex-row sm:items-center gap-4">
        <div className="flex-1 min-w-0">
          {state.error ? (
            <p role="alert" className="text-sm text-red-700 font-semibold">{state.error}</p>
          ) : (
            <p className="text-sm text-ink-muted">
              <strong className="text-brand-dark">{bookTitle}</strong> × {quantity}
              {deliveryFee > 0 && <> + delivery</>} ={' '}
              <strong className="text-brand-dark">{formatMoney(total, 'GHS')}</strong>
            </p>
          )}
          <p className="text-[11px] text-ink-soft mt-1">Secure checkout by Paystack: Mobile Money or card.</p>
        </div>
        <SubmitButton total={formatMoney(total, 'GHS')} />
      </div>
    </form>
  )
}
