// The two groups on the About Us Leadership tab: Leadership on the left, Staff on the right.
// Kept separate from lib/leaders.ts so client components can import it.
export const LEADER_GROUPS = ['Leadership', 'Staff'] as const
export type LeaderGroup = (typeof LEADER_GROUPS)[number]

export const isLeaderGroup = (g: string): g is LeaderGroup => (LEADER_GROUPS as readonly string[]).includes(g)
