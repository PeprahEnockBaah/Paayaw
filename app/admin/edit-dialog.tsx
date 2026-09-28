'use client'

import { useEffect, useRef } from 'react'
import { useFormStatus } from 'react-dom'

function SaveButton() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" disabled={pending} className="btn-primary !px-6 !py-2.5 disabled:opacity-60">
      {pending ? 'Saving…' : 'Save changes'}
    </button>
  )
}

/** Calls `onDone` when the form's save finishes (pending goes from true to false). */
function CloseWhenDone({ onDone }: { onDone: () => void }) {
  const { pending } = useFormStatus()
  const wasPending = useRef(false)
  useEffect(() => {
    if (wasPending.current && !pending) onDone()
    wasPending.current = pending
  }, [pending, onDone])
  return null
}

/**
 * "Edit" button that opens a popup form pre-filled with an item's current values.
 * Closing without saving (Cancel, Esc, or clicking outside) discards the edits.
 */
export default function EditDialog({
  title,
  action,
  hidden,
  children,
}: {
  title: string
  action: (formData: FormData) => void | Promise<void>
  /** Values sent with the form but not shown (e.g. the item's id). */
  hidden: Record<string, string>
  children: React.ReactNode
}) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  // Reset right away (the dialog's own close event also resets, covering Esc).
  const close = () => {
    formRef.current?.reset()
    dialogRef.current?.close()
  }

  return (
    <>
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        className="text-xs font-bold px-3 py-1.5 rounded-lg bg-brand-pale text-brand-dark hover:bg-brand-light/20 transition-colors"
      >
        Edit
      </button>

      <dialog
        ref={dialogRef}
        onClick={(e) => e.target === dialogRef.current && close()}
        onClose={() => formRef.current?.reset()}
        className="confirm-dialog w-[calc(100%-2rem)] max-w-lg rounded-2xl p-0 shadow-2xl backdrop:bg-black/50 backdrop:backdrop-blur-sm"
      >
        <form ref={formRef} action={action} className="p-6 space-y-4 text-left">
          {Object.entries(hidden).map(([name, value]) => (
            <input key={name} type="hidden" name={name} value={value} />
          ))}
          <div className="flex items-start justify-between gap-4">
            <h3 className="font-heading text-xl font-bold text-brand-dark">{title}</h3>
            <button type="button" onClick={close} aria-label="Close" className="text-2xl leading-none text-ink-soft hover:text-ink">
              ×
            </button>
          </div>
          {children}
          {/* The page updates in place after saving, so close the popup ourselves
              (otherwise it would stay open and hide the success message). */}
          <CloseWhenDone onDone={() => dialogRef.current?.close()} />
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={close}
              className="px-5 py-2.5 rounded-full text-sm font-bold border-2 border-brand-main/30 text-brand-dark hover:bg-brand-pale transition-colors"
            >
              Cancel
            </button>
            <SaveButton />
          </div>
        </form>
      </dialog>
    </>
  )
}
