'use client'

import { useState } from 'react'
import FitImage from '@/components/FitImage'

/** Event photo, or a branded title card when there's no photo (or it can't be loaded). */
export default function EventImage({ src, title }: { src: string | null; title: string }) {
  const [failed, setFailed] = useState(false)

  if (src && !failed) {
    return (
      <FitImage
        src={src}
        alt={title}
        className="aspect-[4/3]"
        sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
        onError={() => setFailed(true)}
      />
    )
  }

  return (
    <div
      className="aspect-[4/3] flex items-center justify-center text-white"
      style={{ background: 'linear-gradient(160deg, var(--brand-dark) 0%, #0e5a45 100%)' }}
    >
      <span className="font-heading text-2xl font-bold px-6 text-center" style={{ color: 'var(--gold-light)' }}>
        {title}
      </span>
    </div>
  )
}
