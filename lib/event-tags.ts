// Kept separate from lib/events.ts so client components can import it
// without pulling in the server-only Supabase client.
export const EVENT_TAGS = ['Conference', 'Special Service', 'Celebration', 'Outreach', 'Youth', 'Other'] as const
