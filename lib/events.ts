import { supabaseAdmin } from './supabase'

export type EventRow = {
  id: string
  event_date: string // YYYY-MM-DD
  title: string
  location: string | null
  time: string | null
  description: string | null
  tag: string | null
  image_url: string | null
}

export const tagColors: Record<string, string> = {
  Conference: 'bg-brand-main/10 text-brand-dark',
  'Special Service': 'bg-gold/10 text-gold-dark',
  Celebration: 'bg-brand-pale text-brand-dark',
  Outreach: 'bg-orange-50 text-orange-700',
  Youth: 'bg-gold-light/30 text-gold-dark',
}

/** Break a YYYY-MM-DD string into the day / month / year used by the date block. */
export function splitDate(d: string) {
  const date = new Date(`${d}T00:00:00`)
  if (isNaN(date.getTime())) return { day: '--', month: '--', year: '' }
  return {
    day: String(date.getDate()),
    month: date.toLocaleString('en-US', { month: 'short' }),
    year: String(date.getFullYear()),
  }
}

/**
 * Fetch all events: by date (public page) or latest added first (admin). Returns [] (instead of throwing) when
 * Supabase isn't configured yet, so the site still renders before setup.
 */
export async function getEvents(order: 'date' | 'newest' = 'date'): Promise<EventRow[]> {
  try {
    const supabase = supabaseAdmin()
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order(order === 'date' ? 'event_date' : 'created_at', { ascending: order === 'date' })
    if (error) throw error
    return (data as EventRow[]) ?? []
  } catch {
    return []
  }
}
