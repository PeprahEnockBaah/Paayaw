'use client'

import { useEffect, useState } from 'react'

export type AdminTab = { id: string; label: string; content: React.ReactNode }

/**
 * Shows one admin section at a time instead of one long page.
 * The open tab is kept in the address (#books, #events, …), so after saving,
 * the redirect back to /admin#books lands on the same tab.
 */
export default function AdminTabs({ tabs }: { tabs: AdminTab[] }) {
  const [active, setActive] = useState(tabs[0].id)

  useEffect(() => {
    const fromHash = () => {
      const id = window.location.hash.slice(1)
      if (tabs.some((t) => t.id === id)) setActive(id)
    }
    fromHash()
    window.addEventListener('hashchange', fromHash)
    return () => window.removeEventListener('hashchange', fromHash)
  }, [tabs])

  const open = (id: string) => {
    setActive(id)
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}#${id}`)
    window.scrollTo({ top: 0 })
  }

  return (
    <>
      <div className="sticky top-0 z-40 -mx-4 sm:mx-0 px-4 sm:px-0 py-3 mb-8 bg-white/95 backdrop-blur border-b border-brand-main/10">
        <div role="tablist" className="flex gap-2 overflow-x-auto no-scrollbar">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={active === t.id}
              onClick={() => open(t.id)}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                active === t.id ? 'bg-brand-main text-white shadow-sm' : 'bg-brand-pale text-brand-dark hover:bg-brand-light/30'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {tabs.map((t) => (
        <div key={t.id} role="tabpanel" hidden={active !== t.id}>
          {t.content}
        </div>
      ))}
    </>
  )
}
