import Link from 'next/link'
import EventImage from './event-image'
import { getEvents, splitDate } from '@/lib/events'

export const metadata = { title: 'Events – Gideon Peprah Ministries' }
export const dynamic = 'force-dynamic'

export default async function EventsPage() {
  const events = await getEvents()

  return (
    <>
      <section
        className="relative flex items-center justify-center text-white text-center px-6 py-14 sm:py-20 lg:py-28"
        style={{ background: 'linear-gradient(160deg, var(--brand-dark) 0%, #0e5a45 100%)' }}
      >
        <div className="relative z-10">
          <p className="text-xs tracking-[4px] uppercase font-bold mb-4" style={{ color: 'var(--gold-light)' }}>
            What's Coming Up
          </p>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">Events</h1>
          <div className="w-16 h-1 mx-auto" style={{ background: 'var(--brand-soft)' }} />
        </div>
      </section>
      <div className="gold-bar" />

      <section className="max-w-7xl mx-auto px-6 py-14 sm:py-20">
        {events.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="font-heading text-2xl font-bold mb-3" style={{ color: 'var(--brand-dark)' }}>
              No Upcoming Events
            </h3>
            <p className="text-sm" style={{ color: '#66736d' }}>
              Check back soon — new events will be posted here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((e) => {
              const d = splitDate(e.event_date)
              return (
                <div key={e.id} className="bg-white rounded-xl overflow-hidden shadow-md card-hover flex flex-col">
                  <div className="relative">
                    <EventImage src={e.image_url} title={e.title} />
                    {/* Date badge */}
                    <div className="absolute top-3 left-3 flex flex-col items-center justify-center rounded-lg px-3 py-1.5 bg-white shadow-md min-w-[56px]">
                      <span className="text-2xl font-black font-heading leading-none" style={{ color: 'var(--brand-dark)' }}>
                        {d.day}
                      </span>
                      <span className="text-[10px] font-bold tracking-widest uppercase text-brand-main">
                        {d.month} {d.year}
                      </span>
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    {e.tag && (
                      <span className="text-[10px] font-bold tracking-widest uppercase text-brand-main">{e.tag}</span>
                    )}
                    <h3 className="font-heading font-bold text-lg mt-1 mb-2" style={{ color: 'var(--brand-dark)' }}>{e.title}</h3>
                    {(e.location || e.time) && (
                      <div className="space-y-0.5 mb-2 text-xs" style={{ color: '#66736d' }}>
                        {e.location && <p>📍 {e.location}</p>}
                        {e.time && <p>🕐 {e.time}</p>}
                      </div>
                    )}
                    {e.description && (
                      <p className="text-xs leading-relaxed mb-4" style={{ color: '#66736d' }}>{e.description}</p>
                    )}
                    <Link href="/contact" className="mt-auto text-xs font-bold" style={{ color: 'var(--brand-main)' }}>
                      Register / Learn More →
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <div className="text-center mt-16 p-10 rounded-2xl bg-paper">
          <h3 className="font-heading text-2xl font-bold mb-3" style={{ color: 'var(--brand-dark)' }}>
            Don't Miss an Event
          </h3>
          <p className="text-sm mb-6" style={{ color: '#66736d' }}>
            Subscribe to our newsletter to stay informed about upcoming events, services, and ministry updates.
          </p>
          <Link href="/contact" className="btn-primary">Contact Us to Stay Connected</Link>
        </div>
      </section>
    </>
  )
}
