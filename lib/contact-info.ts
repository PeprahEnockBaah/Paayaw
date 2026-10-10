import { supabaseAdmin } from './supabase'

/** Contact details shown on the Contact page, editable from /admin. */
export type ContactInfo = {
  /** One line per row, e.g. "GPM International HQ\nOld Abesim\nSunyani, Ghana". */
  address: string
  phone: string
  email: string
  /** One line per row, e.g. "Mon – Fri: 9:00 AM – 5:00 PM". */
  hours: string
}

/** Built-in details, used until the admin saves their own (or if the database can't be reached). */
export const DEFAULT_CONTACT_INFO: ContactInfo = {
  address: 'GPM International HQ\nOld Abesim\nSunyani, Ghana',
  phone: '+233 54 616 9116',
  email: 'info@gideonpeprah.com',
  hours: 'Mon – Fri: 9:00 AM – 5:00 PM\nSat: 10:00 AM – 2:00 PM',
}

const FIELDS = Object.keys(DEFAULT_CONTACT_INFO) as (keyof ContactInfo)[]
const KEY_PREFIX = 'contact_'

/** Saved details merged over the built-in ones, or null if the settings table can't be read. */
export async function getContactInfoRow(): Promise<ContactInfo | null> {
  try {
    const { data, error } = await supabaseAdmin()
      .from('site_settings')
      .select('key, value')
      .in('key', FIELDS.map((f) => KEY_PREFIX + f))
    if (error) throw error
    const info = { ...DEFAULT_CONTACT_INFO }
    for (const row of data ?? []) {
      const field = String(row.key).slice(KEY_PREFIX.length) as keyof ContactInfo
      if (FIELDS.includes(field) && row.value) info[field] = row.value
    }
    return info
  } catch {
    return null
  }
}

/** Contact details for the website: what the admin saved, falling back to the built-in set. */
export async function getContactInfo(): Promise<ContactInfo> {
  return (await getContactInfoRow()) ?? DEFAULT_CONTACT_INFO
}

/** Rows to save for the given details. */
export const contactInfoRows = (info: ContactInfo) =>
  FIELDS.map((f) => ({ key: KEY_PREFIX + f, value: info[f], updated_at: new Date().toISOString() }))

/** "Please call … or email … instead." for when a form can't be sent. */
export async function contactFallback() {
  const { phone, email } = await getContactInfo()
  return `Please call ${phone} or email ${email} instead.`
}
