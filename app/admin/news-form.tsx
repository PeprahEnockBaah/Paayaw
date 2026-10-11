'use client'

import { useRef } from 'react'
import { useFormStatus } from 'react-dom'
import { createNews } from './actions'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" disabled={pending} className="btn-primary disabled:opacity-60">
      {pending ? 'Uploading…' : 'Add Update'}
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

export default function NewsForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const today = new Date().toISOString().slice(0, 10)

  return (
    <form
      ref={formRef}
      action={async (fd) => {
        await createNews(fd)
        formRef.current?.reset()
      }}
      className="space-y-4"
    >
      <div>
        <Label>Headline *</Label>
        <input name="title" required maxLength={200} placeholder="e.g. GPM Evangelism Campaign Reaches Thousands" className={inputClass} style={inputStyle} />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label>Image *</Label>
          <input
            type="file"
            name="image"
            accept="image/*"
            required
            className="w-full text-sm file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-brand-pale file:text-brand-dark file:font-semibold"
          />
        </div>
        <div>
          <Label>Date *</Label>
          <input name="news_date" type="date" required defaultValue={today} className={inputClass} style={inputStyle} />
        </div>
      </div>
      <div>
        <Label>Full story (optional)</Label>
        <textarea
          name="body"
          rows={5}
          placeholder="Write the full update here. If you do, the update gets its own page that opens when people click it."
          className={`${inputClass} resize-y`}
          style={inputStyle}
        />
      </div>
      <div>
        <Label>&ldquo;Read more&rdquo; link (optional)</Label>
        <input name="link_url" placeholder="e.g. /media or youtube.com/…" className={inputClass} style={inputStyle} />
      </div>
      <p className="text-xs" style={{ color: '#66736d' }}>
        With no story, clicking the update goes straight to this link. The homepage shows the first 4 updates;
        all of them are on the News &amp; Updates page. Landscape photos work best.
      </p>
      <SubmitButton />
    </form>
  )
}
