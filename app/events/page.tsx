import Link from 'next/link'
import { getEvents, splitDate, tagColors } from '@/lib/events'

export const metadata = { title: 'Events – Gideon Peprah Ministries' }
export const dynamic = 'force-dynamic'

export default async function EventsPage() {
  const events = await getEvents()

  return (
    <>
      <section
        className="relative flex items-center justify-center text-white text-center px-6 py-14 sm:py-20 lg:py-28"
        style={{ background: 'linear-gradient(160deg, var(--brand-dark) 0%, #96700f 100%)' }}
      >
        <div className="relative z-10">
          <p className="text-xs tracking-[4px] uppercase font-bold mb-4" style={{ color: 'var(--gold-light)' }}>
            What's Coming Up
          </p>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">Events</h1>
          <div className="w-16 h-1 mx-auto" style={{ background: 'var(--gold)' }} />
        </div>
      </section>
      <div className="gold-bar" />

      <section className="max-w-5xl mx-auto px-6 py-14 sm:py-20">
        {events.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="font-heading text-2xl font-bold mb-3" style={{ color: 'var(--brand-dark)' }}>
              No Upcoming Events
            </h3>
            <p className="text-sm" style={{ color: '#6f675c' }}>
              Check back soon — new events will be posted here.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {events.map((e) => {
              const d = splitDate(e.event_date)
              return (
                <div
                  key={e.id}
                  className="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col sm:flex-row transition-shadow hover:shadow-lg"
                  style={{ border: '1px solid rgba(150,112,15,0.1)' }}
                >
                  {/* Date block */}
                  <div
                    className="flex flex-col items-center justify-center px-8 py-6 sm:py-0 flex-shrink-0 text-white"
                    style={{ background: 'var(--brand-dark)', minWidth: '110px' }}
                  >
                    <span className="text-4xl font-black font-heading leading-none">{d.day}</span>
                    <span className="text-sm font-bold tracking-widest uppercase mt-1" style={{ color: 'var(--gold-light)' }}>
                      {d.month}
                    </span>
                    <span className="text-xs opacity-60 mt-0.5">{d.year}</span>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1">
                    {e.image_url && (
                      <img
                        src={e.image_url}
                        alt={e.title}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                    )}
                    <div className="flex flex-wrap items-start gap-3 mb-2">
                      <h3 className="font-heading font-bold text-xl" style={{ color: 'var(--brand-dark)' }}>
                        {e.title}
                      </h3>
                      {e.tag && (
                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${tagColors[e.tag] || 'bg-gray-100 text-gray-600'}`}>
                          {e.tag}
                        </span>
                      )}
                    </div>
                    {(e.location || e.time) && (
                      <div className="flex flex-wrap gap-x-6 gap-y-1 mb-3 text-sm" style={{ color: '#6f675c' }}>
                        {e.location && <span>📍 {e.location}</span>}
                        {e.time && <span>🕐 {e.time}</span>}
                      </div>
                    )}
                    {e.description && (
                      <p className="text-sm leading-relaxed" style={{ color: '#6f675c' }}>{e.description}</p>
                    )}
                    <Link
                      href="/contact"
                      className="inline-block mt-4 text-xs font-bold tracking-wide"
                      style={{ color: 'var(--brand-main)' }}
                    >
                      Register / Learn More →
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <div className="text-center mt-16 p-10 rounded-2xl" style={{ background: 'var(--brand-pale)' }}>
          <h3 className="font-heading text-2xl font-bold mb-3" style={{ color: 'var(--brand-dark)' }}>
            Don't Miss an Event
          </h3>
          <p className="text-sm mb-6" style={{ color: '#6f675c' }}>
            Subscribe to our newsletter to stay informed about upcoming events, services, and ministry updates.
          </p>
          <Link href="/contact" className="btn-primary">Contact Us to Stay Connected</Link>
        </div>
      </section>
    </>
  )
}
