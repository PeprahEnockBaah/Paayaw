// Kept separate from lib/login-limit.ts so the login form (a client component)
// can show these numbers without importing server-only code.

/** Failed logins allowed from one visitor before they're locked out. */
export const MAX_ATTEMPTS = 5
/** How long failures are remembered, and how long a lockout lasts. */
export const WINDOW_MINUTES = 15
