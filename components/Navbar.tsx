'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import SocialIcons from '@/components/SocialIcons'

type NavItem = { label: string; href: string; children?: { label: string; href: string }[] }

const navItems: NavItem[] = [
  { label: 'About Us', href: '/about-us', children: [
      { label: 'How It Began', href: '/about-us' },
      { label: 'Statements of Faith', href: '/about-us#faith' },
      { label: 'The Prophet', href: '/about-us#prophet' },
      { label: 'Leadership', href: '/about-us#leadership' },
    ],
  },
  { label: 'What We Do', href: '/what-we-do' },
  { label: 'Events', href: '/events' },
  { label: 'Resources', href: '/resources' },
  { label: 'Media', href: '/media' },
  { label: 'Contact Us', href: '/contact' },
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

function Dropdown({ items, align = 'left' }: { items: { label: string; href: string }[]; align?: 'left' | 'right' }) {
  return (
    <div
      className={`absolute top-full ${align === 'right' ? 'right-0' : 'left-0'} mt-3 w-56 rounded-xl overflow-hidden bg-white shadow-xl z-50 border border-brand-main/10`}
    >
      {items.map((child) => (
        <Link
          key={child.href}
          href={child.href}
          className="block px-5 py-3 text-[15px] font-semibold text-brand-main hover:bg-brand-pale transition-colors border-b border-brand-main/5 last:border-0"
        >
          {child.label}
        </Link>
      ))}
    </div>
  )
}

export default function Navbar() {
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
  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href))

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
                src="/images/logo-green.png"
                alt="Gideon Peprah Ministries"
                width={1131}
                height={400}
                priority
                className={`w-auto transition-all duration-300 ${scrolled ? 'h-14' : 'h-16 sm:h-20'}`}
              />
            </Link>

            {/* Desktop Nav */}
            <ul className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <li key={item.label} className="relative">
                  {item.children ? (
                    <>
                      <button
                        onClick={() => toggle(item.label)}
                        className={`flex items-center gap-1 px-3 py-2 text-[16px] font-semibold transition-colors ${
                          isActive(item.href) ? 'text-brand-dark' : 'text-brand-main hover:text-brand-dark'
                        }`}
                      >
                        {item.label}
                        <Chevron open={openDropdown === item.label} />
                      </button>
                      {openDropdown === item.label && <Dropdown items={item.children} />}
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className={`block px-3 py-2 text-[16px] font-semibold transition-colors ${
                        isActive(item.href) ? 'text-brand-dark underline underline-offset-8 decoration-2 decoration-gold' : 'text-brand-main hover:text-brand-dark'
                      }`}
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
              <li className="relative ml-3">
                <button
                  onClick={() => toggle(getInvolved.label)}
                  className="flex items-center gap-1.5 px-6 py-3 rounded-full bg-gradient-to-b from-gold-light to-gold text-brand-dark shadow-md hover:brightness-105 hover:shadow-lg text-[16px] font-bold transition-all"
                >
                  {getInvolved.label}
                  <Chevron open={openDropdown === getInvolved.label} />
                </button>
                {openDropdown === getInvolved.label && <Dropdown items={getInvolved.children!} align="right" />}
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
            {[...navItems, getInvolved].map((item) => (
              <div key={item.label}>
                {item.children ? (
                  <>
                    <button
                      onClick={() => setMobileExpanded(mobileExpanded === item.label ? null : item.label)}
                      className="flex items-center justify-between w-full px-3 py-3 rounded-lg text-[15px] font-semibold text-brand-main hover:bg-brand-pale transition-colors"
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
                    className="block px-3 py-3 rounded-lg text-[15px] font-semibold text-brand-main hover:bg-brand-pale transition-colors"
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
