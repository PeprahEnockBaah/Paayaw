import { supabaseAdmin } from './supabase'
import type { PaystackTransaction } from './paystack'
import { DEFAULT_GIVING_TYPE } from './giving'

export type Donation = {
  id: string
  created_at: string
  reference: string
  amount_minor: number
  currency: string
  donor_amount_minor: number | null
  donor_currency: string | null
  fx_rate: number | null
  giving_type: string
  name: string
  email: string
  phone: string | null
  message: string | null
  status: string
  channel: string | null
  paid_at: string | null
}

/**
 * Record a gift as pending before the donor goes to Paystack.
 * Failure here is logged but not fatal: the payment itself matters more, and the
 * Paystack confirmation (webhook) will create the record if it's missing.
 */
export async function recordPendingDonation(d: {
  reference: string
  amount_minor: number
  currency: string
  donor_amount_minor: number
  donor_currency: string
  fx_rate: number | null
  giving_type: string
  name: string
  email: string
  phone: string | null
  message: string | null
}) {
  try {
    const { error } = await supabaseAdmin().from('donations').insert({ ...d, status: 'pending' })
    if (error) throw error
  } catch (e) {
    console.error('Could not record pending donation', d.reference, e)
  }
}

/** References made by the Give page; other payments on the Paystack account are ignored. */
export const isDonationReference = (reference: string) => reference.startsWith('GPM-')

/**
 * Update a gift from Paystack's verified transaction. Safe to call more than once
 * (the thank-you page and the webhook may both do it). Throws if it can't be saved,
 * so the webhook can ask Paystack to retry.
 */
export async function saveVerifiedTransaction(tx: PaystackTransaction, metadata?: Record<string, unknown>) {
  const update = {
    status: tx.status,
    channel: tx.channel,
    paid_at: tx.paid_at,
    amount_minor: tx.amount,
    currency: tx.currency,
  }
  const supabase = supabaseAdmin()
  const { data, error } = await supabase
    .from('donations')
    .update(update)
    .eq('reference', tx.reference)
    .select('id')
  if (error) throw error
  // No pending row (e.g. it failed to save earlier): create it from Paystack's data.
  if (!data?.length) {
    const m = metadata || tx.metadata || {}
    const { error: insertError } = await supabase.from('donations').insert({
      ...update,
      reference: tx.reference,
      email: tx.customer.email,
      name: String(m.donor_name || tx.customer.email),
      giving_type: String(m.giving_type || DEFAULT_GIVING_TYPE),
      phone: m.phone ? String(m.phone) : null,
      message: m.message ? String(m.message) : null,
      donor_currency: m.donor_currency ? String(m.donor_currency) : tx.currency,
      donor_amount_minor: Number(m.donor_amount_minor) || tx.amount,
    })
    // A duplicate means the webhook and thank-you page raced; the other one saved it.
    if (insertError && insertError.code !== '23505') throw insertError
  }
}

/** Recent gifts for the admin page, or null if the table isn't set up. */
export async function getRecentDonations(limit = 50): Promise<Donation[] | null> {
  try {
    const { data, error } = await supabaseAdmin()
      .from('donations')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)
    if (error) throw error
    return (data as Donation[]) ?? []
  } catch {
    return null
  }
}
