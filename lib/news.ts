import { supabaseAdmin } from './supabase'

export const NEWS_IMAGES_BUCKET = 'news-images'

export type NewsItem = {
  id: string
  title: string
  news_date: string // YYYY-MM-DD
  image_url: string
  /** The full story, shown on the update's own page. Empty = no page of its own. */
  body: string
  /** Optional "Read more" link: a web address or a page on this site like /media. */
  link_url: string | null
  position: number
}

/** How many updates the homepage "Stay Updated" section shows. */
export const HOME_NEWS_COUNT = 4

/**
 * Built-in updates, shown only when the database can't be reached (e.g. before the news
 * table is set up). Once it is, the admin's list is used as-is, even when empty.
 */
export const DEFAULT_NEWS: NewsItem[] = [
  { title: 'A New Place of Worship Established in the Northern Region', news_date: '2025-09-01', image_url: '/images/V_185.jpg' },
  { title: 'GPM Renovates Local School to Boost Education in the Community', news_date: '2025-06-01', image_url: '/images/V_197.jpg' },
  { title: 'Remember Them — Annual Community Outreach a Great Success', news_date: '2025-05-02', image_url: '/images/V_61.jpg' },
  { title: 'Go To Them — GPM Evangelism Campaign Reaches Thousands', news_date: '2025-05-01', image_url: '/images/V_186.jpg' },
].map((n, i) => ({ id: `default-${i}`, body: '', link_url: '/media', position: i + 1, ...n }))

/** "11 October 2026". */
export function formatNewsDate(d: string) {
  const date = new Date(`${d}T12:00:00Z`)
  if (isNaN(date.getTime())) return ''
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
}

/**
 * Where an update's card goes: its own page when it has a story, otherwise straight
 * to its link, otherwise nowhere (null).
 */
export function newsHref(n: NewsItem) {
  if (n.body.trim()) return `/news/${n.id}`
  return n.link_url || null
}

/** Updates from the database in display order, or null if the table can't be read. */
export async function getNewsRows(): Promise<NewsItem[] | null> {
  try {
    const { data, error } = await supabaseAdmin()
      .from('news')
      .select('*')
      .order('position', { ascending: true })
      .order('created_at', { ascending: false })
    if (error) throw error
    return (data as NewsItem[]) ?? []
  } catch {
    return null
  }
}

/** Updates for the website: the database list (may be empty), or the built-in set if it can't be read. */
export async function getNews(): Promise<NewsItem[]> {
  return (await getNewsRows()) ?? DEFAULT_NEWS
}

/** One update for its own page, or null if it doesn't exist. */
export async function getNewsItem(id: string): Promise<NewsItem | null> {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null
  try {
    const { data, error } = await supabaseAdmin().from('news').select('*').eq('id', id).maybeSingle()
    if (error) throw error
    return (data as NewsItem) ?? null
  } catch {
    return null
  }
}
