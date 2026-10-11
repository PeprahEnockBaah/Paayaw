import { socialLinks } from '@/components/SocialIcons'
import ContactForm from './contact-form'
import { getContactInfo } from '@/lib/contact-info'
import PageHeader from '@/components/PageHeader'

export const metadata = { title: 'Contact Us – Gideon Peprah Ministries' }

// Contact details are edited from /admin; saving there also refreshes this page immediately.
export const revalidate = 60

// Kept compact (slim title strip, details beside the form) so the whole page fits on one laptop screen.
export default async function ContactPage() {
  const info = await getContactInfo()
  const details = [
    { icon: '📍', label: 'Address', value: info.address },
    { icon: '📞', label: 'Phone', value: info.phone, href: `tel:${info.phone.replace(/[^\d+]/g, '')}` },
    { icon: '✉️', label: 'Email', value: info.email, href: `mailto:${info.email}` },
    { icon: '🕐', label: 'Office Hours', value: info.hours },
  ]

  return (
    <>
      <PageHeader
        eyebrow="Get In Touch"
        title="Contact Us"
        description="Whether you have a prayer request, want to partner with us, or simply want to know more about GPM, we are here for you. Send us a message or reach us through any of the channels below."
      />

      <section className="bg-paper pt-5 pb-10 sm:py-5">
        <div className="page-container grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-6 lg:gap-8">

          {/* Contact details */}
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-x-6 gap-y-3.5">
              {details.map((c) => (
                <div key={c.label} className="flex gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0 bg-brand-pale">
                    {c.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold tracking-widest uppercase mb-0.5 text-brand-main">{c.label}</p>
                    <p className="text-sm leading-snug whitespace-pre-line text-ink-muted break-words">
                      {c.href ? (
                        <a href={c.href} className="hover:text-brand-main hover:underline">{c.value}</a>
                      ) : (
                        c.value
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Social */}
            <div>
              <p className="text-xs font-bold tracking-widest uppercase mb-3 text-brand-main">Follow Us</p>
              <div className="flex flex-wrap gap-2">
                {socialLinks.filter((s) => s.href).map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 sm:px-4 py-2 rounded-full text-xs font-bold transition-colors text-white bg-brand-dark hover:bg-brand-main"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-5 lg:px-5 lg:py-4" style={{ border: '1px solid rgba(14,90,69,0.1)' }}>
            <p className="font-heading text-lg font-bold mb-2 text-brand-dark">Send Us a Message</p>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  )
}
