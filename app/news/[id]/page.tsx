import Link from 'next/link'
import { notFound } from 'next/navigation'
import FitImage from '@/components/FitImage'
import { formatNewsDate, getNewsItem } from '@/lib/news'

export const revalidate = 60

export async function generateMetadata({ params }: { params: { id: string } }) {
  const item = await getNewsItem(params.id)
  return { title: item ? `${item.title} – Gideon Peprah Ministries` : 'News – Gideon Peprah Ministries' }
}

export default async function NewsItemPage({ params }: { params: { id: string } }) {
  const item = await getNewsItem(params.id)
  if (!item) notFound()
  const external = !!item.link_url && /^https?:\/\//.test(item.link_url)

  return (
    <section className="bg-paper px-4 sm:px-6 py-8 sm:py-12">
      <article className="max-w-3xl mx-auto">
        <Link href="/news" className="inline-block text-sm font-semibold text-brand-main mb-5 hover:text-brand-dark">
          ← All news &amp; updates
        </Link>
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <FitImage src={item.image_url} alt={item.title} className="aspect-[3/2]" sizes="(min-width: 768px) 768px, 100vw" priority />
          <div className="p-6 sm:p-8">
            <p className="text-xs font-bold tracking-widest uppercase mb-2 text-brand-main">{formatNewsDate(item.news_date)}</p>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-brand-dark leading-tight mb-5">{item.title}</h1>
            <div className="text-ink-muted leading-relaxed whitespace-pre-line">{item.body}</div>
            {item.link_url && (
              <div className="mt-8">
                {external ? (
                  <a href={item.link_url} target="_blank" rel="noopener noreferrer" className="btn-primary">
                    Read more ↗
                  </a>
                ) : (
                  <Link href={item.link_url} className="btn-primary">
                    Read more
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </article>
    </section>
  )
}
