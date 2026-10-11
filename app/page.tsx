import Link from 'next/link'
import Image from 'next/image'
import FitImage from '@/components/FitImage'
import ImageSlider from '@/components/ImageSlider'
import { getSlides } from '@/lib/slides'
import { getBooks, getSermons, audiomackEmbedUrl, latestBook, type Book } from '@/lib/resources'
import { orderPath } from '@/lib/order-settings'
import { getNews, HOME_NEWS_COUNT } from '@/lib/news'
import NewsCard from '@/components/NewsCard'
import ValorTvPlayer from '@/components/ValorTvPlayer'
import { getLatestVideo } from '@/lib/youtube'

const helpCards = [
  {
    icon: 'M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z',
    title: 'Join',
    body: 'Welcome to GPM. We encourage you to browse through the website and get in touch with us. Together we can do great things for the Kingdom.',
    cta: 'Become a Partner',
    href: '/get-involved',
  },
  {
    icon: 'M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z',
    title: 'Give',
    body: 'It is more blessed to give than to receive. The Lord loves a cheerful giver. "Your prayers and gifts of charity have ascended as a memorial offering before God."',
    cta: 'Give Now',
    href: '/give',
  },
  {
    icon: 'M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z',
    title: 'Watch & Listen',
    body: 'So then faith comes by hearing, and hearing by the Word of God. Access our sermons, teachings, and live broadcasts anytime, anywhere.',
    cta: 'Watch Now',
    href: '/media',
  },
]

// Books and devotionals show the latest uploaded cover from the admin (the photo is used if there are none).
const resources: { label: string; img?: string; audio?: true; href?: string; category?: string }[] = [
  { label: 'Books & Teaching Materials', img: '/images/V_184.jpg', category: 'Books' },
  { label: 'Daily Devotionals', img: '/images/V_166.jpg', category: 'Devotionals' },
  // Shows the latest sermon's player instead of a photo.
  { label: 'Audio Sermons', audio: true, href: '/resources#audio-sermons' },
  { label: 'Bible Study Guides', img: '/images/V_205.jpg' },
]

/** Priced books open their order page; others open the Resources page. */
const bookHref = (b: Book) => (b.price_minor ? orderPath(b.id) : '/resources')

function Arrow() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  )
}

// Re-check the slider and news at most once a minute; admin changes also refresh it immediately.
export const revalidate = 60

export default async function HomePage() {
  const [slides, sermons, news, books, latestVideo] = await Promise.all([
    getSlides(),
    getSermons(),
    getNews(),
    getBooks(),
    getLatestVideo(),
  ])
  const latestSermon = sermons[0]

  return (
    <>
      {/* ── HERO ── */}
      <section className="bg-paper">
        <ImageSlider
          slides={slides}
          className="w-full aspect-[3/2] md:aspect-auto md:h-[60vh] md:min-h-[360px] md:max-h-[640px]"
        />
      </section>

      {/* ── INTERPRETING DESTINIES + WELCOME ──
          Kept compact so the whole section fits on one screen below the navbar. */}
      <section className="bg-paper">
        <div className="page-container py-5 sm:py-10 lg:py-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-8 lg:gap-10 xl:gap-14 items-center">
            {/* Container sizing lets the title shrink to fit its column on one line. */}
            <div className="[container-type:inline-size]">
              <h1
                className="font-heading text-3xl font-black text-brand-main uppercase whitespace-nowrap leading-none mb-2.5 sm:mb-3"
                style={{ fontSize: 'clamp(1.25rem, 7.5cqw, 3.75rem)' }}
              >
                Interpreting Destinies
              </h1>
              <div
                className="w-20 h-1.5 rounded-full mb-3 sm:mb-4"
                style={{ background: 'linear-gradient(90deg, var(--gold), var(--gold-light))' }}
                aria-hidden
              />
              <div className="space-y-2.5 sm:space-y-3 text-sm sm:text-base leading-[1.6] lg:leading-[1.65] text-ink-muted">
                <p>
                  It gives me great pleasure to welcome you to the Gideon Peprah Ministries; a non-governmental Christian faith based
                  interdenominational ministry.
                </p>
                <p>
                  We are mandated to &ldquo;<strong className="font-bold text-brand-main">INTERPRET DESTINIES</strong>&rdquo;
                  &mdash; help mankind decode the blueprint of their destinies, and give Divine directions to fulfill it.
                </p>
                 <p>
                  Our heart is to preach the Gospel of Jesus Christ, With people as our focus; giving hope to the
                  hopeless, healing the sick, and delivering the oppressed.
                </p>
                <p>
                  We are committed to youth empowerment, humanitarian, and philanthropic works.
                </p>
               
              </div>
              <div className="mt-4 sm:mt-5 flex items-center gap-3">
                {/* Phones and tablets: a small photo here instead of the big one, so the section fits one screen. */}
                <Image
                  src="/images/welcome.png"
                  alt=""
                  width={96}
                  height={96}
                  className="lg:hidden w-12 h-12 rounded-full object-cover object-top ring-2 ring-gold bg-paper"
                />
                <div className="pl-3 border-l-4 border-gold">
                  <p className="font-heading font-bold text-lg leading-tight text-brand-dark">Prophet Gideon Peprah</p>
                  <p className="text-sm font-semibold text-brand-main">President &amp; Founder</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 sm:gap-4 mt-4 sm:mt-6">
                <Link href="/get-involved" className="btn-primary text-sm sm:text-base px-5 py-2.5 sm:px-8 sm:py-3.5">Become a Partner</Link>
                <Link href="/media" className="btn-outline-brand text-sm sm:text-base px-5 py-2.5 sm:px-8 sm:py-3.5">Watch Now</Link>
              </div>
            </div>

            {/* Desktop: fills exactly the height of the text column, so the photo lines up with
                the heading at the top and the buttons at the bottom. */}
            <div className="hidden lg:block relative self-stretch">
              <Image
                src="/images/welcome.png"
                alt="Prophet Gideon Peprah"
                width={1242}
                height={1266}
                className="absolute inset-y-0 right-0 h-full w-auto max-w-[calc(100%+2.5rem)] object-contain object-bottom drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── VALOR TV ── */}
      {/* A green card that hugs the video: slim heading on top and a thin green edge around the video. */}
      <section className="bg-white py-8 sm:py-12">
        <div className="page-container">
        <div className="bg-brand-dark rounded-2xl shadow-xl p-2 sm:p-3">
          <div className="pt-2 pb-3 sm:pb-4 flex flex-col sm:flex-row sm:items-baseline sm:justify-center gap-x-4 gap-y-1 text-center">
            <h2 className="font-heading text-3xl lg:text-4xl font-extrabold text-gold-light">VALOR TV</h2>
            <p className="text-white/85">Watch our latest broadcasts &amp; teachings</p>
          </div>
          {/* Plays the latest VALOR TV upload right here. */}
          <ValorTvPlayer video={latestVideo} />
        </div>
        </div>
      </section>

      {/* ── JOIN BANNER ── */}
      <section className="bg-paper py-14 sm:py-24 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="section-title mb-6">Join The GPM Family</h2>
          <p className="text-base sm:text-lg text-ink-muted max-w-xl mx-auto mb-6 sm:mb-10 leading-relaxed">
            Together we can do great things for the Kingdom of God. Become a partner today and be part of something extraordinary.
          </p>
          <Link href="/get-involved" className="btn-primary">Become a Partner today</Link>
        </div>
      </section>

      {/* ── NEWS ── (hidden when the admin has removed every update) */}
      {news.length > 0 && (
      <section className="py-14 sm:py-24 bg-white">
        <div className="page-container">
          <div className="text-center mb-8 sm:mb-14">
            <h2 className="section-title">Stay Updated</h2>
            <div className="title-underline" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {news.slice(0, HOME_NEWS_COUNT).map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}
          </div>
          {news.length > HOME_NEWS_COUNT && (
            <div className="text-center mt-10">
              <Link href="/news" className="btn-outline-brand">View All Updates</Link>
            </div>
          )}
        </div>
      </section>
      )}

      {/* ── HOW MAY WE HELP ── */}
      <section className="bg-paper py-14 sm:py-24">
        <div className="page-container text-center">
          <h2 className="section-title mb-4">How may we help you today?</h2>
          <div className="title-underline mb-8 sm:mb-14" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {helpCards.map((card) => (
              <div key={card.title} className="bg-white rounded-2xl p-6 sm:p-10 text-center shadow-sm card-hover">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 bg-brand-pale text-brand-main">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={card.icon} />
                  </svg>
                </div>
                <h3 className="font-heading text-2xl font-extrabold mb-4 text-brand-main">{card.title}</h3>
                <p className="text-sm leading-[1.8] text-ink-muted mb-5 sm:mb-8">{card.body}</p>
                <Link
                  href={card.href}
                  className="inline-flex items-center gap-2 text-sm font-bold text-brand-main hover:text-brand-dark transition-all duration-200 hover:gap-3"
                >
                  {card.cta}
                  <Arrow />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RESOURCES ── */}
      <section className="bg-white py-14 sm:py-24">
        <div className="page-container">
          <div className="text-center mb-8 sm:mb-14">
            <h2 className="section-title">Resources</h2>
            <div className="title-underline" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {resources.map((r) =>
              r.audio ? (
                // A player can't sit inside a link, so only the label links to the full list.
                <div key={r.label} className="rounded-xl overflow-hidden shadow-md bg-[#1c1c1c] card-hover flex flex-col">
                  <iframe
                    src={audiomackEmbedUrl(latestSermon.audiomack_url)}
                    title={`${latestSermon.title} – audio sermon by Prophet Gideon Peprah`}
                    className="block w-full aspect-[3/2] lg:aspect-auto lg:h-60"
                    loading="lazy"
                    allow="autoplay"
                    style={{ border: 0 }}
                  />
                  <Link
                    href={r.href ?? '/resources'}
                    className="mt-auto px-4 py-4 text-center text-sm font-bold text-white bg-brand-main hover:bg-brand-dark transition-colors"
                  >
                    {r.label} →
                  </Link>
                </div>
              ) : (() => {
                const book = r.category ? latestBook(books, r.category) : null
                return (
                  <Link
                    key={r.label}
                    href={book ? bookHref(book) : r.href ?? '/resources'}
                    className="group flex flex-col rounded-xl overflow-hidden shadow-md card-hover"
                  >
                    <FitImage
                      src={book?.image_url ?? r.img!}
                      alt={book?.title ?? r.label}
                      className="aspect-[3/2] lg:aspect-auto lg:h-60"
                      imgClassName="transition-transform duration-500 group-hover:scale-105"
                      sizes="(min-width: 1024px) 280px, (min-width: 640px) 50vw, 100vw"
                    />
                    <div className="mt-auto px-4 py-4 text-center text-white bg-brand-main">
                      <span className="block text-sm font-bold">{r.label}</span>
                      {book && <span className="block mt-0.5 text-xs text-white/80 truncate">Latest: {book.title}</span>}
                    </div>
                  </Link>
                )
              })()
            )}
          </div>
        </div>
      </section>
    </>
  )
}
