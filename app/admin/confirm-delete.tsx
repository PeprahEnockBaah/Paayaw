'use client'

import { useRef, useState } from 'react'

/**
 * Delete button that opens a styled confirmation popup before submitting to a
 * server action. Uses the native <dialog> element, so Esc closes it and focus
 * stays inside while it's open. Clicking the dimmed background also closes it.
 */
export default function ConfirmDelete({
  action,
  fields,
  title,
  message,
  confirmLabel = 'Delete',
}: {
  action: (formData: FormData) => void | Promise<void>
  fields: Record<string, string>
  title: string
  message: string
  confirmLabel?: string
}) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [pending, setPending] = useState(false)
  const close = () => dialogRef.current?.close()

  return (
    <>
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        className="text-xs font-bold px-3 py-1.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
      >
        Delete
      </button>

      <dialog
        ref={dialogRef}
        onClick={(e) => e.target === dialogRef.current && !pending && close()}
        onCancel={(e) => pending && e.preventDefault()}
        className="confirm-dialog w-[calc(100%-2rem)] max-w-sm rounded-2xl p-0 shadow-2xl backdrop:bg-black/50 backdrop:backdrop-blur-sm"
      >
        <form action={action} onSubmit={() => setPending(true)} className="p-6 text-center">
          {Object.entries(fields).map(([name, value]) => (
            <input key={name} type="hidden" name={name} value={value} />
          ))}

          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
              />
            </svg>
          </div>

          <h3 className="font-heading text-lg font-bold mb-2" style={{ color: 'var(--brand-dark)' }}>
            {title}
          </h3>
          <p className="text-sm leading-relaxed mb-6" style={{ color: '#6f675c' }}>
            {message}
          </p>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={close}
              disabled={pending}
              autoFocus
              className="flex-1 py-2.5 rounded-full text-sm font-bold border-2 border-brand-main/30 text-brand-dark hover:bg-brand-pale transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={pending}
              className="flex-1 py-2.5 rounded-full text-sm font-bold bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-70"
            >
              {pending ? 'Deleting…' : confirmLabel}
            </button>
          </div>
        </form>
      </dialog>
    </>
  )
}
