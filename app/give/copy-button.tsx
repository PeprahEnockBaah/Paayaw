'use client'

import { useState } from 'react'

/** Small "Copy" button for account numbers; shows "Copied" briefly. */
export default function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      type="button"
      aria-label={`Copy ${label}`}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value.replace(/\s/g, ''))
          setCopied(true)
          setTimeout(() => setCopied(false), 1800)
        } catch {
          // Clipboard blocked (e.g. insecure context): the number is still visible to copy by hand.
        }
      }}
      className="text-xs font-bold px-3 py-1.5 rounded-full border border-brand-main/30 text-brand-dark hover:bg-brand-pale transition-colors flex-shrink-0"
    >
      {copied ? '✓ Copied' : 'Copy'}
    </button>
  )
}
