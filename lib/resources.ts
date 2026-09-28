import { supabaseAdmin } from './supabase'
export { BOOK_CATEGORIES } from './book-categories'

export const BOOK_IMAGES_BUCKET = 'book-images'
export const AUDIOMACK_PROFILE = 'https://audiomack.com/gideonpeprah-6a05e0687cb25'

export type Sermon = {
  id: string
  title: string
  audiomack_url: string
  position: number
}

export type Book = {
  id: string
  title: string
  category: string
  description: string
  image_url: string
  link_url: string | null
  /** Price in pesewas; books with a price can be ordered on /order. */
  price_minor?: number | null
  position: number
}

/**
 * Normalise an Audiomack link to https://audiomack.com/<artist>/<song|album|playlist>/<slug>.
 * Accepts links copied from the app or browser (with or without query strings or /embed).
 * Returns null if it isn't a link to a single song, album or playlist.
 */
export function normalizeAudiomackUrl(input: string): string | null {
  let url: URL
  try {
    url = new URL(input.trim())
  } catch {
    return null
  }
  if (!/(^|\.)audiomack\.com$/i.test(url.hostname)) return null
  const parts = url.pathname.split('/').filter(Boolean)
  if (parts[0] === 'embed') parts.shift()
  const [artist, kind, slug] = parts
  if (!artist || !slug || !['song', 'album', 'playlist'].includes(kind)) return null
  return `https://audiomack.com/${artist}/${kind}/${slug}`
}

/** The embeddable player URL for a stored Audiomack link. */
export function audiomackEmbedUrl(audiomackUrl: string) {
  return audiomackUrl.replace('https://audiomack.com/', 'https://audiomack.com/embed/')
}

/** Built-in content, shown when the database can't be reached or a list is empty. */
export const DEFAULT_SERMONS: Sermon[] = [
  {
    id: 'default-0',
    title: 'Prophets, Prophecy, and Prophetism',
    audiomack_url: `${AUDIOMACK_PROFILE}/song/prophets-prophecy-and-prophetism`,
    position: 1,
  },
]

export const DEFAULT_BOOKS: Book[] = [
  { title: 'Positioned for His Return', category: 'Books', image_url: '/images/V_177.jpg', description: 'A powerful teaching on how the Body of Christ can be prepared for the second coming of Jesus.' },
  { title: 'The Fire of Revival', category: 'Books', image_url: '/images/V_194.jpg', description: 'Stirring your heart for a fresh move of God in your life, family, and nation.' },
  { title: 'Kingdom Partnerships', category: 'Books', image_url: '/images/V_183.jpg', description: 'Unlocking the power of covenant relationships in ministry and in the Kingdom of God.' },
  { title: 'Daily Strength Devotional', category: 'Devotionals', image_url: '/images/V_202.jpg', description: '365 days of Spirit-filled devotions to fuel your walk with God every single day.' },
].map((b, i) => ({ id: `default-${i}`, link_url: null, position: i + 1, ...b }))

async function readTable<T>(table: 'sermons' | 'books', columns = '*'): Promise<T[] | null> {
  try {
    const { data, error } = await supabaseAdmin()
      .from(table)
      .select(columns)
      .order('position', { ascending: true })
      .order('created_at', { ascending: true })
    if (error) throw error
    return (data as T[]) ?? []
  } catch {
    return null
  }
}

/** Rows from the database in display order, or null if the table can't be read. */
export const getSermonRows = () => readTable<Sermon>('sermons', 'id, title, audiomack_url, position')
// All columns, so the site keeps working before optional columns (like price) are added.
export const getBookRows = () => readTable<Book>('books')

/** Lists for the public site, falling back to the built-in content. */
export async function getSermons() {
  const rows = await getSermonRows()
  return rows && rows.length > 0 ? rows : DEFAULT_SERMONS
}

export async function getBooks() {
  const rows = await getBookRows()
  return rows && rows.length > 0 ? rows : DEFAULT_BOOKS
}

/** Books that can be ordered on the website (those with a price), in display order. */
export async function getOrderableBooks() {
  const rows = await getBookRows()
  return (rows || []).filter((b) => b.price_minor && b.price_minor > 0)
}

/** One orderable book, or null if it doesn't exist or has no price. */
export async function getOrderableBook(id: string): Promise<Book | null> {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null
  try {
    const { data, error } = await supabaseAdmin().from('books').select('*').eq('id', id).maybeSingle()
    if (error) throw error
    const book = data as Book | null
    return book?.price_minor && book.price_minor > 0 ? book : null
  } catch {
    return null
  }
}
