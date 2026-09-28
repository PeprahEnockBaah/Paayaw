import FitImage from '@/components/FitImage'
import Link from 'next/link'

export const metadata = { title: 'What We Do – Gideon Peprah Ministries' }

// The four areas named in the Prophet's welcome message. Descriptions are general
// placeholders: replace them with the ministry's actual programmes and details.
const ministries = [
  {
    icon: '🌱',
    title: 'Youth Empowerment',
    body: 'We invest in young people — nurturing their faith, helping them discover their gifts, and giving them the direction and skills to fulfill their God-given destinies.',
    img: '/images/V_171.jpg',
  },
  {
    icon: '🤝',
    title: 'Community Involvement',
    body: 'We stand with the communities we serve, taking an active part in their life and growth and showing the love of Christ in practical, everyday ways.',
    img: '/images/V_61.jpg',
  },
  {
    icon: '🤲',
    title: 'Humanitarian Works',
    body: 'We reach out to the needy, the vulnerable and those in crisis with practical help and care, bringing hope to the hopeless in the name of Jesus.',
    img: '/images/V_196.jpg',
  },
  {
    icon: '❤️',
    title: 'Philanthropy',
    body: 'Through generous giving and partnership, we support people and causes in need, so that the blessings God gives us flow on to others.',
    img: '/images/V_187.jpg',
  },
]

export default function WhatWeDoPage() {
  return (
    <>
      <section
        className="relative flex items-center justify-center text-white text-center px-6 py-14 sm:py-20 lg:py-28"
        style={{ background: 'linear-gradient(160deg, var(--brand-dark) 0%, #0e5a45 100%)' }}
      >
        <div className="relative z-10">
          <p className="text-xs tracking-[4px] uppercase font-bold mb-4" style={{ color: 'var(--gold-light)' }}>Our Mission in Action</p>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">What We Do</h1>
          <div className="w-16 h-1 mx-auto" style={{ background: 'var(--brand-soft)' }} />
        </div>
      </section>
      <div className="gold-bar" />

      <section className="max-w-7xl mx-auto px-6 py-14 sm:py-20">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="section-title mb-4">The Gospel for Soul and Society</h2>
          <div className="title-underline mb-6" />
          <p className="leading-relaxed" style={{ color: '#4f5d57' }}>
            Alongside preaching the Gospel of Jesus Christ, we are committed to youth empowerment, community
            involvement, humanitarian and philanthropy works — because the Gospel must touch both the soul and the
            society.
          </p>
        </div>

        <div className="space-y-20">
          {ministries.map((m, i) => (
            <div key={m.title} className={`grid grid-cols-1 lg:grid-cols-2 gap-14 items-center ${i % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
                 style={{ direction: i % 2 === 1 ? 'rtl' : 'ltr' }}>
              <div style={{ direction: 'ltr' }}>
                <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl mb-5"
                     style={{ background: 'var(--brand-pale)' }}>
                  {m.icon}
                </div>
                <h3 className="font-heading text-3xl font-bold mb-4" style={{ color: 'var(--brand-dark)' }}>{m.title}</h3>
                <p className="text-base leading-[1.85]" style={{ color: '#4f5d57' }}>{m.body}</p>
              </div>
              <div style={{ direction: 'ltr' }}>
                <FitImage
                  src={m.img}
                  alt={m.title}
                  className="aspect-[3/2] rounded-xl shadow-xl"
                  sizes="(min-width: 1024px) 560px, 100vw"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-paper py-14 sm:py-20 px-6 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="section-title mb-4">Partner With Us</h2>
          <div className="title-underline mb-6" />
          <p className="mb-8 leading-relaxed" style={{ color: '#4f5d57' }}>
            Your partnership enables us to continue this vital work. Join us as we advance the Kingdom of God together.
          </p>
          <Link href="/get-involved" className="btn-primary">Become a Partner</Link>
        </div>
      </section>
    </>
  )
}
