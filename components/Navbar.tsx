'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import SocialIcons from '@/components/SocialIcons'

type NavItem = { label: string; href: string; children?: { label: string; href: string }[] }

const navItems: NavItem[] = [
  {
    label: 'About Us',
    href: '/about-us',
    // Add How It Began (#how-it-began) back here when it's shown again on the About page.
    // Leadership is added below when the admin has added leaders.
    children: [
      { label: 'The Prophet', href: '/about-us#prophet' },
      { label: 'Tenets of Faith', href: '/about-us#faith' },
      { label: 'What We Do', href: '/what-we-do' },
    ],
  },
  { label: 'Events', href: '/events' },
  { label: 'Resources', href: '/resources' },
  { label: 'Media', href: '/media' },
  { label: 'Contact Us', href: '/contact' },
  {
    label: 'Book the Prophet',
    href: '/book-the-prophet',
    // A dropdown rather than two links, so the desktop menu still fits on a laptop screen.
    children: [
      { label: 'Invite to Minister', href: '/book-the-prophet' },
      { label: '1-on-1 Counselling', href: '/prophetic-insight' },
    ],
  },
]

const getInvolved: NavItem = {
  label: 'Get Involved',
  href: '/get-involved',
  children: [
    { label: 'Give', href: '/give' },
    { label: 'Become a Partner', href: '/get-involved' },
    { label: 'Volunteer', href: '/get-involved#volunteer' },
  ],
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  )
}

function Dropdown({
  items,
  align = 'left',
  onNavigate,
}: {
  items: { label: string; href: string }[]
  align?: 'left' | 'right'
  onNavigate: () => void
}) {
  return (
    <div
      className={`absolute top-full ${align === 'right' ? 'right-0' : 'left-0'} mt-3 w-56 rounded-xl overflow-hidden bg-white shadow-xl z-50 border border-brand-main/10`}
    >
      {items.map((child) => (
        <Link
          key={child.href}
          href={child.href}
          onClick={onNavigate}
          className="block px-5 py-3 text-[15px] font-semibold text-brand-main hover:bg-brand-pale transition-colors border-b border-brand-main/5 last:border-0"
        >
          {child.label}
        </Link>
      ))}
    </div>
  )
}

const LEADERSHIP_LINK = { label: 'Leadership', href: '/about-us#leadership' }

/** The menu, with Leadership under About Us when there are leaders to show. */
function menuItems(showLeadership: boolean): NavItem[] {
  if (!showLeadership) return navItems
  return navItems.map((item) =>
    item.href === '/about-us' && item.children
      ? { ...item, children: [...item.children.slice(0, 2), LEADERSHIP_LINK, ...item.children.slice(2)] }
      : item
  )
}

export default function Navbar({ showLeadership = false }: { showLeadership?: boolean }) {
  const items = menuItems(showLeadership)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    setMobileOpen(false)
    setOpenDropdown(null)
  }, [pathname])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 60)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggle = (label: string) => setOpenDropdown(openDropdown === label ? null : label)
  // Close the menus when a link is picked. Needed for links within the same page (e.g. switching
  // About Us tabs), where the page address doesn't change and so the menus wouldn't close by themselves.
  const closeMenus = () => {
    setOpenDropdown(null)
    setMobileOpen(false)
    setMobileExpanded(null)
  }
  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href))
  // A menu with a dropdown is shown as current when you're on any of its pages (e.g. What We Do under About Us).
  const isItemActive = (item: NavItem) =>
    isActive(item.href) || !!item.children?.some((c) => isActive(c.href.split('#')[0]))
  // The current page's link turns gold (the darker gold, so it reads on white).
  const activeClass = 'text-gold-dark'

  // The admin page has its own header.
  if (pathname.startsWith('/admin')) return null

  return (
    <>
      {/* Top social bar */}
      <div className="bg-brand-dark text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <SocialIcons />
          <span className="hidden sm:block text-sm font-semibold tracking-wide text-white/85">
            Interpreting Destinies
          </span>
        </div>
      </div>

      <nav
        ref={navRef}
        className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${scrolled ? 'shadow-md' : ''}`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex items-center justify-between transition-all duration-300 ${scrolled ? 'h-[76px]' : 'h-[112px]'}`}>

            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <Image
                src="/images/logo-gpm.png"
                alt="Gideon Peprah Ministries"
                width={642}
                height={376}
                priority
                className={`w-auto transition-all duration-300 ${scrolled ? 'h-16' : 'h-20 sm:h-24'}`}
              />
            </Link>

            {/* Desktop Nav */}
            <ul className="hidden lg:flex items-center gap-0 xl:gap-1">
              {items.map((item) => (
                <li key={item.label} className="relative">
                  {item.children ? (
                    <>
                      <button
                        onClick={() => toggle(item.label)}
                        className={`flex items-center gap-1 px-2 xl:px-3 py-2 text-[15px] xl:text-[16px] font-bold whitespace-nowrap transition-colors ${
                          isItemActive(item) ? activeClass : 'text-brand-main hover:text-brand-dark'
                        }`}
                      >
                        {item.label}
                        <Chevron open={openDropdown === item.label} />
                      </button>
                      {openDropdown === item.label && <Dropdown items={item.children} onNavigate={closeMenus} />}
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className={`block px-2 xl:px-3 py-2 text-[15px] xl:text-[16px] font-bold whitespace-nowrap transition-colors ${
                        isItemActive(item) ? activeClass : 'text-brand-main hover:text-brand-dark'
                      }`}
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
              <li className="relative ml-2 xl:ml-3">
                <button
                  onClick={() => toggle(getInvolved.label)}
                  className="flex items-center gap-1.5 px-4 xl:px-6 py-3 rounded-full whitespace-nowrap bg-gradient-to-b from-gold-light to-gold text-brand-dark shadow-md hover:brightness-105 hover:shadow-lg text-[15px] xl:text-[16px] font-bold transition-all"
                >
                  {getInvolved.label}
                  <Chevron open={openDropdown === getInvolved.label} />
                </button>
                {openDropdown === getInvolved.label && <Dropdown items={getInvolved.children!} align="right" onNavigate={closeMenus} />}
              </li>
            </ul>

            {/* Mobile burger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2.5 rounded-lg text-brand-main hover:bg-brand-pale transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden overflow-hidden bg-white transition-all duration-300 ${
            mobileOpen ? 'max-h-[720px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="px-4 py-3 space-y-1 border-t border-brand-main/10">
            {[...items, getInvolved].map((item) => (
              <div key={item.label}>
                {item.children ? (
                  <>
                    <button
                      onClick={() => setMobileExpanded(mobileExpanded === item.label ? null : item.label)}
                      className={`flex items-center justify-between w-full px-3 py-3 rounded-lg text-[15px] font-bold transition-colors ${
                        isItemActive(item) ? activeClass : 'text-brand-main hover:bg-brand-pale'
                      }`}
                    >
                      {item.label}
                      <Chevron open={mobileExpanded === item.label} />
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-200 ${
                        mobileExpanded === item.label ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <div className="ml-4 mt-1 space-y-1 border-l-2 border-gold pl-3">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={closeMenus}
                            className="block py-2.5 text-sm font-semibold text-brand-main/80 hover:text-brand-dark transition-colors"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className={`block px-3 py-3 rounded-lg text-[15px] font-bold transition-colors ${
                      isItemActive(item) ? activeClass : 'text-brand-main hover:bg-brand-pale'
                    }`}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
            <div className="pt-3 pb-2">
              <Link href="/give" className="btn-primary block text-center">Give</Link>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}
