import Link from 'next/link'
import GiveForm from './give-form'
import OtherWaysDialog from './other-ways-dialog'
import { isPaystackTestMode } from '@/lib/paystack'
import { chargeableCurrencies, getRatesPerUsd } from '@/lib/fx'
import { BANK_DETAILS, MOMO_DETAILS, hasBankDetails, hasMomoDetails } from '@/lib/giving-details'

export const metadata = {
  title: 'Give – Gideon Peprah Ministries',
  description: 'Support the work of Gideon Peprah Ministries with a secure online gift by Mobile Money or card.',
}

// Laid out to fit on one laptop screen (≈1366×768) without scrolling:
// a slim title row, then the three-step form side by side.
export default async function GivePage() {
  const ratesPerUsd = await getRatesPerUsd()

  const otherWays = [
    ...(hasMomoDetails()
      ? [{
          title: MOMO_DETAILS.network || 'Mobile Money',
          rows: [
            { label: 'Number', value: MOMO_DETAILS.number, copy: true },
            { label: 'Name', value: MOMO_DETAILS.name },
          ],
        }]
      : []),
    ...(hasBankDetails()
      ? [{
          title: 'Bank transfer',
          rows: [
            { label: 'Bank', value: BANK_DETAILS.bank },
            { label: 'Account name', value: BANK_DETAILS.accountName },
            { label: 'Account number', value: BANK_DETAILS.accountNumber, copy: true },
            { label: 'Branch', value: BANK_DETAILS.branch },
          ],
        }]
      : []),
  ]

  return (
    <section className="bg-paper px-4 sm:px-6 py-4">
      <div className="max-w-6xl mx-auto">
          <GiveForm
            testMode={isPaystackTestMode()}
            header={
              <>
                <h1 className="font-heading text-3xl lg:text-4xl font-extrabold text-brand-main leading-none">Give</h1>
                <p className="text-sm text-ink-muted mt-1.5">
                  Partner with us to advance the Mission.{' '}
                  <span className="italic text-brand-dark">&ldquo;God loves a cheerful giver.&rdquo;</span>{' '}
                  <span className="font-semibold text-brand-main">2 Cor 9:7</span>
                </p>
              </>
            }
            chargeable={chargeableCurrencies()}
            ratesPerUsd={ratesPerUsd}
            footer={
              <>
                {otherWays.length > 0 && <OtherWaysDialog groups={otherWays} />}
                <span>
                  Questions?{' '}
                  <Link href="/contact" className="font-semibold text-brand-main underline underline-offset-2">
                    Contact us
                  </Link>
                </span>
              </>
            }
          />

      </div>
    </section>
  )
}
