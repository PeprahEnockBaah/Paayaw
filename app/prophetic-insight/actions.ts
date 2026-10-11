'use server'

import { randomBytes } from 'crypto'
import { redirect } from 'next/navigation'
import { initializeTransaction, isPaystackConfigured } from '@/lib/paystack'
import { recordPendingInsightRequest } from '@/lib/insight-requests'
import { DEFAULT_SEED_CURRENCY, INSIGHT_SERVICE, parseInternationalPhone } from '@/lib/insight-settings'
import { amountRange, chargeCurrency, convert, isCurrencyCode, parseAmount } from '@/lib/giving'
import { chargeableCurrencies, getRatesPerUsd } from '@/lib/fx'
import { contactFallback } from '@/lib/contact-info'
import { siteOrigin } from '@/lib/site'

type Field = 'name' | 'email' | 'phone' | 'country' | 'preferred_date' | 'amount'

export type InsightState = {
  error?: string
  fields?: Partial<Record<Field, string>>
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export async function startInsightRequest(_prev: InsightState, formData: FormData): Promise<InsightState> {
  const get = (k: string, max = 200) => String(formData.get(k) || '').trim().slice(0, max)

  // Hidden field that people never see; bots that fill it in are quietly ignored.
  if (get('website')) redirect('/prophetic-insight')

  const name = get('name')
  const email = get('email').toLowerCase()
  const phone = parseInternationalPhone(get('phone', 30))
  const country = get('country', 100)
  const preferredDate = get('preferred_date', 10)
  const currencyInput = get('currency', 3)
  const chosenCurrency = isCurrencyCode(currencyInput) ? currencyInput : DEFAULT_SEED_CURRENCY
  const amountText = get('amount', 20)
  const amount = parseAmount(amountText, chosenCurrency)

  const fields: InsightState['fields'] = {}
  if (name.length < 2) fields.name = 'Please enter your name.'
  if (!EMAIL_RE.test(email)) fields.email = 'Please enter a valid email so we can reply.'
  if (!phone) fields.phone = 'Please enter your number in international format, starting with + and your country code (e.g. +233 24 000 0000).'
  if (country.length < 2) fields.country = 'Please enter your country.'
  const today = new Date().toISOString().slice(0, 10)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(preferredDate)) fields.preferred_date = 'Please choose a date.'
  else if (preferredDate < today) fields.preferred_date = 'That date has already passed.'
  if (amount === null) {
    fields.amount = amountText ? `Please enter an amount between ${amountRange(chosenCurrency)}.` : 'Please enter your offering/seed.'
  }
  if (Object.keys(fields).length) return { error: 'Please check the highlighted fields.', fields }

  if (!isPaystackConfigured()) {
    return { error: `Online requests are being set up. ${await contactFallback()}` }
  }

  // Paystack can't charge every currency (e.g. EUR, GBP): convert those at today's rate, like the Give page.
  const currency = chargeCurrency(chosenCurrency, chargeableCurrencies())
  let charged = amount!
  if (currency !== chosenCurrency) {
    const rates = await getRatesPerUsd()
    const converted = rates && convert(amount!, chosenCurrency, currency, rates)
    if (!converted) return { error: 'We couldn’t get today’s exchange rate. Please choose cedis or try again shortly.' }
    charged = converted
  }
  const amountMinor = Math.round(charged * 100)
  const reference = `GPMI-${Date.now().toString(36).toUpperCase()}-${randomBytes(4).toString('hex').toUpperCase()}`

  try {
    await recordPendingInsightRequest({
      reference,
      request_type: INSIGHT_SERVICE,
      amount_minor: amountMinor,
      currency,
      chosen_amount_minor: Math.round(amount! * 100),
      chosen_currency: chosenCurrency,
      name,
      email,
      phone: phone!,
      country,
      preferred_date: preferredDate,
    })
  } catch (e) {
    console.error('Could not record insight request', reference, e)
    return { error: 'We couldn’t save your request. Please try again in a moment.' }
  }

  let checkoutUrl: string
  try {
    const tx = await initializeTransaction({
      email,
      amountMinor,
      currency,
      reference,
      callbackUrl: `${siteOrigin()}/prophetic-insight/thank-you`,
      metadata: {
        kind: 'insight_request',
        request_type: INSIGHT_SERVICE,
        // Shown on the Paystack dashboard for each payment.
        custom_fields: [
          { display_name: 'Request', variable_name: 'request_type', value: INSIGHT_SERVICE },
          { display_name: 'Name', variable_name: 'requester_name', value: name },
          { display_name: 'Phone', variable_name: 'phone', value: phone! },
          { display_name: 'Chose', variable_name: 'chosen_amount', value: `${amount} ${chosenCurrency}` },
        ],
      },
    })
    checkoutUrl = tx.authorization_url
  } catch (e) {
    console.error('Paystack initialize failed', reference, e)
    return { error: 'We couldn’t connect to the payment service. Please try again in a moment.' }
  }

  // redirect() must be called outside try/catch (it works by throwing).
  redirect(checkoutUrl)
}
