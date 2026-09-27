import { supabaseAdmin } from './supabase'

export const SLIDER_IMAGES_BUCKET = 'slider-images'

export type Slide = {
  id: string
  image_url: string
  alt: string
  /** Wide designed banner: fills the frame on large screens, shown whole on smaller ones. */
  banner: boolean
  position: number
}

/**
 * Built-in slides, shown when the database can't be reached or has no slides,
 * so the homepage slider is never empty. Matches the seed in supabase-schema.sql.
 */
export const DEFAULT_SLIDES: Slide[] = [
  { image_url: '/images/hd/prophets-prophecy-banner.jpg', alt: 'Prophets, Prophecy, and Prophetism by Gideon Peprah', banner: true },
  { image_url: '/images/hd/V_10.jpg', alt: 'Gideon Peprah Ministries' },
  { image_url: '/images/hd/V_13.jpg', alt: 'Ministry service' },
  { image_url: '/images/hd/V_23.jpg', alt: 'Worship gathering' },
  { image_url: '/images/hd/V_44.jpg', alt: 'Church fellowship' },
  { image_url: '/images/hd/V_45.jpg', alt: 'Ministry gathering' },
  { image_url: '/images/hd/V_62.jpg', alt: 'Church service' },
  { image_url: '/images/hd/V_132.jpg', alt: 'Ministry outreach' },
  { image_url: '/images/hd/V_143.jpg', alt: 'Church gathering' },
  { image_url: '/images/hd/V_165.jpg', alt: 'Ministry event' },
  { image_url: '/images/hd/V_188.jpg', alt: 'Gospel outreach' },
  { image_url: '/images/hd/V_199.jpg', alt: 'Kingdom service' },
  { image_url: '/images/hd/V_203.jpg', alt: 'Interpreting Destinies' },
  { image_url: '/images/hd/V_204.jpg', alt: 'Ministry in action' },
].map((s, i) => ({ id: `default-${i}`, banner: false, position: i + 1, ...s }))

/** Slides from the database in display order, or null if the table can't be read. */
export async function getSlideRows(): Promise<Slide[] | null> {
  try {
    const { data, error } = await supabaseAdmin()
      .from('slides')
      .select('id, image_url, alt, banner, position')
      .order('position', { ascending: true })
      .order('created_at', { ascending: true })
    if (error) throw error
    return (data as Slide[]) ?? []
  } catch {
    return null
  }
}

/** Slides for the homepage: the database list, falling back to the built-in set. */
export async function getSlides(): Promise<Slide[]> {
  const rows = await getSlideRows()
  return rows && rows.length > 0 ? rows : DEFAULT_SLIDES
}
