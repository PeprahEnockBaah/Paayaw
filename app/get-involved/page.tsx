import Link from 'next/link'

export const metadata = { title: 'Get Involved – Gideon Peprah Ministries' }

const tiers = [
  { tier: 'Friend', amount: 'Any Amount', perks: ['Prayer updates', 'Ministry newsletter', 'Partner certificate'] },
  { tier: 'Kingdom Builder', amount: 'GHS 100 / month', perks: ['All Friend benefits', 'Partner appreciation dinner', 'Exclusive teachings'] },
  { tier: 'Covenant Partner', amount: 'GHS 500 / month', perks: ['All Kingdom Builder benefits', 'Direct access to the Prophet', 'Dedicated prayer team'] },
]

// Kept compact (slim title strip; partner tiers, giving and volunteering on one screen) so the
// whole page fits on one laptop screen.
export default function GetInvolvedPage() {
  return (
    <>
      <section
        className="text-white px-6 py-5"
        style={{ background: 'linear-gradient(160deg, var(--brand-dark) 0%, #0e5a45 100%)' }}
      >
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-10">
          <div className="flex-shrink-0">
            <p className="text-xs tracking-[4px] uppercase font-bold mb-1.5" style={{ color: 'var(--gold-light)' }}>Join the Movement</p>
            <h1 className="font-heading text-3xl lg:text-4xl font-bold">Get Involved</h1>
          </div>
          <p className="text-sm leading-relaxed text-white/85 lg:border-l-2 lg:border-gold lg:pl-6">
            Partnership is at the heart of what we do. When you become a GPM partner, you are not just giving
            financially — you are joining us in prayer, in vision, and in the great commission. Your faithful support
            enables us to preach the Gospel, plant churches, support communities, and disciple the nations.
          </p>
        </div>
      </section>
      <div className="gold-bar" />

      <section className="bg-paper px-4 sm:px-6 py-4">
        <div className="max-w-6xl mx-auto">

          {/* Become a Partner */}
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-2">
            <h2 className="font-heading text-xl font-bold text-brand-dark">Become a Partner</h2>
            <p className="text-sm italic text-ink-muted">
              &ldquo;Your prayers and gifts of charity have ascended as a memorial offering before God.&rdquo; — Acts 10:4
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {tiers.map((t) => (
              <div
                key={t.tier}
                className={`rounded-xl px-4 py-3 bg-white border-2 ${t.tier === 'Kingdom Builder' ? 'border-gold' : 'border-brand-main/15'}`}
              >
                <div className="flex items-baseline justify-between gap-2 mb-1">
                  <h3 className="font-heading font-bold text-lg text-brand-dark">{t.tier}</h3>
                  <p className="text-sm font-bold text-brand-main whitespace-nowrap">{t.amount}</p>
                </div>
                <div className="flex items-end justify-between gap-3">
                  <ul className="space-y-0.5">
                    {t.perks.map((p) => (
                      <li key={p} className="text-sm flex items-start gap-2 text-ink-muted">
                        <span className="text-brand-main">✓</span> {p}
                      </li>
                    ))}
                  </ul>
                  <Link href="/contact" className="text-xs font-bold tracking-wide text-brand-main hover:text-brand-dark whitespace-nowrap">
                    Sign Up →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[11fr_9fr] gap-3 mt-3">
            {/* Give */}
            <div id="give" className="rounded-xl px-5 py-4 bg-brand-dark text-white scroll-mt-28 grid sm:grid-cols-[1fr_auto] gap-4 items-center">
              <div>
                <h2 className="font-heading text-xl font-bold mb-1">Give to GPM</h2>
                <p className="text-sm text-white/80 leading-snug">
                  Every seed you sow into GPM advances the Kingdom of God. Your generosity is building churches,
                  transforming communities, and changing lives.
                </p>
                <p className="mt-2 text-xs text-white/60">
                  For other giving methods or to discuss legacy giving, please{' '}
                  <Link href="/contact" className="underline" style={{ color: 'var(--brand-soft)' }}>contact us</Link>.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <a
                  href="/give"
                  className="flex items-center gap-3 rounded-lg px-4 py-2 transition-all hover:-translate-y-0.5"
                  style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(149,90,0,0.3)' }}
                >
                  <span className="text-2xl" aria-hidden>💳</span>
                  <span>
                    <span className="block font-bold text-sm">Give Online</span>
                    <span className="block text-xs text-white/70">PayPal, card, or mobile money</span>
                  </span>
                </a>
                <a
                  href="/give#other-ways"
                  className="flex items-center gap-3 rounded-lg px-4 py-2 transition-all hover:-translate-y-0.5"
                  style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(149,90,0,0.3)' }}
                >
                  <span className="text-2xl" aria-hidden>🏦</span>
                  <span>
                    <span className="block font-bold text-sm">Bank Transfer</span>
                    <span className="block text-xs text-white/70">Direct bank transfer details</span>
                  </span>
                </a>
              </div>
            </div>

            {/* Volunteer */}
            <div id="volunteer" className="rounded-xl px-5 py-4 bg-white border-2 border-brand-main/15 flex flex-col scroll-mt-28">
              <h2 className="font-heading text-xl font-bold mb-1 text-brand-dark">Volunteer With Us</h2>
              <p className="text-sm leading-snug mb-3 text-ink-muted flex-1">
                There are many ways to serve with GPM — from evangelism teams and media production to administration and
                community outreach. If you have a skill and a willing heart, we want to hear from you!
              </p>
              <Link href="/contact" className="btn-primary self-start text-sm px-6 py-2">Get In Touch to Volunteer</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
