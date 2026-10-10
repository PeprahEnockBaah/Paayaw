import BookingForm from './booking-form'

export const metadata = {
  title: 'Book the Prophet – Gideon Peprah Ministries',
  description: 'Invite Prophet Gideon Peprah to minister at your conference, crusade, church service or seminar.',
}

// Kept compact (slim title strip, three-column form) so the whole page fits on one laptop screen.
export default function BookTheProphetPage() {
  return (
    <>
      <section
        className="text-white px-6 py-5"
        style={{ background: 'linear-gradient(160deg, var(--brand-dark) 0%, #0e5a45 100%)' }}
      >
        <div className="max-w-5xl mx-auto flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-10">
          <div className="flex-shrink-0">
            <p className="text-xs tracking-[4px] uppercase font-bold mb-1.5" style={{ color: 'var(--gold-light)' }}>Invitations</p>
            <h1 className="font-heading text-3xl lg:text-4xl font-bold">Book the Prophet</h1>
          </div>
          <p className="text-sm lg:text-[15px] leading-relaxed text-white/85 lg:border-l-2 lg:border-gold lg:pl-6">
            To invite Prophet Gideon Peprah to minister at your conference, crusade, church service or seminar,
            fill in the form below. Our team will get back to you to confirm his availability.
          </p>
        </div>
      </section>
      <div className="gold-bar" />

      <section className="bg-paper px-4 sm:px-6 py-5 lg:py-6">
        <div className="max-w-5xl mx-auto">
          <BookingForm />
        </div>
      </section>
    </>
  )
}
