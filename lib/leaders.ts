import { supabaseAdmin } from './supabase'
import type { LeaderGroup } from './leader-groups'
export { LEADER_GROUPS, isLeaderGroup, type LeaderGroup } from './leader-groups'

export const LEADER_IMAGES_BUCKET = 'leader-images'

export type Leader = {
  id: string
  name: string
  role: string
  /** Which side of the Leadership tab they're shown on. */
  team: LeaderGroup
  image_url: string
  position: number
}

/** Leaders in display order, or null if the table can't be read. */
export async function getLeaderRows(): Promise<Leader[] | null> {
  try {
    const { data, error } = await supabaseAdmin()
      .from('leaders')
      .select('*')
      .order('position', { ascending: true })
      .order('created_at', { ascending: true })
    if (error) throw error
    return (data as Leader[]) ?? []
  } catch {
    return null
  }
}

/** Leaders for the website. Empty (and the Leadership tab hidden) until the admin adds some. */
export async function getLeaders(): Promise<Leader[]> {
  return (await getLeaderRows()) ?? []
}
