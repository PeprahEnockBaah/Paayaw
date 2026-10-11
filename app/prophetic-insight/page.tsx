import InsightForm from './insight-form'
import BookingTabs from '@/components/BookingTabs'
import { isPaystackTestMode } from '@/lib/paystack'
import { chargeableCurrencies, getRatesPerUsd } from '@/lib/fx'
import { CURRENCY_CODES } from '@/lib/giving'
import PageHeader from '@/components/PageHeader'

export const metadata = {
  title: 'Prophetic Insight – Gideon Peprah Ministries',
  description:
    'Not fortune telling: a private 1-on-1 with Prophet Gideon Peprah to locate your destiny and receive divine direction for your past, present and future.',
}
export const dynamic = 'force-dynamic'

// Kept compact like Book the Prophet (slim title strip, three-column form) so it fits on one laptop screen.
export default async function PropheticInsightPage() {
  // Currencies Paystack can't charge are converted, so they're only offered when today's rates are available.
  const chargeable = chargeableCurrencies()
  const rates = await getRatesPerUsd()
  const currencies = CURRENCY_CODES.filter((c) => chargeable.includes(c) || !!rates)
  return (
    <>
      <PageHeader
        eyebrow="One-on-One Counselling of Destiny"
        title="Prophetic Insight"
        description={
          <>
            <strong className="text-white">Not fortune telling</strong> &mdash; a private 1-on-1 to locate your destiny and
            receive divine direction for your past, present and future.
          </>
        }
      />

      <section className="bg-paper pt-5 pb-10 lg:py-6">
        <div className="page-container">
          <BookingTabs current="/prophetic-insight" />
          <InsightForm testMode={isPaystackTestMode()} currencies={currencies} />
        </div>
      </section>
    </>
  )
}
