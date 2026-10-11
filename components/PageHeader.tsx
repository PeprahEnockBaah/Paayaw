import Image from 'next/image'

/** Picture behind every page header (the ministry's collage banner). */
const HEADER_IMAGE = '/images/banners/header.jpg'

/**
 * The green title strip at the top of every page: a small gold label, the page title and
 * an optional line of text beside it (or other content, like the About Us tabs), over the banner picture,
 * then the gold bar.
 * Uses the same width and side padding as the menu bar, so the title lines up with the logo.
 */
export default function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string
  title: string
  description?: React.ReactNode
  /** Shown on the right instead of a description, e.g. tabs. */
  children?: React.ReactNode
}) {
  return (
    <>
      <section className="relative overflow-hidden bg-brand-dark text-white py-6 flex items-center min-h-[160px] sm:min-h-[200px] lg:min-h-[260px]">
        {/* Positioned so the faces and logo in the collage stay in view at every width (zoomed on phones to leave out
            the gold stripe printed near the bottom of the picture). */}
        <Image src={HEADER_IMAGE} alt="" fill priority sizes="100vw" className="object-cover object-[center_42%] max-sm:scale-150" />
        {/* Dark green shade, strongest behind the title on the left, so the white text stays readable. */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ background: 'linear-gradient(90deg, rgba(7,46,36,0.92) 0%, rgba(7,46,36,0.78) 45%, rgba(7,46,36,0.55) 100%)' }}
        />
        <div
          className={`relative w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-3 ${
            children ? 'sm:flex-row sm:items-center sm:justify-between sm:gap-4' : 'lg:flex-row lg:items-center lg:gap-10'
          }`}
        >
          <div className="flex-shrink-0">
            <p className="text-xs tracking-[4px] uppercase font-bold mb-1.5" style={{ color: 'var(--gold-light)' }}>
              {eyebrow}
            </p>
            <h1 className="font-heading text-3xl lg:text-4xl font-bold">{title}</h1>
          </div>
          {children}
          {!children && description && (
            <p className="text-sm lg:text-[15px] leading-relaxed text-white/85 lg:border-l-2 lg:border-gold lg:pl-6">{description}</p>
          )}
        </div>
      </section>
      <div className="gold-bar" />
    </>
  )
}
