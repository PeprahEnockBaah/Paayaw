import Link from 'next/link'
import FitImage from '@/components/FitImage'
import { getOrderableBooks } from '@/lib/resources'
import { formatMoney } from '@/lib/giving'
import { orderPath } from '@/lib/order-settings'

export const metadata = {
  title: 'Order Books – Gideon Peprah Ministries',
  description: 'Order books and devotionals by Prophet Gideon Peprah, paid securely by Mobile Money or card.',
}

// Books and prices are managed from /admin; admin changes also refresh this page immediately.
export const revalidate = 60

export default async function OrderPage() {
  const books = await getOrderableBooks()

  return (
    <>
      <section
        className="relative flex items-center justify-center text-white text-center px-6 py-14 sm:py-20"
        style={{ background: 'linear-gradient(160deg, var(--brand-dark) 0%, #0e5a45 100%)' }}
      >
        <div className="relative z-10">
          <p className="text-xs tracking-[4px] uppercase font-bold mb-4" style={{ color: 'var(--gold-light)' }}>
            Books &amp; Devotionals
          </p>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">Order a Copy</h1>
          <div className="w-16 h-1 mx-auto" style={{ background: 'var(--brand-soft)' }} />
        </div>
      </section>
      <div className="gold-bar" />

      <section className="max-w-6xl mx-auto px-6 py-14 sm:py-20">
        {books.length === 0 ? (
          <div className="text-center max-w-md mx-auto">
            <p className="text-ink-muted mb-6">No books are available to order online right now.</p>
            <Link href="/contact" className="btn-primary">Contact Us to Order</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {books.map((b) => (
              <Link
                key={b.id}
                href={orderPath(b.id)}
                className="group bg-white rounded-xl overflow-hidden shadow-md card-hover flex flex-col"
              >
                <FitImage
                  src={b.image_url}
                  alt={b.title}
                  className="aspect-[4/3]"
                  sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
                />
                <div className="p-5 flex flex-col flex-1">
                  <span className="text-[10px] font-bold tracking-widest uppercase text-brand-main">{b.category}</span>
                  <h3 className="font-heading font-bold text-lg mt-1 mb-2 text-brand-dark">{b.title}</h3>
                  <p className="text-xs leading-relaxed mb-4 text-ink-muted flex-1">{b.description}</p>
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-heading text-xl font-extrabold text-brand-main">
                      {formatMoney(b.price_minor! / 100, 'GHS')}
                    </span>
                    <span className="btn-primary text-sm px-5 py-2">Order Now</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  )
}
