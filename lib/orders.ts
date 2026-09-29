import { supabaseAdmin } from './supabase'
import type { PaystackTransaction } from './paystack'
import type { Fulfilment } from './order-settings'
import { sendOrderEmails } from './receipts'

export type BookOrder = {
  id: string
  created_at: string
  reference: string
  book_id: string | null
  book_title: string
  unit_price_minor: number
  quantity: number
  delivery_fee_minor: number
  amount_minor: number
  currency: string
  name: string
  email: string
  phone: string
  fulfilment: Fulfilment
  address: string | null
  note: string | null
  status: string
  channel: string | null
  paid_at: string | null
  fulfilled_at: string | null
  emailed_at: string | null
}

/** References made by the order page ("GPMB-…"); donations use "GPM-…". */
export const isOrderReference = (reference: string) => reference.startsWith('GPMB-')

/**
 * Record an order as pending before the buyer goes to Paystack. Unlike donations this
 * must succeed: the delivery details only exist here, so without it we can't fulfil the order.
 */
export async function recordPendingOrder(
  o: Omit<BookOrder, 'id' | 'created_at' | 'status' | 'channel' | 'paid_at' | 'fulfilled_at' | 'emailed_at'>
) {
  const { error } = await supabaseAdmin().from('book_orders').insert({ ...o, status: 'pending' })
  if (error) throw error
}

/**
 * Update an order from Paystack's verified transaction. Safe to call more than once
 * (the thank-you page and the webhook may both do it). Throws if it can't be saved,
 * so the webhook can ask Paystack to retry.
 */
export async function saveVerifiedOrder(tx: PaystackTransaction) {
  const { data, error } = await supabaseAdmin()
    .from('book_orders')
    .update({ status: tx.status, channel: tx.channel, paid_at: tx.paid_at })
    .eq('reference', tx.reference)
    .select('id')
  if (error) throw error
  if (!data?.length) console.error('Paid order has no saved details; check Paystack for', tx.reference)
  // Receipt to the buyer and notice to the Prophet (sent once, never throws).
  if (tx.status === 'success') await sendOrderEmails(tx.reference)
}

/** Recent orders for the admin page, or null if the table isn't set up. */
export async function getRecentOrders(limit = 100): Promise<BookOrder[] | null> {
  try {
    const { data, error } = await supabaseAdmin()
      .from('book_orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)
    if (error) throw error
    return (data as BookOrder[]) ?? []
  } catch {
    return null
  }
}
