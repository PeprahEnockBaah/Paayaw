import { isAuthed } from '@/lib/auth'
import { getEvents, splitDate, tagColors } from '@/lib/events'
import { logout, deleteEvent, updateEvent } from './actions'
import EditDialog from './edit-dialog'
import { EVENT_TAGS } from '@/lib/event-tags'
import LoginForm from './login-form'
import EventForm from './event-form'
import ConfirmDelete from './confirm-delete'
import SliderSection from './slider-section'
import SermonsSection from './sermons-section'
import BooksSection from './books-section'
import DonationsSection from './donations-section'
import OrdersSection from './orders-section'
import Toast from './toast'
import AdminTabs from './admin-tabs'
import { adminMessage } from './messages'
import { AddCard, Checkbox, ImageField, SectionHeader, SelectField, TextArea, TextField } from './admin-ui'

export const metadata = {
  title: 'Website Admin – GPM',
  // Keep the admin page out of Google and other search engines.
  robots: { index: false, follow: false },
}
export const dynamic = 'force-dynamic'

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Record<string, string | undefined>
}) {
  if (!isAuthed()) {
    const error = searchParams.error === 'locked' ? 'locked' : searchParams.error ? 'wrong' : undefined
    return (
      <>
        <LoginForm error={error} attemptsLeft={Number(searchParams.left) || undefined} />
        <Toast message={searchParams.loggedout ? { ok: true, text: 'You’ve been logged out.' } : null} />
      </>
    )
  }

  const events = await getEvents('newest')

  const eventError = searchParams.error === 'save' || searchParams.error === 'missing'

  const eventsTab = (
    <>
      <SectionHeader title="Events" hint="Latest added first. On the public Events page they're shown by date." />

      {searchParams.error === 'save' && (
        <p className="text-sm mb-6 px-4 py-2.5 rounded-lg bg-red-50 text-red-700">
          Could not save the event. Check that Supabase is configured correctly.
        </p>
      )}
      {searchParams.error === 'missing' && (
        <p className="text-sm mb-6 px-4 py-2.5 rounded-lg bg-red-50 text-red-700">
          Title and date are required.
        </p>
      )}

      <AddCard title="Add a New Event" open={eventError}>
        <EventForm />
      </AddCard>

      {/* Existing events */}
      <h3 className="font-heading text-lg font-bold mb-4" style={{ color: 'var(--brand-dark)' }}>
        Current Events ({events.length})
      </h3>
      {events.length === 0 ? (
        <p className="text-sm" style={{ color: '#66736d' }}>
          No events yet. Add your first one above.
        </p>
      ) : (
        <div className="space-y-3">
          {events.map((e) => {
            const d = splitDate(e.event_date)
            return (
              <div
                key={e.id}
                className="bg-white rounded-xl p-4 flex items-center gap-4"
                style={{ border: '1px solid rgba(14,90,69,0.1)' }}
              >
                <div
                  className="flex flex-col items-center justify-center rounded-lg px-3 py-2 text-white flex-shrink-0"
                  style={{ background: 'var(--brand-dark)', minWidth: '64px' }}
                >
                  <span className="text-xl font-black font-heading leading-none">{d.day}</span>
                  <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: 'var(--brand-soft)' }}>
                    {d.month}
                  </span>
                </div>
                {e.image_url && (
                  <img src={e.image_url} alt="" className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold truncate" style={{ color: 'var(--brand-dark)' }}>
                      {e.title}
                    </h3>
                    {e.tag && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${tagColors[e.tag] || 'bg-gray-100 text-gray-600'}`}>
                        {e.tag}
                      </span>
                    )}
                  </div>
                  <p className="text-xs truncate" style={{ color: '#66736d' }}>
                    {[e.location, e.time].filter(Boolean).join(' · ')}
                  </p>
                </div>
                <EditDialog title="Edit event" action={updateEvent} hidden={{ id: e.id, image_url: e.image_url || '' }}>
                  <TextField label="Title" name="title" defaultValue={e.title} required />
                  <div className="grid grid-cols-2 gap-3">
                    <TextField label="Date" name="event_date" type="date" defaultValue={e.event_date} required />
                    <TextField label="Time" name="time" defaultValue={e.time} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <TextField label="Location" name="location" defaultValue={e.location} />
                    <SelectField label="Category" name="tag" defaultValue={e.tag} options={EVENT_TAGS} />
                  </div>
                  <TextArea label="Description" name="description" defaultValue={e.description} />
                  <ImageField label="Photo / Flyer" currentUrl={e.image_url} />
                  {e.image_url && <Checkbox name="remove_image">Remove the current photo</Checkbox>}
                </EditDialog>
                <ConfirmDelete
                  action={deleteEvent}
                  fields={{ id: e.id, image_url: e.image_url || '' }}
                  title="Delete this event?"
                  message={`"${e.title}" will be removed from the Events page. This cannot be undone.`}
                />
              </div>
            )
          })}
        </div>
      )}

    </>
  )

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 pb-16">
      <header className="flex items-center justify-between gap-4 mb-2">
        <div className="min-w-0">
          <h1 className="font-heading text-2xl sm:text-3xl font-bold" style={{ color: 'var(--brand-dark)' }}>
            Website Admin
          </h1>
          <p className="text-sm mt-0.5" style={{ color: '#66736d' }}>
            Changes appear on the website right away.
          </p>
        </div>
        <div className="flex items-center gap-4 flex-shrink-0">
          <a href="/" target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-brand-main hover:underline">
            View website ↗
          </a>
          <form action={logout}>
            <button type="submit" className="text-sm font-semibold px-4 py-2 rounded-full bg-brand-pale text-brand-dark hover:bg-brand-light/30 transition-colors">
              Log out
            </button>
          </form>
        </div>
      </header>

      <Toast message={adminMessage(searchParams)} />

      <AdminTabs
        tabs={[
          { id: 'slider', label: 'Slider', content: <SliderSection status={searchParams.slide} /> },
          { id: 'sermons', label: 'Sermons', content: <SermonsSection status={searchParams.sermon} /> },
          { id: 'books', label: 'Books', content: <BooksSection status={searchParams.book} /> },
          { id: 'events', label: `Events (${events.length})`, content: eventsTab },
          { id: 'orders', label: 'Orders', content: <OrdersSection /> },
          { id: 'donations', label: 'Donations', content: <DonationsSection /> },
        ]}
      />
    </section>
  )
}
