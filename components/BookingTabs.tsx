import Link from 'next/link'

const TABS = [
  { href: '/book-the-prophet', label: 'Invite to Minister' },
  { href: '/prophetic-insight', label: '1-on-1 Counselling' },
] as const

/** Tabs above the form for switching between Book the Prophet and 1-on-1 Counselling (two separate pages). */
export default function BookingTabs({ current }: { current: (typeof TABS)[number]['href'] }) {
  return (
    <nav aria-label="Booking options" className="flex flex-wrap gap-2 mb-4">
      {TABS.map((t) => (
        <Link
          key={t.href}
          href={t.href}
          aria-current={current === t.href ? 'page' : undefined}
          className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${
            current === t.href
              ? 'bg-brand-main text-white shadow-md'
              : 'bg-white text-brand-dark border-2 border-brand-main/20 hover:border-brand-main'
          }`}
        >
          {t.label}
        </Link>
      ))}
    </nav>
  )
}
