'use client'

import { useEffect, useState } from 'react'
import PageHeader from '@/components/PageHeader'

export type AboutTab = { id: string; label: string; content: React.ReactNode }

/**
 * Slim title strip with one tab per section, showing one section at a time so the page fits
 * on one screen. Links like /about-us#faith open that tab, including from the menu while
 * already on this page.
 */
export default function AboutTabs({ tabs }: { tabs: AboutTab[] }) {
  const [active, setActive] = useState(tabs[0].id)

  useEffect(() => {
    const select = (id: string, smooth: boolean) => {
      if (!tabs.some((t) => t.id === id)) return false
      setActive(id)
      window.scrollTo({ top: 0, behavior: smooth ? 'smooth' : 'auto' })
      return true
    }
    const fromHash = () => select(window.location.hash.slice(1), false)
    fromHash()

    // Links to another tab of this page (menu, footer) switch the tab right here instead of
    // making Next.js navigate. Runs before the link's own click handler, which then skips.
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const link = (e.target as Element | null)?.closest?.('a')
      if (!link) return
      const url = new URL(link.href, window.location.href)
      if (url.pathname !== window.location.pathname || !url.hash) return
      if (select(url.hash.slice(1), true)) {
        e.preventDefault()
        window.history.replaceState(window.history.state, '', url.hash)
      }
    }
    document.addEventListener('click', onClick, true)
    window.addEventListener('hashchange', fromHash)
    window.addEventListener('popstate', fromHash)
    return () => {
      document.removeEventListener('click', onClick, true)
      window.removeEventListener('hashchange', fromHash)
      window.removeEventListener('popstate', fromHash)
    }
  }, [tabs])

  const open = (id: string) => {
    setActive(id)
    window.history.replaceState(window.history.state, '', `${window.location.pathname}#${id}`)
  }

  return (
    <>
      <PageHeader eyebrow="Our Story" title="About Us">
          <div role="tablist" aria-label="About us sections" className="flex flex-wrap gap-2">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                id={`tab-${t.id}`}
                aria-selected={active === t.id}
                aria-controls={`panel-${t.id}`}
                onClick={() => open(t.id)}
                className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${
                  active === t.id
                    ? 'bg-gradient-to-b from-gold-light to-gold text-brand-dark shadow-md'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
      </PageHeader>

      {tabs.map((t) => (
        <div key={t.id} id={`panel-${t.id}`} role="tabpanel" aria-labelledby={`tab-${t.id}`} hidden={active !== t.id} className="tab-fade">
          {t.content}
        </div>
      ))}
    </>
  )
}
