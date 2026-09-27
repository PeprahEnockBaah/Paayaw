'use client'

import { useRef } from 'react'
import { useFormStatus } from 'react-dom'
import { createBook } from './actions'
import { BOOK_CATEGORIES } from '@/lib/book-categories'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" disabled={pending} className="btn-primary disabled:opacity-60">
      {pending ? 'Uploading…' : 'Add Book'}
    </button>
  )
}

const inputStyle = { borderColor: 'rgba(150,112,15,0.2)', color: '#2b2620' } as const
const inputClass = 'w-full px-4 py-2.5 rounded-lg border outline-none focus:ring-2'
const labelStyle = { color: 'var(--brand-dark)' } as const

export default function BookForm() {
  const formRef = useRef<HTMLFormElement>(null)

  return (
    <form
      ref={formRef}
      action={async (fd) => {
        await createBook(fd)
        formRef.current?.reset()
      }}
      className="space-y-4"
    >
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold mb-1" style={labelStyle}>
            Title *
          </label>
          <input name="title" required placeholder="e.g. Prophets, Prophecy, and Prophetism" className={inputClass} style={inputStyle} />
        </div>
        <div>
          <label className="block text-xs font-bold mb-1" style={labelStyle}>
            Category
          </label>
          <select name="category" defaultValue="Books" className={inputClass} style={inputStyle}>
            {BOOK_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold mb-1" style={labelStyle}>
            Cover image *
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
          <label className="block text-xs font-bold mb-1" style={labelStyle}>
            &ldquo;Get a Copy&rdquo; link (optional)
          </label>
          <input name="link_url" placeholder="e.g. Amazon or store link" className={inputClass} style={inputStyle} />
        </div>
      </div>
      <div>
        <label className="block text-xs font-bold mb-1" style={labelStyle}>
          Short description
        </label>
        <textarea
          name="description"
          rows={2}
          placeholder="One or two sentences about the book"
          className={inputClass}
          style={inputStyle}
        />
      </div>
      <p className="text-xs" style={{ color: '#6f675c' }}>
        Without a link, the book shows a &ldquo;Request a Copy&rdquo; button that goes to the Contact page.
      </p>
      <SubmitButton />
    </form>
  )
}
