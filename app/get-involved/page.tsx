import Link from 'next/link'

export const metadata = { title: 'Get Involved – Gideon Peprah Ministries' }

export default function GetInvolvedPage() {
  return (
    <>
      <section
        className="relative flex items-center justify-center text-white text-center px-6 py-14 sm:py-20 lg:py-28"
        style={{ background: 'linear-gradient(160deg, var(--brand-dark) 0%, #96700f 100%)' }}
      >
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23e8c35a' fill-rule='evenodd'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4z'/%3E%3C/g%3E%3C/svg%3E")` }} />
        <div className="relative z-10">
          <p className="text-xs tracking-[4px] uppercase font-bold mb-4" style={{ color: 'var(--gold-light)' }}>Join the Movement</p>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">Get Involved</h1>
          <div className="w-16 h-1 mx-auto" style={{ background: 'var(--gold)' }} />
        </div>
      </section>
      <div className="gold-bar" />

      {/* Become a Partner */}
      <section className="max-w-4xl mx-auto px-6 py-14 sm:py-20 text-center">
        <h2 className="section-title mb-4">Become a Partner</h2>
        <div className="gold-underline mb-8" />
        <p className="text-base leading-relaxed mb-5" style={{ color: '#5c554c' }}>
          Partnership is at the heart of what we do. When you become a GPM partner, you are not just giving financially — you are joining us in prayer, in vision, and in the great commission. Your faithful support enables us to preach the Gospel, plant churches, support communities, and disciple the nations.
        </p>
        <p className="text-base leading-relaxed mb-10" style={{ color: '#5c554c' }}>
          <em>"Your prayers and gifts of charity have ascended as a memorial offering before God." — Acts 10:4</em>
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { tier: 'Friend', amount: 'Any Amount', perks: ['Prayer updates', 'Ministry newsletter', 'Partner certificate'] },
            { tier: 'Kingdom Builder', amount: 'GHS 100 / month', perks: ['All Friend benefits', 'Partner appreciation dinner', 'Exclusive teachings'] },
            { tier: 'Covenant Partner', amount: 'GHS 500 / month', perks: ['All Kingdom Builder benefits', 'Direct access to the Prophet', 'Dedicated prayer team'] },
          ].map((t) => (
            <div
              key={t.tier}
              className="rounded-2xl p-6 text-left"
              style={{ background: 'var(--brand-pale)', border: '2px solid var(--gold)', borderColor: t.tier === 'Kingdom Builder' ? 'var(--gold)' : 'rgba(150,112,15,0.15)' }}
            >
              <h3 className="font-heading font-bold text-xl mb-1" style={{ color: 'var(--brand-dark)' }}>{t.tier}</h3>
              <p className="text-sm font-bold mb-4" style={{ color: 'var(--gold-dark)' }}>{t.amount}</p>
              <ul className="space-y-2">
                {t.perks.map((p) => (
                  <li key={p} className="text-sm flex items-start gap-2" style={{ color: '#5c554c' }}>
                    <span style={{ color: 'var(--brand-main)' }}>✓</span> {p}
                  </li>
                ))}
              </ul>
              <Link
                href="/contact"
                className="inline-block mt-5 text-xs font-bold tracking-wide"
                style={{ color: 'var(--brand-main)' }}
              >
                Sign Up →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Give Section */}
      <section id="give" style={{ background: 'var(--brand-dark)' }} className="py-14 sm:py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-heading text-4xl font-bold text-white mb-3">Give to GPM</h2>
          <div className="w-16 h-1 mx-auto mb-8" style={{ background: 'var(--gold)' }} />
          <p className="text-white/80 mb-10 leading-relaxed max-w-xl mx-auto">
            Every seed you sow into GPM advances the Kingdom of God. Your generosity is building churches, transforming communities, and changing lives.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-xl mx-auto">
            <a
              href="#"
              className="block rounded-xl p-6 text-center text-white transition-all hover:-translate-y-1"
              style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(149,90,0,0.3)' }}
            >
              <div className="text-3xl mb-3">💳</div>
              <h3 className="font-bold mb-1" style={{ color: 'var(--gold-light)' }}>Give Online</h3>
              <p className="text-sm text-white/70">Secure giving via PayPal, card, or mobile money</p>
            </a>
            <a
              href="#"
              className="block rounded-xl p-6 text-center text-white transition-all hover:-translate-y-1"
              style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(149,90,0,0.3)' }}
            >
              <div className="text-3xl mb-3">🏦</div>
              <h3 className="font-bold mb-1" style={{ color: 'var(--gold-light)' }}>Bank Transfer</h3>
              <p className="text-sm text-white/70">Contact us for direct bank transfer details</p>
            </a>
          </div>
          <p className="mt-10 text-sm text-white/50">
            For other giving methods or to discuss legacy giving, please{' '}
            <Link href="/contact" className="underline" style={{ color: 'var(--gold-light)' }}>contact us</Link>.
          </p>
        </div>
      </section>

      {/* Volunteer */}
      <section id="volunteer" className="max-w-4xl mx-auto px-6 py-14 sm:py-20 text-center">
        <h2 className="section-title mb-4">Volunteer With Us</h2>
        <div className="gold-underline mb-6" />
        <p className="leading-relaxed mb-8" style={{ color: '#5c554c' }}>
          There are many ways to serve with GPM — from evangelism teams and media production to administration and community outreach. If you have a skill and a willing heart, we want to hear from you!
        </p>
        <Link href="/contact" className="btn-primary">Get In Touch to Volunteer</Link>
      </section>
    </>
  )
}
