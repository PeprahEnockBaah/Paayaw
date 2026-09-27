// Add each profile URL to its `href`; icons with an empty href are hidden.
export const socialLinks = [
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/share/1A1D3TwgEA/',
    path: 'M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h7.5v-7h-2.4v-2.7h2.4v-2c0-2.4 1.5-3.7 3.6-3.7 1 0 2 .1 2.2.1v2.5h-1.5c-1.2 0-1.4.6-1.4 1.4v1.7h2.8l-.4 2.7h-2.4v7H19a2 2 0 002-2V5a2 2 0 00-2-2z',
  },
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/@gideonpeprah',
    path: 'M4 5h16a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V7a2 2 0 012-2zm0 2v10h16V7H4zm6 2l5 3-5 3V9z',
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/iamgideonpeprah/',
    path: 'M6 3h12a3 3 0 013 3v12a3 3 0 01-3 3H6a3 3 0 01-3-3V6a3 3 0 013-3zm0 2a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V6a1 1 0 00-1-1H6zm6 3.5a3.5 3.5 0 110 7 3.5 3.5 0 010-7zm0 2a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM17 6a1 1 0 110 2 1 1 0 010-2z',
  },
  {
    label: 'TikTok',
    href: 'https://www.tiktok.com/@iamgideonpeprah',
    path: 'M16.6 5.8A4.3 4.3 0 0115.5 3h-3.1v12.4a2.6 2.6 0 11-2.6-2.6c.3 0 .5 0 .8.1V9.7a5.7 5.7 0 00-.8-.1 5.7 5.7 0 105.7 5.7V9a7.3 7.3 0 004.3 1.4V7.3a4.3 4.3 0 01-3.2-1.5z',
  },
  {
    label: 'X',
    href: 'https://x.com/iamgideonpeprah',
    path: 'M17.8 3h3.1l-6.8 7.7L22 21h-6.2l-4.9-6.4L5.3 21H2.2l7.2-8.3L1.8 3h6.4l4.4 5.8L17.8 3zm-1.1 16.2h1.7L7.3 4.7H5.5l11.2 14.5z',
  },
]

export default function SocialIcons({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-6 ${className}`}>
      {socialLinks.filter((s) => s.href).map((s) => (
        <a
          key={s.label}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={s.label}
          title={s.label}
          className="opacity-85 transition-opacity hover:opacity-100"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path fillRule="evenodd" d={s.path} />
          </svg>
        </a>
      ))}
    </div>
  )
}
