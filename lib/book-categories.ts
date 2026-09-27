// Kept separate from lib/resources.ts so client components can import it
// without pulling in the server-only Supabase client.
export const BOOK_CATEGORIES = ['Books', 'Devotionals'] as const
