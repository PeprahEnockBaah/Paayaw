'use client'

import { useState } from 'react'

export type LinkOption = { label: string; url: string }

const fieldClass =
  'w-full px-3.5 py-2.5 rounded-lg border border-brand-main/20 bg-white text-ink outline-none focus:border-brand-main focus:ring-2 focus:ring-brand-main/15'

const NONE = ''
const OTHER = '__other__'

/**
 * Where a slide's button goes: no button, one of the site's order pages, or any other link.
 * Submits the chosen address as `button_url`.
 */
export default function ButtonLinkField({ options, defaultUrl }: { options: LinkOption[]; defaultUrl?: string | null }) {
  const initial = !defaultUrl ? NONE : options.some((o) => o.url === defaultUrl) ? defaultUrl : OTHER
  const [choice, setChoice] = useState(initial)
  const [other, setOther] = useState(initial === OTHER ? defaultUrl || '' : '')

  return (
    <div className="space-y-2">
      <label className="block">
        <span className="block text-xs font-bold mb-1 text-brand-dark">Button on this slide</span>
        <select value={choice} onChange={(e) => setChoice(e.target.value)} className={fieldClass}>
          <option value={NONE}>No button</option>
          {options.length > 0 && (
            <optgroup label="Order page on this website">
              {options.map((o) => (
                <option key={o.url} value={o.url}>
                  {o.label}
                </option>
              ))}
            </optgroup>
          )}
          <option value={OTHER}>Other link…</option>
        </select>
      </label>
      {choice !== NONE && choice !== OTHER && (
        <p className="text-xs text-ink-soft">
          Links to{' '}
          <a href={choice} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-main underline break-all">
            {choice}
          </a>{' '}
          (opens in a new tab so you can check it)
        </p>
      )}
      {choice === OTHER && (
        <input
          value={other}
          onChange={(e) => setOther(e.target.value)}
          placeholder="e.g. amazon.com/… or /events"
          aria-label="Button link"
          className={fieldClass}
        />
      )}
      <input type="hidden" name="button_url" value={choice === OTHER ? other : choice} />
    </div>
  )
}
