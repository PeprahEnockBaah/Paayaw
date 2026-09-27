'use client'

import { useRef } from 'react'
import { useFormStatus } from 'react-dom'
import { createSlide } from './actions'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" disabled={pending} className="btn-primary disabled:opacity-60">
      {pending ? 'Uploading…' : 'Add to Slider'}
    </button>
  )
}

const inputStyle = { borderColor: 'rgba(150,112,15,0.2)', color: '#2b2620' } as const
const inputClass = 'w-full px-4 py-2.5 rounded-lg border outline-none focus:ring-2'

export default function SlideForm() {
  const formRef = useRef<HTMLFormElement>(null)

  return (
    <form
      ref={formRef}
      action={async (fd) => {
        await createSlide(fd)
        formRef.current?.reset()
      }}
      className="space-y-4"
    >
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold mb-1" style={{ color: 'var(--brand-dark)' }}>
            Image *
          </label>
          <input
            type="file"
            name="image"
            accept="image/*"
            required
            className="w-full text-sm file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-brand-pale file:text-brand-dark file:font-semibold"
          />
        </div>
        <div>
          <label className="block text-xs font-bold mb-1" style={{ color: 'var(--brand-dark)' }}>
            Short description
          </label>
          <input
            name="alt"
            placeholder="e.g. Sunday worship service"
            className={inputClass}
            style={inputStyle}
          />
        </div>
      </div>
      <label className="flex items-start gap-2.5 text-sm" style={{ color: 'var(--brand-dark)' }}>
        <input type="checkbox" name="banner" className="mt-1 accent-[var(--brand-main)]" />
        <span>
          <strong>This is a designed banner</strong> (with text or graphics, e.g. a book promo).
          It will be shown whole on phones instead of being cropped.
        </span>
      </label>
      <p className="text-xs" style={{ color: '#6f675c' }}>
        Tips: use landscape photos at least 2000px wide. Banners work best at 3200 × 800 with the
        important content in the middle.
      </p>
      <SubmitButton />
    </form>
  )
}
