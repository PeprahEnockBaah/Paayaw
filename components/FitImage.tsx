import Image from 'next/image'

/**
 * Shows the whole photo (no cropping) inside a fixed-shape frame. Any empty
 * space around it is filled with a blurred copy of the same photo, so tall
 * photos in wide frames (and vice versa) still look intentional.
 * The parent must give this a size, e.g. via `className` with an aspect ratio.
 */
export default function FitImage({
  src,
  alt,
  sizes,
  className = '',
  imgClassName = '',
  priority = false,
}: {
  src: string
  alt: string
  sizes: string
  className?: string
  imgClassName?: string
  priority?: boolean
}) {
  return (
    <div className={`relative overflow-hidden bg-black ${className}`}>
      <Image
        src={src}
        alt=""
        aria-hidden
        fill
        sizes="96px"
        className="object-cover scale-125 blur-2xl brightness-75"
      />
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        quality={90}
        priority={priority}
        className={`object-contain ${imgClassName}`}
      />
    </div>
  )
}
