import { moveItem } from './actions'

export const MUTED = '#66736d'
export const cardStyle = { border: '1px solid rgba(14,90,69,0.1)' } as const

/** Success / error banner shown after an admin action. */
export function Notice({ ok, children }: { ok: boolean; children: React.ReactNode }) {
  return (
    <p className={`text-sm mb-4 px-4 py-2.5 rounded-lg ${ok ? 'bg-brand-pale text-brand-dark' : 'bg-red-50 text-red-700'}`}>
      {ok && '✓ '}
      {children}
    </p>
  )
}

/** Section heading at the top of an admin tab. */
export function SectionHeader({ title, hint }: { id?: string; title: string; hint: string }) {
  return (
    <>
      <h2 className="font-heading text-2xl font-bold mb-1" style={{ color: 'var(--brand-dark)' }}>
        {title}
      </h2>
      <p className="text-sm mb-5" style={{ color: MUTED }}>
        {hint}
      </p>
    </>
  )
}

/** Shown when a section's table hasn't been created in Supabase yet. */
export function NotSetUp({ what }: { what: string }) {
  return (
    <p className="text-sm px-4 py-3 rounded-lg bg-red-50 text-red-700">
      {what} isn&apos;t set up in the database yet. Run the latest <code>supabase-schema.sql</code> in the Supabase
      SQL Editor. Until then the website shows the built-in content.
    </p>
  )
}

/**
 * Collapsible card wrapping an "add" form. Closed by default so the list is visible
 * without scrolling; opens by itself when there's an error to fix.
 */
export function AddCard({ title, open, children }: { title: string; open?: boolean; children: React.ReactNode }) {
  return (
    <details open={open} className="group bg-white rounded-2xl shadow-sm mb-6" style={cardStyle}>
      <summary className="list-none [&::-webkit-details-marker]:hidden cursor-pointer select-none flex items-center gap-3 px-5 sm:px-6 py-4">
        <span className="w-8 h-8 rounded-full bg-brand-main text-white flex items-center justify-center text-xl leading-none transition-transform group-open:rotate-45">
          +
        </span>
        <span className="font-heading text-lg font-bold" style={{ color: 'var(--brand-dark)' }}>
          {title}
        </span>
        <span className="ml-auto text-xs font-semibold text-brand-main group-open:hidden">Open form</span>
        <span className="ml-auto text-xs font-semibold hidden group-open:inline" style={{ color: MUTED }}>Close</span>
      </summary>
      <div className="px-5 sm:px-6 pb-6 pt-1 border-t border-brand-main/10">
        <div className="pt-4">{children}</div>
      </div>
    </details>
  )
}

/** ↑ / ↓ buttons that move an item earlier or later in its list. */
export function MoveButtons({
  table,
  id,
  index,
  count,
}: {
  table: 'slides' | 'sermons' | 'books'
  id: string
  index: number
  count: number
}) {
  return (
    <div className="flex items-center gap-1 flex-shrink-0">
      {(['up', 'down'] as const).map((dir) => (
        <form key={dir} action={moveItem}>
          <input type="hidden" name="table" value={table} />
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="direction" value={dir} />
          <button
            type="submit"
            disabled={dir === 'up' ? index === 0 : index === count - 1}
            aria-label={dir === 'up' ? 'Move earlier' : 'Move later'}
            title={dir === 'up' ? 'Move earlier' : 'Move later'}
            className="w-8 h-8 rounded-lg bg-brand-pale text-brand-dark font-bold hover:bg-brand-light/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {dir === 'up' ? '↑' : '↓'}
          </button>
        </form>
      ))}
    </div>
  )
}

// ── Form fields for the edit popups ──────────────────────────

const fieldClass =
  'w-full px-3.5 py-2.5 rounded-lg border border-brand-main/20 bg-white text-ink outline-none focus:border-brand-main focus:ring-2 focus:ring-brand-main/15'

function FieldLabel({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-bold mb-1 text-brand-dark">{label}</span>
      {children}
    </label>
  )
}

export function TextField({ label, name, defaultValue, required, type = 'text', placeholder }: {
  label: string; name: string; defaultValue?: string | null; required?: boolean; type?: string; placeholder?: string
}) {
  return (
    <FieldLabel label={label}>
      <input name={name} type={type} defaultValue={defaultValue ?? ''} required={required} placeholder={placeholder} className={fieldClass} />
    </FieldLabel>
  )
}

export function TextArea({ label, name, defaultValue, rows = 3 }: { label: string; name: string; defaultValue?: string | null; rows?: number }) {
  return (
    <FieldLabel label={label}>
      <textarea name={name} rows={rows} defaultValue={defaultValue ?? ''} className={`${fieldClass} resize-none`} />
    </FieldLabel>
  )
}

export function SelectField({ label, name, defaultValue, options }: {
  label: string; name: string; defaultValue?: string | null; options: readonly string[]
}) {
  return (
    <FieldLabel label={label}>
      <select name={name} defaultValue={defaultValue ?? options[0]} className={fieldClass}>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </FieldLabel>
  )
}

/** Shows the current image with an optional file picker to replace it. */
export function ImageField({ label, currentUrl }: { label: string; currentUrl?: string | null }) {
  return (
    <FieldLabel label={label}>
      <div className="flex items-center gap-3">
        {currentUrl && <img src={currentUrl} alt="" className="w-20 h-14 rounded-md object-cover bg-gray-100 flex-shrink-0" />}
        <input
          type="file"
          name="image"
          accept="image/*"
          className="w-full text-sm file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-brand-pale file:text-brand-dark file:font-semibold"
        />
      </div>
      <span className="block mt-1 text-[11px] text-ink-soft">Leave empty to keep the current image.</span>
    </FieldLabel>
  )
}

export function Checkbox({ name, defaultChecked, children }: { name: string; defaultChecked?: boolean; children: React.ReactNode }) {
  return (
    <label className="flex items-start gap-2.5 text-sm text-brand-dark cursor-pointer">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="mt-1 accent-[var(--brand-main)]" />
      <span>{children}</span>
    </label>
  )
}
