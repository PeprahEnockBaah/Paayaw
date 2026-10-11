'use client'

import { useRef } from 'react'
import { useFormStatus } from 'react-dom'
import { createLeader } from './actions'
import { LEADER_GROUPS } from '@/lib/leader-groups'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" disabled={pending} className="btn-primary disabled:opacity-60">
      {pending ? 'Uploading…' : 'Add'}
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

export default function LeaderForm() {
  const formRef = useRef<HTMLFormElement>(null)

  return (
    <form
      ref={formRef}
      action={async (fd) => {
        await createLeader(fd)
        formRef.current?.reset()
      }}
      className="space-y-4"
    >
      <div>
        <Label>Show under *</Label>
        <div className="flex gap-4">
          {LEADER_GROUPS.map((g, i) => (
            <label key={g} className="flex items-center gap-2 text-sm font-semibold cursor-pointer" style={{ color: 'var(--brand-dark)' }}>
              <input type="radio" name="team" value={g} defaultChecked={i === 0} required className="accent-[var(--brand-main)]" />
              {g} <span className="font-normal" style={{ color: '#66736d' }}>({i === 0 ? 'left side' : 'right side'})</span>
            </label>
          ))}
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label>Name *</Label>
          <input name="name" required maxLength={100} placeholder="e.g. Elder Samuel Asante" className={inputClass} style={inputStyle} />
        </div>
        <div>
          <Label>Role / title *</Label>
          <input name="role" required maxLength={100} placeholder="e.g. Chairman, Governing Council" className={inputClass} style={inputStyle} />
        </div>
      </div>
      <div>
        <Label>Photo *</Label>
        <input
          type="file"
          name="image"
          accept="image/*"
          required
          className="w-full text-sm file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-brand-pale file:text-brand-dark file:font-semibold"
        />
      </div>
      <p className="text-xs" style={{ color: '#66736d' }}>
        Photos are shown in a circle, so a head-and-shoulders picture works best. New people go to the end of their list.
      </p>
      <SubmitButton />
    </form>
  )
}
