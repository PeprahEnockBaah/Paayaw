import FitImage from '@/components/FitImage'
import Link from 'next/link'
import { getBooks, getSermons, audiomackEmbedUrl, AUDIOMACK_PROFILE } from '@/lib/resources'

export const metadata = { title: 'Resources – Gideon Peprah Ministries' }

// Books and sermons are managed from /admin. Re-check at most once a minute;
// admin changes also refresh this page immediately.
export const revalidate = 60

export default async function ResourcesPage() {
  const [books, sermons] = await Promise.all([getBooks(), getSermons()])

  return (
    <>
      <section
        className="relative flex items-center justify-center text-white text-center px-6 py-14 sm:py-20 lg:py-28"
        style={{ background: 'linear-gradient(160deg, var(--brand-dark) 0%, #96700f 100%)' }}
      >
        <div className="relative z-10">
          <p className="text-xs tracking-[4px] uppercase font-bold mb-4" style={{ color: 'var(--gold-light)' }}>Grow Your Faith</p>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">Resources</h1>
          <div className="w-16 h-1 mx-auto" style={{ background: 'var(--gold)' }} />
        </div>
      </section>
      <div className="gold-bar" />

      {/* Books */}
      <section className="max-w-7xl mx-auto px-6 py-14 sm:py-20">
        <div className="text-center mb-12">
          <h2 className="section-title">Books &amp; Devotionals</h2>
          <div className="gold-underline" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {books.map((b) => (
            <div key={b.id} className="bg-white rounded-xl overflow-hidden shadow-md card-hover">
              <FitImage
                src={b.image_url}
                alt={b.title}
                className="aspect-[4/3]"
                sizes="(min-width: 1024px) 300px, (min-width: 640px) 50vw, 100vw"
              />
              <div className="p-5">
                <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: 'var(--gold-dark)' }}>
                  {b.category}
                </span>
                <h3 className="font-heading font-bold text-lg mt-1 mb-2" style={{ color: 'var(--brand-dark)' }}>{b.title}</h3>
                <p className="text-xs leading-relaxed mb-4" style={{ color: '#6f675c' }}>{b.description}</p>
                {b.link_url ? (
                  <a
                    href={b.link_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold"
                    style={{ color: 'var(--brand-main)' }}
                  >
                    Get a Copy →
                  </a>
                ) : (
                  <Link href="/contact" className="text-xs font-bold" style={{ color: 'var(--brand-main)' }}>
                    Request a Copy →
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Audio Sermons */}
      <section id="audio-sermons" style={{ background: 'var(--brand-pale)' }} className="py-14 sm:py-20 px-6 scroll-mt-28">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="section-title">Audio Sermons</h2>
            <div className="gold-underline" />
          </div>
          <div className="space-y-6">
            {sermons.map((s) => (
              <iframe
                key={s.id}
                src={audiomackEmbedUrl(s.audiomack_url)}
                title={`${s.title} – audio sermon by Prophet Gideon Peprah`}
                className="w-full rounded-xl shadow-sm bg-white"
                height={252}
                loading="lazy"
                allow="autoplay"
                style={{ border: 0 }}
              />
            ))}
          </div>
          <div className="text-center mt-10">
            <a
              href={AUDIOMACK_PROFILE}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline-brand"
            >
              More Sermons on Audiomack
            </a>
          </div>
        </div>
      </section>

      {/* Bible Study */}
      <section className="max-w-7xl mx-auto px-6 py-14 sm:py-20 text-center">
        <h2 className="section-title mb-4">Bible Study Guides</h2>
        <div className="gold-underline mb-6" />
        <p className="max-w-xl mx-auto mb-10 leading-relaxed" style={{ color: '#5c554c' }}>
          Our Bible study materials are designed to help individuals and small groups go deeper into the Word of God, discover its truth, and apply it to everyday life.
        </p>
        <Link href="/contact" className="btn-primary">Request Study Materials</Link>
      </section>
    </>
  )
}
