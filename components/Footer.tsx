import Link from 'next/link'
import Image from 'next/image'
import SocialIcons from '@/components/SocialIcons'

const columns = [
  {
    title: 'About Us',
    links: [
      { label: 'The Prophet', href: '/about-us#prophet' },
      { label: 'Tenets of Faith', href: '/about-us#faith' },
      { label: 'What We Do', href: '/what-we-do' },
    ],
  },
  {
    title: 'Get Involved',
    links: [
      { label: 'Become a Partner', href: '/get-involved' },
      { label: 'Book the Prophet', href: '/book-the-prophet' },
      { label: '1-on-1 Counselling', href: '/prophetic-insight' },
      { label: 'Give Online', href: '/give' },
      { label: 'News & Updates', href: '/news' },
      { label: 'Events', href: '/events' },
      { label: 'Resources', href: '/resources' },
      { label: 'VALOR TV', href: '/media#tv' },
      { label: 'Contact Us', href: '/contact' },
    ],
  },
]

const LEADERSHIP_LINK = { label: 'Leadership', href: '/about-us#leadership' }

export default function Footer({ showLeadership = false }: { showLeadership?: boolean }) {
  // Leadership is listed under About Us once the admin has added leaders.
  const cols = showLeadership
    ? columns.map((c) => (c.title === 'About Us' ? { ...c, links: [...c.links.slice(0, 2), LEADERSHIP_LINK, ...c.links.slice(2)] } : c))
    : columns
  return (
    <footer className="bg-brand-dark text-white/80">
      <div className="page-container pt-12 sm:pt-16 pb-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10 sm:gap-12 mb-12">

          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="inline-block mb-5">
              {/* White-and-gold version of the logo, so it reads on the dark footer. */}
              <Image
                src="/images/logo-gpm-light.png"
                alt="Gideon Peprah Ministries"
                width={642}
                height={376}
                className="h-24 w-auto"
              />
            </Link>
            <p className="text-sm leading-relaxed mb-6 max-w-md">
              We are mandated to &ldquo;<strong className="font-bold text-white">INTERPRET DESTINIES</strong>&rdquo; &mdash; help
              mankind decode the blueprint of their destinies, and give Divine directions to fulfill it.
            </p>
            <SocialIcons className="text-white" />
          </div>

          {cols.map((col) => {
            // Long lists (Get Involved) take the full width in two columns on phones.
            const long = col.links.length > 6
            return (
            <div key={col.title} className={long ? 'col-span-2 lg:col-span-1' : ''}>
              <h4 className="font-heading text-sm font-extrabold uppercase tracking-wider mb-5 text-white">
                {col.title}
              </h4>
              <ul className={long ? 'grid grid-cols-2 lg:grid-cols-1 gap-x-8 gap-y-3' : 'space-y-3'}>
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm hover:text-white transition-colors duration-200">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            )
          })}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 text-xs border-t border-white/10">
          <span>&copy; {new Date().getFullYear()} Gideon Peprah Ministries. All rights reserved.</span>
          <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
        </div>
      </div>
    </footer>
  )
}
