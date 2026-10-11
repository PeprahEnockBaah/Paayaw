import { supabaseAdmin } from './supabase'

export type Tenet = {
  id: string
  title: string
  body: string
  position: number
}

/**
 * Built-in tenets, shown only when the database can't be reached (e.g. before the tenets
 * table is set up). Matches the one-time seed in supabase-schema.sql.
 */
export const DEFAULT_TENETS: Tenet[] = [
  { title: 'The Bible', body: 'We believe the Holy Bible is the inspired, infallible Word of God and the supreme authority in all matters of faith and conduct.' },
  { title: 'The Trinity', body: 'We believe in one God, eternally existing in three persons: Father, Son, and Holy Spirit.' },
  { title: 'Jesus Christ', body: 'We believe in the deity of our Lord Jesus Christ, His virgin birth, sinless life, atoning death, bodily resurrection, and His imminent return.' },
  { title: 'Salvation', body: 'We believe that salvation is by grace through faith in Jesus Christ alone, and that all who repent and believe shall receive eternal life.' },
  { title: 'The Holy Spirit', body: 'We believe in the present ministry of the Holy Spirit, who empowers believers for life and service.' },
  { title: 'The Church', body: 'We believe in the universal Church, the Body of Christ, and the importance of Christian fellowship, worship, and discipleship.' },
].map((t, i) => ({ id: `default-${i}`, position: i + 1, ...t }))

/** Tenets in display order, or null if the table can't be read. */
export async function getTenetRows(): Promise<Tenet[] | null> {
  try {
    const { data, error } = await supabaseAdmin()
      .from('tenets')
      .select('*')
      .order('position', { ascending: true })
      .order('created_at', { ascending: true })
    if (error) throw error
    return (data as Tenet[]) ?? []
  } catch {
    return null
  }
}

/** Tenets for the website: the admin's list as-is (even if empty), or the built-in set if it can't be read. */
export async function getTenets(): Promise<Tenet[]> {
  return (await getTenetRows()) ?? DEFAULT_TENETS
}
