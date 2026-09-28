'use server'

import { randomBytes } from 'crypto'
import { redirect } from 'next/navigation'
import { GIVING_TYPES, DEFAULT_CURRENCY, DEFAULT_GIVING_TYPE, amountRange, chargeCurrency, convert, isCurrencyCode, parseAmount } from '@/lib/giving'
import { chargeableCurrencies, getRatesPerUsd } from '@/lib/fx'
import { initializeTransaction, isPaystackConfigured } from '@/lib/paystack'
import { recordPendingDonation } from '@/lib/donations'
import { siteOrigin } from '@/lib/site'

export type GiveState = {
  error?: string
  fields?: Partial<Record<'amount' | 'name' | 'email' | 'phone', string>>
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export async function startDonation(_prev: GiveState, formData: FormData): Promise<GiveState> {
  const get = (k: string) => String(formData.get(k) || '').trim()

  const currencyInput = get('currency')
  const donorCurrency = isCurrencyCode(currencyInput) ? currencyInput : DEFAULT_CURRENCY
  const amount = parseAmount(get('amount'), donorCurrency)
  const givingType = get('giving_type')
  const name = get('name')
  const email = get('email').toLowerCase()
  const phone = get('phone')
  const message = get('message').slice(0, 500)

  const fields: GiveState['fields'] = {}
  if (amount === null) fields.amount = `Choose an amount, or type one between ${amountRange(donorCurrency)}.`
  if (name.length < 2) fields.name = 'Please enter your name.'
  if (!EMAIL_RE.test(email)) fields.email = 'Please enter a valid email so we can send your receipt.'
  if (phone && !/^\+?[\d\s-]{9,16}$/.test(phone)) fields.phone = 'Please enter a valid phone number, or leave it empty.'
  if (Object.keys(fields).length) return { error: 'Please check the highlighted fields.', fields }

  if (!isPaystackConfigured()) {
    return { error: 'Online giving is being set up. Please use one of the other ways to give below, or try again later.' }
  }

  const type = GIVING_TYPES.some((t) => t.id === givingType) ? givingType : DEFAULT_GIVING_TYPE
  const reference = `GPM-${Date.now().toString(36).toUpperCase()}-${randomBytes(4).toString('hex').toUpperCase()}`
  // Paystack can't charge every currency (e.g. EUR, GBP): convert those at today's rate.
  const currency = chargeCurrency(donorCurrency, chargeableCurrencies())
  let charged = amount!
  let fxRate: number | null = null
  if (currency !== donorCurrency) {
    const rates = await getRatesPerUsd()
    const converted = rates && convert(amount!, donorCurrency, currency, rates)
    if (!converted) {
      return { error: 'We couldn’t get today’s exchange rate. Please give in cedis or try again shortly.' }
    }
    charged = converted
    fxRate = Math.round((converted / amount!) * 1e6) / 1e6
  }
  const amountMinor = Math.round(charged * 100)
  const donorAmountMinor = Math.round(amount! * 100)

  await recordPendingDonation({
    reference,
    amount_minor: amountMinor,
    currency,
    donor_amount_minor: donorAmountMinor,
    donor_currency: donorCurrency,
    fx_rate: fxRate,
    giving_type: type,
    name,
    email,
    phone: phone || null,
    message: message || null,
  })

  let checkoutUrl: string
  try {
    const tx = await initializeTransaction({
      email,
      amountMinor,
      currency,
      reference,
      callbackUrl: `${siteOrigin()}/give/thank-you`,
      metadata: {
        donor_name: name,
        giving_type: type,
        phone: phone || undefined,
        message: message || undefined,
        donor_currency: donorCurrency,
        donor_amount_minor: donorAmountMinor,
        // Shown on the Paystack dashboard for each payment.
        custom_fields: [
          { display_name: 'Donor', variable_name: 'donor_name', value: name },
          { display_name: 'Giving type', variable_name: 'giving_type', value: type },
          { display_name: 'Donor chose', variable_name: 'donor_amount', value: `${amount} ${donorCurrency}` },
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
