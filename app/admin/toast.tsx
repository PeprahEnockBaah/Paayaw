'use client'

import { useEffect, useState } from 'react'
import type { AdminMessage } from './messages'

const SHOW_MS = 5000

/**
 * Pop-up notification in the corner after an admin action. Disappears after a few
 * seconds (or when closed), and clears the marker from the address bar so a refresh
 * doesn't show it again.
 */
export default function Toast({ message }: { message: AdminMessage | null }) {
  const [visible, setVisible] = useState(!!message)

  useEffect(() => {
    if (!message) return
    setVisible(true)
    // Keep the #section so the page stays where it scrolled to, drop the ?marker.
    window.history.replaceState(null, '', window.location.pathname + window.location.hash)
    const t = setTimeout(() => setVisible(false), SHOW_MS)
    return () => clearTimeout(t)
  }, [message])

  if (!message) return null

  return (
    <div
      role={message.ok ? 'status' : 'alert'}
      aria-live="polite"
      className={`fixed z-[60] bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:w-96 transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <div className={`flex items-start gap-3 rounded-2xl bg-white shadow-2xl border-l-4 px-4 py-3.5 ${message.ok ? 'border-green-600' : 'border-red-600'}`}>
        <span
          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${message.ok ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}
          aria-hidden
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d={message.ok ? 'M4.5 12.75l6 6 9-13.5' : 'M12 9v3.75m0 3.75h.008v.008H12v-.008z'} />
          </svg>
        </span>
        <div className="flex-1 min-w-0 pt-0.5">
          <p className="font-heading font-bold text-sm text-brand-dark">{message.ok ? 'Success' : 'Something went wrong'}</p>
          <p className="text-sm text-ink-muted leading-snug">{message.text}</p>
        </div>
        <button type="button" onClick={() => setVisible(false)} aria-label="Dismiss" className="text-xl leading-none text-ink-soft hover:text-ink">
          ×
        </button>
      </div>
    </div>
  )
}
