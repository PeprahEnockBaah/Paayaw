import FitImage from '@/components/FitImage'
import Link from 'next/link'
import { getBooks, getSermons, audiomackEmbedUrl, AUDIOMACK_PROFILE, type Book } from '@/lib/resources'
import { formatMoney } from '@/lib/giving'
import { orderPath } from '@/lib/order-settings'
import PageHeader from '@/components/PageHeader'

export const metadata = { title: 'Resources – Gideon Peprah Ministries' }

// Books and sermons are managed from /admin. Re-check at most once a minute;
// admin changes also refresh this page immediately. A section with nothing
// uploaded is hidden.
export const revalidate = 60

const BOOK_SECTIONS = [
  { category: 'Books', title: 'Books' },
  { category: 'Devotionals', title: 'Daily Devotionals' },
]

function BookCard({ b }: { b: Book }) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md card-hover">
      {/* For books that can be ordered, the cover and title also open the order page. */}
      {b.price_minor ? (
        <Link href={orderPath(b.id)} tabIndex={-1} aria-hidden className="block">
          <FitImage
            src={b.image_url}
            alt={b.title}
            className="aspect-[4/3]"
            sizes="(min-width: 1024px) 300px, (min-width: 640px) 50vw, 100vw"
          />
        </Link>
      ) : (
        <FitImage
          src={b.image_url}
          alt={b.title}
          className="aspect-[4/3]"
          sizes="(min-width: 1024px) 300px, (min-width: 640px) 50vw, 100vw"
        />
      )}
      <div className="p-5">
        <span className="text-[10px] font-bold tracking-widest uppercase text-brand-main">
          {b.category}
        </span>
        <h3 className="font-heading font-bold text-lg mt-1 mb-2" style={{ color: 'var(--brand-dark)' }}>
          {b.price_minor ? (
            <Link href={orderPath(b.id)} className="hover:underline">{b.title}</Link>
          ) : (
            b.title
          )}
        </h3>
        <p className="text-sm leading-relaxed mb-4" style={{ color: '#66736d' }}>{b.description}</p>
        {b.price_minor ? (
          <Link href={orderPath(b.id)} className="inline-flex items-center gap-2 text-sm font-bold" style={{ color: 'var(--brand-main)' }}>
            Order Now · {formatMoney(b.price_minor / 100, 'GHS')} →
          </Link>
        ) : b.link_url ? (
          <a
            href={b.link_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-bold"
            style={{ color: 'var(--brand-main)' }}
          >
            Get a Copy →
          </a>
        ) : (
          <Link href="/contact" className="text-sm font-bold" style={{ color: 'var(--brand-main)' }}>
            Request a Copy →
          </Link>
        )}
      </div>
    </div>
  )
}

export default async function ResourcesPage() {
  const [books, sermons] = await Promise.all([getBooks(), getSermons()])

  return (
    <>
      <PageHeader eyebrow="Grow Your Faith" title="Resources" />

      {/* Books and devotionals, each in its own section */}
      {BOOK_SECTIONS.map(({ category, title }) => {
        const items = books.filter((b) => b.category === category)
        if (!items.length) return null
        return (
          <section key={category} className="page-container py-14 sm:py-20">
            <div className="text-center mb-12">
              <h2 className="section-title">{title}</h2>
              <div className="title-underline" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {items.map((b) => <BookCard key={b.id} b={b} />)}
            </div>
          </section>
        )
      })}

      {/* Audio Sermons */}
      {sermons.length > 0 && (
        <section id="audio-sermons" className="bg-paper py-14 sm:py-20 px-6 scroll-mt-28">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="section-title">Audio Sermons</h2>
              <div className="title-underline" />
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
      )}

      {!books.length && !sermons.length && (
        <p className="page-container py-20 text-center" style={{ color: '#66736d' }}>
          New resources are coming soon.
        </p>
      )}
    </>
  )
}
