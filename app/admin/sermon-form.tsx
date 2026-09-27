'use client'

import { useRef } from 'react'
import { useFormStatus } from 'react-dom'
import { createSermon } from './actions'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" disabled={pending} className="btn-primary disabled:opacity-60">
      {pending ? 'Adding…' : 'Add Sermon'}
    </button>
  )
}

const inputStyle = { borderColor: 'rgba(150,112,15,0.2)', color: '#2b2620' } as const
const inputClass = 'w-full px-4 py-2.5 rounded-lg border outline-none focus:ring-2'

export default function SermonForm() {
  const formRef = useRef<HTMLFormElement>(null)

  return (
    <form
      ref={formRef}
      action={async (fd) => {
        await createSermon(fd)
        formRef.current?.reset()
      }}
      className="space-y-4"
    >
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold mb-1" style={{ color: 'var(--brand-dark)' }}>
            Audiomack link *
          </label>
          <input
            name="audiomack_url"
            type="url"
            required
            placeholder="https://audiomack.com/…/song/…"
            className={inputClass}
            style={inputStyle}
          />
        </div>
        <div>
          <label className="block text-xs font-bold mb-1" style={{ color: 'var(--brand-dark)' }}>
            Sermon title *
          </label>
          <input name="title" required placeholder="e.g. The Hour is Now" className={inputClass} style={inputStyle} />
        </div>
      </div>
      <p className="text-xs" style={{ color: '#6f675c' }}>
        On Audiomack, open the sermon, tap <strong>Share → Copy link</strong>, and paste it here.
      </p>
      <SubmitButton />
    </form>
  )
}
