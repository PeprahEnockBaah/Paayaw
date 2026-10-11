import { supabaseAdmin } from './supabase'
import type { PaystackTransaction } from './paystack'
import { sendInsightEmails } from './receipts'

export type InsightRequest = {
  id: string
  created_at: string
  reference: string
  request_type: string
  /** What was charged on Paystack. */
  amount_minor: number
  currency: string
  /** What the person chose, if it was converted (e.g. EUR charged as USD); otherwise the same as above. */
  chosen_amount_minor: number | null
  chosen_currency: string | null
  name: string
  email: string
  phone: string
  country: string
  /** Anticipated date for the session (YYYY-MM-DD). */
  preferred_date: string
  status: string
  channel: string | null
  paid_at: string | null
  responded_at: string | null
  emailed_at: string | null
}

/** References made by the Prophetic Insight page ("GPMI-…"). */
export const isInsightReference = (reference: string) => reference.startsWith('GPMI-')

/**
 * Record a request as pending before the person goes to Paystack. This must succeed:
 * the request itself only exists here, so without it there is nothing to send on.
 */
export async function recordPendingInsightRequest(
  r: Omit<InsightRequest, 'id' | 'created_at' | 'status' | 'channel' | 'paid_at' | 'responded_at' | 'emailed_at'>
) {
  const { error } = await supabaseAdmin().from('insight_requests').insert({ ...r, status: 'pending' })
  if (error) throw error
}

/**
 * Update a request from Paystack's verified transaction. Safe to call more than once
 * (the thank-you page and the webhook may both do it). Throws if it can't be saved,
 * so the webhook can ask Paystack to retry.
 */
export async function saveVerifiedInsightRequest(tx: PaystackTransaction) {
  const { data, error } = await supabaseAdmin()
    .from('insight_requests')
    .update({ status: tx.status, channel: tx.channel, paid_at: tx.paid_at })
    .eq('reference', tx.reference)
    .select('id')
  if (error) throw error
  if (!data?.length) console.error('Paid insight request has no saved details; check Paystack for', tx.reference)
  // The request goes to the Prophet only once the seed is paid (sent once, never throws).
  if (tx.status === 'success') await sendInsightEmails(tx.reference)
}

/** Recent requests for the admin page, or null if the table isn't set up. */
export async function getRecentInsightRequests(limit = 100): Promise<InsightRequest[] | null> {
  try {
    const { data, error } = await supabaseAdmin()
      .from('insight_requests')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)
    if (error) throw error
    return (data as InsightRequest[]) ?? []
  } catch {
    return null
  }
}
