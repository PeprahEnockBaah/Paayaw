import Link from 'next/link'
import { notFound } from 'next/navigation'
import FitImage from '@/components/FitImage'
import OrderForm from './order-form'
import { getOrderableBook } from '@/lib/resources'
import { isPaystackTestMode } from '@/lib/paystack'
import { formatMoney } from '@/lib/giving'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: { id: string } }) {
  const book = await getOrderableBook(params.id)
  return { title: book ? `Order ${book.title} – Gideon Peprah Ministries` : 'Order – Gideon Peprah Ministries' }
}

export default async function OrderBookPage({ params }: { params: { id: string } }) {
  const book = await getOrderableBook(params.id)
  if (!book) notFound()

  return (
    <section className="bg-paper px-4 sm:px-6 py-8 sm:py-12">
      <div className="max-w-5xl mx-auto">
        <Link href="/order" className="inline-block text-sm font-semibold text-brand-main mb-5 hover:text-brand-dark">
          ← All books
        </Link>
        <div className="grid gap-6 lg:grid-cols-[320px_1fr] lg:gap-10 items-start">
          {/* Book */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex sm:block">
            <FitImage
              src={book.image_url}
              alt={book.title}
              className="w-32 sm:w-full flex-shrink-0 aspect-[3/4] sm:aspect-[4/3] lg:aspect-[3/4]"
              sizes="(min-width: 1024px) 320px, (min-width: 640px) 100vw, 128px"
              priority
            />
            <div className="p-4 sm:p-5 min-w-0">
              <span className="text-[10px] font-bold tracking-widest uppercase text-brand-main">{book.category}</span>
              <h1 className="font-heading text-xl sm:text-2xl font-extrabold text-brand-dark mt-1 mb-2 leading-tight">
                {book.title}
              </h1>
              <p className="font-heading text-2xl font-extrabold text-brand-main mb-2">
                {formatMoney(book.price_minor! / 100, 'GHS')}
              </p>
              {book.description && <p className="text-sm leading-relaxed text-ink-muted">{book.description}</p>}
            </div>
          </div>

          {/* Order form */}
          <OrderForm
            bookId={book.id}
            bookTitle={book.title}
            unitPriceMinor={book.price_minor!}
            testMode={isPaystackTestMode()}
          />
        </div>
      </div>
    </section>
  )
}
