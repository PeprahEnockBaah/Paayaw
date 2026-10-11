import Link from 'next/link'
import FitImage from '@/components/FitImage'
import { formatNewsDate, newsHref, type NewsItem } from '@/lib/news'

/** One update in the "Stay Updated" grid (homepage and /news). */
export default function NewsCard({ item }: { item: NewsItem }) {
  const href = newsHref(item)
  const external = !!href && /^https?:\/\//.test(href)
  const className = 'group block bg-white rounded-xl overflow-hidden shadow-md border border-brand-main/10 card-hover'
  const inner = (
    <>
      <FitImage
        src={item.image_url}
        alt={item.title}
        className="aspect-[3/2]"
        imgClassName="transition-transform duration-500 group-hover:scale-105"
        sizes="(min-width: 1024px) 280px, (min-width: 640px) 50vw, 100vw"
      />
      <div className="p-5">
        <p className="text-[11px] font-bold tracking-widest uppercase mb-2 text-brand-main">{formatNewsDate(item.news_date)}</p>
        <h3 className="text-[15px] font-bold leading-snug text-brand-dark group-hover:text-brand-main transition-colors">
          {item.title}
        </h3>
      </div>
    </>
  )

  if (!href) return <div className={className}>{inner}</div>
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {inner}
      </a>
    )
  }
  return (
    <Link href={href} className={className}>
      {inner}
    </Link>
  )
}
