'use client'

import { useRef } from 'react'
import { useFormStatus } from 'react-dom'
import { createTenet } from './actions'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" disabled={pending} className="btn-primary disabled:opacity-60">
      {pending ? 'Saving…' : 'Add Tenet'}
    </button>
  )
}

const inputStyle = { borderColor: 'rgba(14,90,69,0.2)', color: '#1c2a25' } as const
const inputClass = 'w-full px-4 py-2.5 rounded-lg border outline-none focus:ring-2'

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-xs font-bold mb-1" style={{ color: 'var(--brand-dark)' }}>
      {children}
    </label>
  )
}

export default function TenetForm() {
  const formRef = useRef<HTMLFormElement>(null)

  return (
    <form
      ref={formRef}
      action={async (fd) => {
        await createTenet(fd)
        formRef.current?.reset()
      }}
      className="space-y-4"
    >
      <div>
        <Label>Title *</Label>
        <input name="title" required maxLength={100} placeholder="e.g. The Holy Spirit" className={inputClass} style={inputStyle} />
      </div>
      <div>
        <Label>What we believe *</Label>
        <textarea
          name="body"
          required
          rows={3}
          maxLength={1000}
          placeholder="e.g. We believe in the present ministry of the Holy Spirit…"
          className={`${inputClass} resize-y`}
          style={inputStyle}
        />
      </div>
      <p className="text-xs" style={{ color: '#66736d' }}>New tenets go to the end of the list. Use the arrows to reorder.</p>
      <SubmitButton />
    </form>
  )
}
