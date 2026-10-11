import NewsCard from '@/components/NewsCard'
import { getNews } from '@/lib/news'
import PageHeader from '@/components/PageHeader'

export const metadata = {
  title: 'News & Updates – Gideon Peprah Ministries',
  description: 'The latest news and updates from Gideon Peprah Ministries.',
}

// Re-check at most once a minute; admin changes also refresh it immediately.
export const revalidate = 60

export default async function NewsPage() {
  const news = await getNews()

  return (
    <>
    <PageHeader eyebrow="Stay Updated" title="News & Updates" />
    <section className="py-10 sm:py-14 bg-white">
      <div className="page-container">
        {news.length === 0 ? (
          <p className="text-center text-ink-muted">There are no updates at the moment. Please check back soon.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {news.map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </section>
    </>
  )
}
