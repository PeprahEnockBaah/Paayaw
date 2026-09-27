import FitImage from '@/components/FitImage'
import Link from 'next/link'

export const metadata = { title: 'What We Do – Gideon Peprah Ministries' }

const ministries = [
  {
    icon: '📖',
    title: 'Evangelism & Church Planting',
    body: 'We are actively planting churches and conducting evangelism campaigns in unreached communities across the nation and beyond, bringing the saving message of Jesus Christ to every corner.',
    img: '/images/V_169.jpg',
  },
  {
    icon: '🏫',
    title: 'Education & Youth Development',
    body: 'GPM invests in the next generation through educational scholarships, school renovation projects, and youth discipleship programs that equip young people for life and ministry.',
    img: '/images/V_171.jpg',
  },
  {
    icon: '🤲',
    title: 'Community Outreach',
    body: 'Through our "Remember Them" initiative, we reach out to the vulnerable, the poor, and the marginalized with food, medical care, and the love of Christ in practical action.',
    img: '/images/V_196.jpg',
  },
  {
    icon: '🎙️',
    title: 'Teaching & Discipleship',
    body: 'We produce books, audio messages, and video teachings that build up believers in their faith, equipping them to live for God in every area of their lives.',
    img: '/images/V_187.jpg',
  },
]

export default function WhatWeDoPage() {
  return (
    <>
      <section
        className="relative flex items-center justify-center text-white text-center px-6 py-14 sm:py-20 lg:py-28"
        style={{ background: 'linear-gradient(160deg, var(--brand-dark) 0%, #96700f 100%)' }}
      >
        <div className="relative z-10">
          <p className="text-xs tracking-[4px] uppercase font-bold mb-4" style={{ color: 'var(--gold-light)' }}>Our Mission in Action</p>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">What We Do</h1>
          <div className="w-16 h-1 mx-auto" style={{ background: 'var(--gold)' }} />
        </div>
      </section>
      <div className="gold-bar" />

      <section className="max-w-7xl mx-auto px-6 py-14 sm:py-20">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="section-title mb-4">Kingdom Work in Every Sphere</h2>
          <div className="gold-underline mb-6" />
          <p className="leading-relaxed" style={{ color: '#5c554c' }}>
            GPM is committed to the holistic transformation of individuals and communities through the Word of God. Our ministry encompasses evangelism, education, compassion, and discipleship.
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
                <p className="text-base leading-[1.85]" style={{ color: '#5c554c' }}>{m.body}</p>
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
      <section style={{ background: 'var(--brand-pale)' }} className="py-14 sm:py-20 px-6 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="section-title mb-4">Partner With Us</h2>
          <div className="gold-underline mb-6" />
          <p className="mb-8 leading-relaxed" style={{ color: '#5c554c' }}>
            Your partnership enables us to continue this vital work. Join us as we advance the Kingdom of God together.
          </p>
          <Link href="/get-involved" className="btn-primary">Become a Partner</Link>
        </div>
      </section>
    </>
  )
}
