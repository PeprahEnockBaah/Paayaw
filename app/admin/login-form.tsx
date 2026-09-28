'use client'

import { login } from './actions'
import { WINDOW_MINUTES } from '@/lib/login-limit-config'

export default function LoginForm({
  error,
  attemptsLeft,
}: {
  error?: 'wrong' | 'locked'
  attemptsLeft?: number
}) {
  const locked = error === 'locked'

  return (
    <section className="max-w-md mx-auto px-6 py-24">
      <div className="bg-white rounded-2xl shadow-sm p-8" style={{ border: '1px solid rgba(14,90,69,0.1)' }}>
        <h1 className="font-heading text-2xl font-bold mb-1" style={{ color: 'var(--brand-dark)' }}>
          Admin Login
        </h1>
        <p className="text-sm mb-6" style={{ color: '#66736d' }}>
          Enter the admin password to manage the website.
        </p>
        {error === 'wrong' && (
          <p className="text-sm mb-4 px-3 py-2 rounded-lg bg-red-50 text-red-700">
            Incorrect password.
            {attemptsLeft
              ? ` ${attemptsLeft} ${attemptsLeft === 1 ? 'try' : 'tries'} left before login is paused for ${WINDOW_MINUTES} minutes.`
              : ' Please try again.'}
          </p>
        )}
        {locked && (
          <p className="text-sm mb-4 px-3 py-2 rounded-lg bg-red-50 text-red-700">
            Too many incorrect attempts. For security, login is paused for {WINDOW_MINUTES} minutes. Please try
            again later.
          </p>
        )}
        <form action={login} className="space-y-4">
          <input
            type="password"
            name="password"
            required
            autoFocus
            placeholder="Admin password"
            className="w-full px-4 py-3 rounded-lg border outline-none focus:ring-2"
            style={{ borderColor: 'rgba(14,90,69,0.2)', color: '#1c2a25' }}
          />
          <button type="submit" className="btn-primary w-full">
            Log In
          </button>
        </form>
      </div>
    </section>
  )
}
