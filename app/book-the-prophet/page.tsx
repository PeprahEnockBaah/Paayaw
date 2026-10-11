import BookingForm from './booking-form'
import BookingTabs from '@/components/BookingTabs'
import PageHeader from '@/components/PageHeader'

export const metadata = {
  title: 'Book the Prophet – Gideon Peprah Ministries',
  description: 'Invite Prophet Gideon Peprah to minister at your conference, crusade, church service or seminar.',
}

// Kept compact (slim title strip, three-column form) so the whole page fits on one laptop screen.
export default function BookTheProphetPage() {
  return (
    <>
      <PageHeader
        eyebrow="Invitations"
        title="Book the Prophet"
        description="To invite Prophet Gideon Peprah to minister at your conference, crusade, church service or seminar, fill in the form below. Our team will get back to you to confirm his availability."
      />

      <section className="bg-paper pt-5 pb-10 lg:py-6">
        <div className="page-container">
          <BookingTabs current="/book-the-prophet" />
          <BookingForm />
        </div>
      </section>
    </>
  )
}
