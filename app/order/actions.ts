'use server'

import { randomBytes } from 'crypto'
import { redirect } from 'next/navigation'
import { getOrderableBook } from '@/lib/resources'
import { initializeTransaction, isPaystackConfigured } from '@/lib/paystack'
import { recordPendingOrder } from '@/lib/orders'
import { DELIVERY_FEE_GHS, MAX_QUANTITY, type Fulfilment } from '@/lib/order-settings'
import { siteOrigin } from '@/lib/site'

export type OrderState = {
  error?: string
  fields?: Partial<Record<'quantity' | 'name' | 'email' | 'phone' | 'address', string>>
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export async function startOrder(_prev: OrderState, formData: FormData): Promise<OrderState> {
  const get = (k: string) => String(formData.get(k) || '').trim()

  const quantity = Number(get('quantity'))
  const fulfilment: Fulfilment = get('fulfilment') === 'pickup' ? 'pickup' : 'delivery'
  const name = get('name')
  const email = get('email').toLowerCase()
  const phone = get('phone')
  const address = get('address').slice(0, 500)
  const note = get('note').slice(0, 500)

  const fields: OrderState['fields'] = {}
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY) {
    fields.quantity = `Choose between 1 and ${MAX_QUANTITY} copies.`
  }
  if (name.length < 2) fields.name = 'Please enter your name.'
  if (!EMAIL_RE.test(email)) fields.email = 'Please enter a valid email so we can send your receipt.'
  if (!/^\+?[\d\s-]{9,16}$/.test(phone)) fields.phone = 'Please enter a phone number we can reach you on.'
  if (fulfilment === 'delivery' && address.length < 5) fields.address = 'Please enter the delivery address.'
  if (Object.keys(fields).length) return { error: 'Please check the highlighted fields.', fields }

  if (!isPaystackConfigured()) {
    return { error: 'Online ordering is being set up. Please contact us to order a copy, or try again later.' }
  }

  // The price always comes from the database, never from the form.
  const book = await getOrderableBook(get('book_id'))
  if (!book?.price_minor) return { error: 'This book can’t be ordered online right now. Please contact us to order a copy.' }

  const deliveryFeeMinor = fulfilment === 'delivery' ? Math.round(DELIVERY_FEE_GHS * 100) : 0
  const amountMinor = book.price_minor * quantity + deliveryFeeMinor
  const reference = `GPMB-${Date.now().toString(36).toUpperCase()}-${randomBytes(4).toString('hex').toUpperCase()}`

  try {
    await recordPendingOrder({
      reference,
      book_id: book.id,
      book_title: book.title,
      unit_price_minor: book.price_minor,
      quantity,
      delivery_fee_minor: deliveryFeeMinor,
      amount_minor: amountMinor,
      currency: 'GHS',
      name,
      email,
      phone,
      fulfilment,
      address: fulfilment === 'delivery' ? address : null,
      note: note || null,
    })
  } catch (e) {
    console.error('Could not record order', reference, e)
    return { error: 'We couldn’t save your order. Please try again in a moment.' }
  }

  let checkoutUrl: string
  try {
    const tx = await initializeTransaction({
      email,
      amountMinor,
      currency: 'GHS',
      reference,
      callbackUrl: `${siteOrigin()}/order/thank-you`,
      metadata: {
        kind: 'book_order',
        book_title: book.title,
        quantity,
        fulfilment,
        // Shown on the Paystack dashboard for each payment.
        custom_fields: [
          { display_name: 'Book', variable_name: 'book_title', value: `${book.title} × ${quantity}` },
          { display_name: 'Buyer', variable_name: 'buyer_name', value: name },
          { display_name: 'Phone', variable_name: 'phone', value: phone },
          { display_name: 'Fulfilment', variable_name: 'fulfilment', value: fulfilment === 'delivery' ? `Delivery: ${address}` : 'Pickup' },
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
