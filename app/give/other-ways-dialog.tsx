'use client'

import { useRef } from 'react'
import CopyButton from './copy-button'

type Row = { label: string; value: string; copy?: boolean }

/** "Other ways to give" link that opens MoMo / bank details in a popup, so the page needs no scrolling. */
export default function OtherWaysDialog({ groups }: { groups: { title: string; rows: Row[] }[] }) {
  const ref = useRef<HTMLDialogElement>(null)
  const close = () => ref.current?.close()

  return (
    <>
      <button
        type="button"
        onClick={() => ref.current?.showModal()}
        className="font-semibold text-brand-main underline underline-offset-2 hover:text-brand-dark"
      >
        Other ways to give
      </button>

      <dialog
        ref={ref}
        onClick={(e) => e.target === ref.current && close()}
        className="confirm-dialog w-[calc(100%-2rem)] max-w-md rounded-2xl p-0 shadow-2xl backdrop:bg-black/50 backdrop:backdrop-blur-sm"
      >
        <div className="p-6">
          <div className="flex items-start justify-between gap-4 mb-1">
            <h2 className="font-heading text-xl font-bold text-brand-dark">Other ways to give</h2>
            <button type="button" onClick={close} aria-label="Close" className="text-2xl leading-none text-ink-soft hover:text-ink">
              ×
            </button>
          </div>
          <p className="text-sm text-ink-soft mb-4">Send directly and use your name as the reference.</p>
          {groups.map((g) => (
            <div key={g.title} className="mb-4 last:mb-0">
              <h3 className="text-xs font-bold text-brand-main uppercase tracking-wider mb-1">{g.title}</h3>
              <dl>
                {g.rows
                  .filter((r) => r.value)
                  .map((r) => (
                    <div key={r.label} className="flex items-center justify-between gap-3 py-2 border-b border-brand-main/10 last:border-0">
                      <div className="min-w-0">
                        <dt className="text-xs text-ink-soft">{r.label}</dt>
                        <dd className="font-semibold text-ink break-words">{r.value}</dd>
                      </div>
                      {r.copy && <CopyButton value={r.value} label={r.label} />}
                    </div>
                  ))}
              </dl>
            </div>
          ))}
        </div>
      </dialog>
    </>
  )
}
