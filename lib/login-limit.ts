import crypto from 'crypto'
import { headers } from 'next/headers'
import { supabaseAdmin } from './supabase'
import { WINDOW_MINUTES } from './login-limit-config'
export { MAX_ATTEMPTS, WINDOW_MINUTES } from './login-limit-config'

/**
 * A hash of the visitor's IP address. The raw IP is never stored; the hash is
 * salted with ADMIN_PASSWORD so it can't be reversed with a lookup table.
 */
export function visitorKey() {
  const h = headers()
  // x-real-ip is set by the host (Vercel overwrites both headers, so neither can be spoofed there).
  const ip =
    h.get('x-real-ip') ||
    h.get('x-forwarded-for')?.split(',')[0].trim() ||
    'unknown'
  return crypto
    .createHash('sha256')
    .update(`${ip}::${process.env.ADMIN_PASSWORD || ''}::gpm-login-limit`)
    .digest('hex')
}

const windowStart = () => new Date(Date.now() - WINDOW_MINUTES * 60_000).toISOString()

/**
 * Number of recent failed logins for this visitor.
 * If the table isn't set up (or Supabase is unreachable) this returns 0, so a
 * database problem never locks the real admin out.
 */
export async function recentFailures(key: string): Promise<number> {
  try {
    const { count, error } = await supabaseAdmin()
      .from('login_attempts')
      .select('id', { count: 'exact', head: true })
      .eq('ip_hash', key)
      .gte('created_at', windowStart())
    if (error) throw error
    return count ?? 0
  } catch {
    return 0
  }
}

/** Record a failed login, and prune entries older than a day. */
export async function recordFailure(key: string) {
  try {
    const supabase = supabaseAdmin()
    await supabase.from('login_attempts').insert({ ip_hash: key })
    await supabase
      .from('login_attempts')
      .delete()
      .lt('created_at', new Date(Date.now() - 24 * 60 * 60_000).toISOString())
  } catch {
    // Not fatal: the lockout just won't count this attempt.
  }
}

/** Forget this visitor's failures after a successful login. */
export async function clearFailures(key: string) {
  try {
    await supabaseAdmin().from('login_attempts').delete().eq('ip_hash', key)
  } catch {
    // Old failures expire on their own after WINDOW_MINUTES.
  }
}
