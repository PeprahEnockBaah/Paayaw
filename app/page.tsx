import Link from 'next/link'
import Image from 'next/image'
import FitImage from '@/components/FitImage'
import ImageSlider from '@/components/ImageSlider'
import { getSlides } from '@/lib/slides'
import { getSermons, audiomackEmbedUrl } from '@/lib/resources'

const newsItems = [
  {
    title: 'A New Place of Worship Established in the Northern Region',
    date: 'September 2025',
    img: '/images/V_185.jpg',
    href: '/media',
  },
  {
    title: 'GPM Renovates Local School to Boost Education in the Community',
    date: 'June 2025',
    img: '/images/V_197.jpg',
    href: '/media',
  },
  {
    title: 'Remember Them — Annual Community Outreach a Great Success',
    date: 'May 2025',
    img: '/images/V_61.jpg',
    href: '/media',
  },
  {
    title: 'Go To Them — GPM Evangelism Campaign Reaches Thousands',
    date: 'May 2025',
    img: '/images/V_186.jpg',
    href: '/media',
  },
]

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

const resources: { label: string; img?: string; audio?: true; href?: string }[] = [
  { label: 'Books & Teaching Materials', img: '/images/V_184.jpg' },
  { label: 'Daily Devotionals', img: '/images/V_166.jpg' },
  // Shows the latest sermon's player instead of a photo.
  { label: 'Audio Sermons', audio: true, href: '/resources#audio-sermons' },
  { label: 'Bible Study Guides', img: '/images/V_205.jpg' },
]

function Arrow() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  )
}

// Re-check the slider list at most once a minute; admin changes also refresh it immediately.
export const revalidate = 60

export default async function HomePage() {
  const [slides, sermons] = await Promise.all([getSlides(), getSermons()])
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
        <div className="max-w-6xl mx-auto px-5 sm:px-6 py-5 sm:py-10 lg:py-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-8 lg:gap-10 xl:gap-14 items-center">
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
                  src="/images/Pastor.jpg"
                  alt=""
                  width={96}
                  height={96}
                  className="lg:hidden w-12 h-12 rounded-full object-cover object-top ring-2 ring-gold"
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

            {/* Desktop: sized to the screen height so it never pushes the section past one screen. */}
            <div className="hidden lg:flex justify-center">
              <Image
                src="/images/Pastor.jpg"
                alt="Prophet Gideon Peprah"
                width={914}
                height={1280}
                className="h-[calc(100svh-9rem)] min-h-[340px] max-h-[600px] w-auto rounded-2xl shadow-2xl object-cover object-top"
                style={{ aspectRatio: '3/4' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── VALOR TV ── */}
      <section className="bg-brand-dark py-14 sm:py-24 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-4xl lg:text-5xl font-extrabold text-gold-light mb-4">VALOR TV</h2>
          <p className="text-white/85 mb-12">Watch our latest broadcasts &amp; teachings</p>
          <Link
            href="/media#tv"
            className="group relative flex items-center justify-center rounded-2xl overflow-hidden shadow-2xl"
            style={{ aspectRatio: '16/9' }}
            aria-label="Watch VALOR TV"
          >
            <Image src="/images/V_198.jpg" alt="" fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(min-width: 896px) 896px, 100vw" />
            <div className="absolute inset-0 bg-brand-dark/40" />
            <div className="relative w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110">
              <svg className="w-9 h-9 ml-1" fill="var(--brand-main)" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </Link>
        </div>
      </section>

      {/* ── JOIN BANNER ── */}
      <section className="bg-paper py-14 sm:py-24 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="section-title mb-6">Join The GPM Family</h2>
          <p className="text-lg text-ink-muted max-w-xl mx-auto mb-10 leading-relaxed">
            Together we can do great things for the Kingdom of God. Become a partner today and be part of something extraordinary.
          </p>
          <Link href="/get-involved" className="btn-primary">Become a Partner today</Link>
        </div>
      </section>

      {/* ── NEWS ── */}
      <section className="py-14 sm:py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="section-title">Stay Updated</h2>
            <div className="title-underline" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newsItems.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="group block bg-white rounded-xl overflow-hidden shadow-md border border-brand-main/10 card-hover"
              >
                <FitImage
                  src={item.img}
                  alt={item.title}
                  className="aspect-[3/2]"
                  imgClassName="transition-transform duration-500 group-hover:scale-105"
                  sizes="(min-width: 1024px) 280px, (min-width: 640px) 50vw, 100vw"
                />
                <div className="p-5">
                  <p className="text-[11px] font-bold tracking-widest uppercase mb-2 text-brand-main">{item.date}</p>
                  <h3 className="text-[15px] font-bold leading-snug text-brand-dark group-hover:text-brand-main transition-colors">
                    {item.title}
                  </h3>
                </div>
              </Link>
              )
            )}
          </div>
        </div>
      </section>

      {/* ── HOW MAY WE HELP ── */}
      <section className="bg-paper py-14 sm:py-24 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="section-title mb-4">How may we help you today?</h2>
          <div className="title-underline mb-14" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {helpCards.map((card) => (
              <div key={card.title} className="bg-white rounded-2xl p-10 text-center shadow-sm card-hover">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 bg-brand-pale text-brand-main">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={card.icon} />
                  </svg>
                </div>
                <h3 className="font-heading text-2xl font-extrabold mb-4 text-brand-main">{card.title}</h3>
                <p className="text-sm leading-[1.8] text-ink-muted mb-8">{card.body}</p>
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
      <section className="bg-white py-14 sm:py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
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
              ) : (
              <Link
                key={r.label}
                href={r.href ?? '/resources'}
                className="group block rounded-xl overflow-hidden shadow-md card-hover"
              >
                <FitImage
                  src={r.img!}
                  alt={r.label}
                  className="aspect-[3/2] lg:aspect-auto lg:h-60"
                  imgClassName="transition-transform duration-500 group-hover:scale-105"
                  sizes="(min-width: 1024px) 280px, (min-width: 640px) 50vw, 100vw"
                />
                <div className="px-4 py-4 text-center text-sm font-bold text-white bg-brand-main">
                  {r.label}
                </div>
              </Link>
              )
            )}
          </div>
        </div>
      </section>
    </>
  )
}
