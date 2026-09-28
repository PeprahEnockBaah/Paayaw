'use client'

import { useRef, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { createSlide } from './actions'
import { DEFAULT_SLIDE_BUTTON } from '@/lib/slides'
import ButtonLinkField, { type LinkOption } from './button-link-field'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" disabled={pending} className="btn-primary disabled:opacity-60">
      {pending ? 'Uploading…' : 'Add to Slider'}
    </button>
  )
}

const inputStyle = { borderColor: 'rgba(14,90,69,0.2)', color: '#1c2a25' } as const
const inputClass = 'w-full px-4 py-2.5 rounded-lg border outline-none focus:ring-2'

export default function SlideForm({ linkOptions }: { linkOptions: LinkOption[] }) {
  const formRef = useRef<HTMLFormElement>(null)
  // Remounts the button picker after each upload (form.reset() doesn't clear its state).
  const [resetKey, setResetKey] = useState(0)

  return (
    <form
      ref={formRef}
      action={async (fd) => {
        await createSlide(fd)
        formRef.current?.reset()
        setResetKey((k) => k + 1)
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
      <div className="grid sm:grid-cols-2 gap-4">
        <ButtonLinkField key={resetKey} options={linkOptions} />
        <div>
          <label className="block text-xs font-bold mb-1" style={{ color: 'var(--brand-dark)' }}>
            Button text
          </label>
          <input
            name="button_label"
            maxLength={30}
            placeholder={DEFAULT_SLIDE_BUTTON}
            className={inputClass}
            style={inputStyle}
          />
        </div>
      </div>
      <p className="text-xs -mt-2" style={{ color: '#66736d' }}>
        For a book or anything that can be ordered, pick its order page and an &ldquo;Order Now&rdquo; button
        appears on this slide only. Each book also gets its own choice here once it has a price (see Books below).
      </p>
      <label className="flex items-start gap-2.5 text-sm" style={{ color: 'var(--brand-dark)' }}>
        <input type="checkbox" name="banner" className="mt-1 accent-[var(--brand-main)]" />
        <span>
          <strong>This is a designed banner</strong> (with text or graphics, e.g. a book promo).
          It will be shown whole on phones instead of being cropped.
        </span>
      </label>
      <p className="text-xs" style={{ color: '#66736d' }}>
        Tips: use landscape photos at least 2000px wide. Banners work best at 3200 × 800 with the
        important content in the middle.
      </p>
      <SubmitButton />
    </form>
  )
}
