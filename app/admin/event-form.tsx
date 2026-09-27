'use client'

import { useRef } from 'react'
import { useFormStatus } from 'react-dom'
import { createEvent } from './actions'

const TAGS = ['Conference', 'Special Service', 'Celebration', 'Outreach', 'Youth', 'Other']

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" disabled={pending} className="btn-primary disabled:opacity-60">
      {pending ? 'Adding…' : 'Add Event'}
    </button>
  )
}

const inputStyle = { borderColor: 'rgba(150,112,15,0.2)', color: '#2b2620' } as const
const inputClass = 'w-full px-4 py-2.5 rounded-lg border outline-none focus:ring-2'

export default function EventForm() {
  const formRef = useRef<HTMLFormElement>(null)

  return (
    <form
      ref={formRef}
      action={async (fd) => {
        await createEvent(fd)
        formRef.current?.reset()
      }}
      className="space-y-4"
    >
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold mb-1" style={{ color: 'var(--brand-dark)' }}>
            Title *
          </label>
          <input name="title" required placeholder="e.g. Youth Camp 2026" className={inputClass} style={inputStyle} />
        </div>
        <div>
          <label className="block text-xs font-bold mb-1" style={{ color: 'var(--brand-dark)' }}>
            Date *
          </label>
          <input type="date" name="event_date" required className={inputClass} style={inputStyle} />
        </div>
        <div>
          <label className="block text-xs font-bold mb-1" style={{ color: 'var(--brand-dark)' }}>
            Location
          </label>
          <input name="location" placeholder="e.g. GPM Main Auditorium" className={inputClass} style={inputStyle} />
        </div>
        <div>
          <label className="block text-xs font-bold mb-1" style={{ color: 'var(--brand-dark)' }}>
            Time
          </label>
          <input name="time" placeholder="e.g. 9:00 AM – 6:00 PM" className={inputClass} style={inputStyle} />
        </div>
        <div>
          <label className="block text-xs font-bold mb-1" style={{ color: 'var(--brand-dark)' }}>
            Category
          </label>
          <select name="tag" defaultValue="Conference" className={inputClass} style={inputStyle}>
            {TAGS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold mb-1" style={{ color: 'var(--brand-dark)' }}>
            Photo / Flyer (optional)
          </label>
          <input
            type="file"
            name="image"
            accept="image/*"
            className="w-full text-sm file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-brand-pale file:text-brand-dark file:font-semibold"
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-bold mb-1" style={{ color: 'var(--brand-dark)' }}>
          Description
        </label>
        <textarea
          name="description"
          rows={3}
          placeholder="What is this event about?"
          className={inputClass}
          style={inputStyle}
        />
      </div>
      <SubmitButton />
    </form>
  )
}
