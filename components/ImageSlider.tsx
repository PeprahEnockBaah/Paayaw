'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import type { Slide } from '@/lib/slides'

export default function ImageSlider({
  slides,
  className = 'h-[75vh] min-h-[420px] max-h-[700px]',
}: {
  slides: Slide[]
  className?: string
}) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlay, setIsAutoPlay] = useState(true)
  const [direction, setDirection] = useState<'next' | 'prev'>('next')
  const [isTransitioning, setIsTransitioning] = useState(false)
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)

  const goToSlide = useCallback((index: number, dir?: 'next' | 'prev') => {
    if (isTransitioning) return
    setDirection(dir || (index > currentSlide ? 'next' : 'prev'))
    setIsTransitioning(true)
    setCurrentSlide(index)
    setTimeout(() => setIsTransitioning(false), 700)
  }, [currentSlide, isTransitioning])

  const goToNext = useCallback(() => {
    goToSlide((currentSlide + 1) % slides.length, 'next')
  }, [currentSlide, goToSlide])

  const goToPrevious = useCallback(() => {
    goToSlide((currentSlide - 1 + slides.length) % slides.length, 'prev')
  }, [currentSlide, goToSlide])

  useEffect(() => {
    if (!isAutoPlay) return
    const interval = setInterval(goToNext, 4000)
    return () => clearInterval(interval)
  }, [isAutoPlay, goToNext])

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }
  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX
  }
  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current
    if (Math.abs(diff) > 50) {
      setIsAutoPlay(false)
      if (diff > 0) goToNext()
      else goToPrevious()
    }
  }

  // Only render current + neighbors for performance
  const visibleIndices = new Set([
    currentSlide,
    (currentSlide - 1 + slides.length) % slides.length,
    (currentSlide + 1) % slides.length,
  ])

  return (
    <div
      className="relative w-full overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseEnter={() => setIsAutoPlay(false)}
      onMouseLeave={() => setIsAutoPlay(true)}
    >
      <div className={`relative ${className}`}>
        {slides.map((slide, index) => {
          if (!visibleIndices.has(index)) return null

          const isActive = index === currentSlide
          const slideDirection = direction === 'next' ? 1 : -1

          return (
            <div
              key={slide.id}
              className="absolute inset-0"
              style={{
                zIndex: isActive ? 2 : 1,
                opacity: isActive ? 1 : 0,
                transform: isActive
                  ? 'scale(1) translateX(0)'
                  : `scale(0.95) translateX(${slideDirection * 8}%)`,
                transition: 'opacity 700ms ease-in-out, transform 700ms ease-in-out',
              }}
            >
              {slide.banner && (
                <Image
                  src={slide.image_url}
                  alt=""
                  aria-hidden
                  fill
                  sizes="96px"
                  className="object-cover scale-125 blur-2xl brightness-75 lg:hidden"
                />
              )}
              <Image
                src={slide.image_url}
                alt={slide.alt}
                fill
                className={slide.banner ? 'object-contain lg:object-cover' : 'object-cover object-[center_30%]'}
                priority={index === 0}
                loading={index === 0 ? 'eager' : 'lazy'}
                quality={90}
                sizes="100vw"
              />
            </div>
          )
        })}

        {/* Navigation Arrows */}
        <button
          onClick={() => { setIsAutoPlay(false); goToPrevious() }}
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20
            w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center
            bg-black/30 hover:bg-black/60 backdrop-blur-sm
            border border-white/15 hover:border-white/40
            rounded-full transition-all duration-300 group"
          aria-label="Previous slide"
        >
          <svg className="w-5 h-5 text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={() => { setIsAutoPlay(false); goToNext() }}
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20
            w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center
            bg-black/30 hover:bg-black/60 backdrop-blur-sm
            border border-white/15 hover:border-white/40
            rounded-full transition-all duration-300 group"
          aria-label="Next slide"
        >
          <svg className="w-5 h-5 text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Bottom: dots + progress */}
        <div className="absolute bottom-0 left-0 right-0 z-20">
          <div className="flex justify-center gap-2 pb-5">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => { setIsAutoPlay(false); goToSlide(index) }}
                className={`rounded-full transition-all duration-500 ${
                  index === currentSlide
                    ? 'w-8 h-2.5 shadow-lg'
                    : 'w-2.5 h-2.5 hover:bg-white/60'
                }`}
                style={{
                  background: index === currentSlide ? 'var(--gold)' : 'rgba(255,255,255,0.35)',
                }}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
          <div className="h-1 bg-white/10">
            <div
              className="h-full transition-all duration-500 ease-out"
              style={{
                width: `${((currentSlide + 1) / slides.length) * 100}%`,
                background: 'linear-gradient(90deg, var(--gold-dark), var(--gold-light))',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
