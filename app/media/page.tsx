'use client'

import Link from 'next/link'
import { useEffect, useState, useRef, useCallback } from 'react'

interface Video {
  id: string
  title: string
  thumbnail: string
  publishedAt: string
  channelName: string
}

const COLS_LG = 3
const COLS_SM = 2

function useColumns() {
  const [cols, setCols] = useState(COLS_LG)
  useEffect(() => {
    function update() {
      if (window.innerWidth >= 1024) setCols(COLS_LG)
      else if (window.innerWidth >= 640) setCols(COLS_SM)
      else setCols(1)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])
  return cols
}

function smoothScrollTo(el: HTMLElement) {
  const start = window.scrollY
  const target = el.getBoundingClientRect().top + window.scrollY - 100
  const distance = target - start
  const duration = 1400
  let startTime: number | null = null

  // Soft ease-in-out with a gentle start and slow finish
  function ease(t: number) {
    return t < 0.5
      ? 8 * t * t * t * t
      : 1 - Math.pow(-2 * t + 2, 4) / 2
  }

  function step(timestamp: number) {
    if (!startTime) startTime = timestamp
    const elapsed = timestamp - startTime
    const progress = Math.min(elapsed / duration, 1)
    window.scrollTo(0, start + distance * ease(progress))
    if (progress < 1) requestAnimationFrame(step)
  }

  requestAnimationFrame(step)
}

export default function MediaPage() {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const playerRef = useRef<HTMLDivElement>(null)
  const cols = useColumns()

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch('/api/youtube')
        const data = await response.json()
        if (data.videos) setVideos(data.videos)
        else if (data.error) setError(data.error)
      } catch {
        setError('Failed to load videos')
      } finally {
        setLoading(false)
      }
    }
    fetchVideos()
  }, [])

  const handleSelect = useCallback((id: string) => {
    if (activeId === id) {
      setActiveId(null)
      setIsPlaying(false)
      return
    }
    setActiveId(id)
    setIsPlaying(false)
    // Wait for the player row to render, then scroll to it
    setTimeout(() => {
      if (playerRef.current) smoothScrollTo(playerRef.current)
    }, 80)
  }, [activeId])

  const handlePlay = useCallback(() => {
    setIsPlaying(true)
  }, [])

  const handleClose = useCallback(() => {
    setActiveId(null)
    setIsPlaying(false)
  }, [])

  const activeVideo = videos.find((v) => v.id === activeId) || null
  const filtered = videos.filter((v) =>
    v.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const activeIndex = activeVideo ? filtered.findIndex((v) => v.id === activeVideo.id) : -1

  // Build rows with inline player inserted after the active video's row
  const rows: (Video | 'player')[][] = []
  for (let i = 0; i < filtered.length; i += cols) {
    const row = filtered.slice(i, i + cols) as (Video | 'player')[]
    rows.push(row)
    if (activeIndex >= 0 && i + cols > activeIndex && i <= activeIndex) {
      rows.push(['player'])
    }
  }

  return (
    <>
      {/* Header */}
      <section
        className="relative flex items-center justify-center text-white text-center px-6 py-14 sm:py-20"
        style={{ background: 'linear-gradient(160deg, var(--brand-dark) 0%, #0e5a45 100%)' }}
      >
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23e8c35a' fill-rule='evenodd'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative z-10">
          <p className="text-xs tracking-[4px] uppercase font-bold mb-4" style={{ color: 'var(--gold-light)' }}>
            Watch & Listen
          </p>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">Media</h1>
          <div className="w-16 h-1 mx-auto" style={{ background: 'var(--brand-soft)' }} />
        </div>
      </section>
      <div className="gold-bar" />

      {/* Main */}
      <section className="bg-white min-h-[60vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          {loading ? (
            <div className="flex items-center justify-center py-32">
              <div className="text-center">
                <div
                  className="w-12 h-12 rounded-full border-4 border-brand-pale mx-auto animate-spin"
                  style={{ borderTopColor: 'var(--gold)' }}
                />
                <p className="mt-5 text-ink-soft text-sm">Loading videos...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-32">
              <div className="text-center max-w-sm">
                <p className="text-ink mb-2">Unable to load videos</p>
                <p className="text-sm text-ink-soft mb-6">{error}</p>
                <Link
                  href="https://www.youtube.com/@gideonpeprah/videos"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-white"
                  style={{ background: '#FF0000' }}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                  Watch on YouTube
                </Link>
              </div>
            </div>
          ) : videos.length > 0 ? (
            <>
              {/* Search bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <p className="text-sm text-ink-soft">
                  {filtered.length} video{filtered.length !== 1 ? 's' : ''}
                  {searchQuery && ` for "${searchQuery}"`}
                </p>
                <div className="relative w-full sm:w-72">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-soft" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search videos..."
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setActiveId(null); setIsPlaying(false) }}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm text-ink placeholder-ink-soft bg-white border border-brand-main/20 outline-none transition-all duration-200 focus:border-brand-main focus:ring-2 focus:ring-brand-main/20"
                  />
                </div>
              </div>

              {/* Video grid with inline player */}
              <div className="flex flex-col gap-6">
                {rows.map((row, rowIdx) => {
                  // Player row
                  if (row[0] === 'player' && activeVideo) {
                    return (
                      <div
                        key={`player-${activeVideo.id}`}
                        ref={playerRef}
                        className="w-full rounded-xl overflow-hidden animate-slideDown"
                        style={{ background: '#0f0f0f' }}
                      >
                        {/* Title bar */}
                        <div className="flex items-center justify-between px-4 sm:px-6 py-3" style={{ background: '#181818' }}>
                          <h3 className="text-white font-semibold text-sm sm:text-base truncate pr-4">
                            {activeVideo.title}
                          </h3>
                          <button
                            onClick={handleClose}
                            className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                            aria-label="Close player"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>

                        {/* Video area: thumbnail with play button OR iframe */}
                        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                          {isPlaying ? (
                            <iframe
                              src={`https://www.youtube.com/embed/${activeVideo.id}?autoplay=1&rel=0&modestbranding=1`}
                              title={activeVideo.title}
                              className="absolute inset-0 w-full h-full"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          ) : (
                            <button
                              onClick={handlePlay}
                              className="absolute inset-0 w-full h-full group/play cursor-pointer"
                            >
                              <img
                                src={`https://img.youtube.com/vi/${activeVideo.id}/maxresdefault.jpg`}
                                alt={activeVideo.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  // Fallback if maxres doesn't exist
                                  (e.target as HTMLImageElement).src = activeVideo.thumbnail
                                }}
                              />
                              <div className="absolute inset-0 bg-black/30 group-hover/play:bg-black/40 transition-colors flex items-center justify-center">
                                {/* YouTube play button */}
                                <div className="transition-transform duration-200 group-hover/play:scale-110">
                                  <svg width="68" height="48" viewBox="0 0 68 48">
                                    <path
                                      d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55c-2.93.78-4.63 3.26-5.42 6.19C.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26z"
                                      fill="#FF0000"
                                    />
                                    <path d="M45 24L27 14v20" fill="white" />
                                  </svg>
                                </div>
                              </div>
                            </button>
                          )}
                        </div>

                        {/* Info */}
                        <div className="px-4 sm:px-6 py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                          <p className="text-white/60 text-sm">
                            {activeVideo.channelName}
                            <span className="mx-2 text-white/30">&bull;</span>
                            {new Date(activeVideo.publishedAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>
                    )
                  }

                  // Video cards row
                  const videoRow = row as Video[]
                  return (
                    <div
                      key={`row-${rowIdx}`}
                      className="grid gap-4 sm:gap-5"
                      style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
                    >
                      {videoRow.map((video) => (
                        <button
                          key={video.id}
                          onClick={() => handleSelect(video.id)}
                          className={`group cursor-pointer text-left rounded-lg overflow-hidden transition-all duration-200 ${
                            activeId === video.id
                              ? 'ring-2 ring-brand-main'
                              : 'hover:ring-1 hover:ring-brand-main/20'
                          }`}
                          style={{ background: 'transparent' }}
                        >
                          {/* Thumbnail */}
                          <div className="relative w-full rounded-lg overflow-hidden" style={{ paddingBottom: '56.25%' }}>
                            <img
                              src={video.thumbnail}
                              alt={video.title}
                              className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                              loading="lazy"
                            />
                            {/* Play icon on hover */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-200 flex items-center justify-center">
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <svg width="48" height="34" viewBox="0 0 68 48">
                                  <path
                                    d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55c-2.93.78-4.63 3.26-5.42 6.19C.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26z"
                                    fill="#FF0000"
                                  />
                                  <path d="M45 24L27 14v20" fill="white" />
                                </svg>
                              </div>
                            </div>
                            {/* Active indicator */}
                            {activeId === video.id && (
                              <div className="absolute inset-0 border-b-4 flex items-center justify-center" style={{ borderColor: 'var(--gold)' }}>
                                <div className="bg-black/60 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                  <span className="text-white text-xs font-bold uppercase tracking-wider">Selected</span>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Info */}
                          <div className="pt-3 pb-2 px-0.5">
                            <h3 className="text-sm font-medium leading-snug text-brand-dark line-clamp-2 mb-1 group-hover:text-brand-main">
                              {video.title}
                            </h3>
                            <p className="text-xs text-ink-muted">{video.channelName}</p>
                            <p className="text-xs text-ink-soft">
                              {formatTimeAgo(video.publishedAt)}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )
                })}
              </div>

              {filtered.length === 0 && (
                <div className="text-center py-14 sm:py-20">
                  <p className="text-ink-soft">No videos match your search.</p>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="mt-3 text-sm"
                    style={{ color: 'var(--brand-main)' }}
                  >
                    Clear search
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-32">
              <p className="text-ink-soft">No videos found</p>
            </div>
          )}
        </div>
      </section>

      {/* Subscribe CTA */}
      <section className="py-14 px-6 text-center bg-paper">
        <Link
          href="https://www.youtube.com/@gideonpeprah/videos"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-7 py-3 rounded-full font-bold text-white text-sm transition-all duration-200 hover:brightness-110 hover:shadow-lg"
          style={{ background: '#FF0000' }}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
          Subscribe on YouTube
        </Link>
      </section>
    </>
  )
}

function formatTimeAgo(dateStr: string): string {
  const now = Date.now()
  const then = new Date(dateStr).getTime()
  const seconds = Math.floor((now - then) / 1000)

  const intervals: [number, string][] = [
    [31536000, 'year'],
    [2592000, 'month'],
    [604800, 'week'],
    [86400, 'day'],
    [3600, 'hour'],
    [60, 'minute'],
  ]

  for (const [secs, label] of intervals) {
    const count = Math.floor(seconds / secs)
    if (count >= 1) return `${count} ${label}${count > 1 ? 's' : ''} ago`
  }
  return 'Just now'
}
