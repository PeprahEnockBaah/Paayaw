import { getContactInfoRow } from '@/lib/contact-info'
import { updateContactInfo } from './actions'
import { CONTACT_MESSAGES } from './messages'
import { NotSetUp, Notice, SectionHeader, TextArea, TextField, cardStyle } from './admin-ui'

export default async function ContactSection({ status }: { status?: string }) {
  const info = await getContactInfoRow()
  const msg = status ? CONTACT_MESSAGES[status] : undefined

  return (
    <div>
      <SectionHeader
        title="Contact Details"
        hint="Shown on the Contact Us page. The phone and email are also given to visitors if a form can't be sent."
      />
      {/* Successes show as a pop-up; errors also stay here, next to the form. */}
      {msg && !msg[0] && <Notice ok={false}>{msg[1]}</Notice>}

      {info === null ? (
        <NotSetUp what="Contact details" />
      ) : (
        <form action={updateContactInfo} className="bg-white rounded-2xl shadow-sm p-5 sm:p-6 space-y-4" style={cardStyle}>
          <div className="grid sm:grid-cols-2 gap-4">
            <TextField label="Phone" name="phone" type="tel" defaultValue={info.phone} required />
            <TextField label="Email" name="email" type="email" defaultValue={info.email} required />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <TextArea label="Address" name="address" defaultValue={info.address} rows={4} />
              <span className="block mt-1 text-[11px] text-ink-soft">Each line shows on its own line on the website.</span>
            </div>
            <div>
              <TextArea label="Office hours" name="hours" defaultValue={info.hours} rows={4} />
              <span className="block mt-1 text-[11px] text-ink-soft">One line per day or set of days, e.g. Mon – Fri: 9:00 AM – 5:00 PM</span>
            </div>
          </div>
          <div className="flex justify-end">
            <button type="submit" className="btn-primary text-sm px-6 py-2.5">Save Contact Details</button>
          </div>
        </form>
      )}
    </div>
  )
}
