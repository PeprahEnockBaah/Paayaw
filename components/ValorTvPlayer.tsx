'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

type Video = { id: string; title: string; thumbnail: string }

function PlayIcon() {
  return (
    <div className="relative w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110">
      <svg className="w-9 h-9 ml-1" fill="var(--brand-main)" viewBox="0 0 24 24" aria-hidden>
        <path d="M8 5v14l11-7z" />
      </svg>
    </div>
  )
}

/**
 * Homepage VALOR TV frame: shows the latest YouTube upload's picture and plays it right
 * here when clicked. If YouTube can't be reached it links to the Media page instead.
 */
export default function ValorTvPlayer({ video }: { video: Video | null }) {
  const [playing, setPlaying] = useState(false)
  const frame = 'group relative flex items-center justify-center w-full mx-auto rounded-xl overflow-hidden bg-black'
  // Fills the green card on the homepage, leaving only its thin green edge around the video.
  const size = { aspectRatio: '16/9' }

  if (!video) {
    return (
      <Link href="/media#tv" className={frame} style={size} aria-label="Watch VALOR TV">
        <Image src="/images/V_198.jpg" alt="" fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(min-width: 1024px) 1024px, 100vw" />
        <div className="absolute inset-0 bg-black/25 group-hover:bg-black/35 transition-colors" />
        <PlayIcon />
      </Link>
    )
  }

  if (playing) {
    return (
      <div className={frame} style={size}>
        <iframe
          src={`https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1`}
          title={video.title}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    )
  }

  return (
    <button type="button" onClick={() => setPlaying(true)} className={frame} style={size} aria-label={`Play: ${video.title}`}>
      <img
        src={`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`}
        alt=""
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        onError={(e) => {
          // Not every video has a full-size picture.
          const img = e.currentTarget
          if (video.thumbnail && img.src !== video.thumbnail) img.src = video.thumbnail
        }}
      />
      <div className="absolute inset-0 bg-black/25 group-hover:bg-black/35 transition-colors" />
      <PlayIcon />
      <span className="absolute bottom-0 inset-x-0 px-5 py-4 text-left text-sm sm:text-base font-semibold text-white bg-gradient-to-t from-black/70 to-transparent truncate">
        {video.title}
      </span>
    </button>
  )
}
