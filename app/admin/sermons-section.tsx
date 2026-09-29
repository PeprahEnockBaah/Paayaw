import { getSermonRows } from '@/lib/resources'
import { deleteSermon, updateSermon } from './actions'
import EditDialog from './edit-dialog'
import { SERMON_MESSAGES } from './messages'
import SermonForm from './sermon-form'
import ConfirmDelete from './confirm-delete'
import { AddCard, MoveButtons, MUTED, NotSetUp, Notice, SectionHeader, TextField, cardStyle } from './admin-ui'

export default async function SermonsSection({ status }: { status?: string }) {
  const sermons = await getSermonRows()
  const msg = status ? SERMON_MESSAGES[status] : undefined

  return (
    <div>
      <SectionHeader
        id="sermons"
        title="Audio Sermons"
        hint="Sermons from Audiomack, shown on the Resources page in this order; the first one plays on the homepage."
      />
      {/* Successes show as a pop-up; errors also stay here, next to the form. */}
      {msg && !msg[0] && <Notice ok={false}>{msg[1]}</Notice>}

      {sermons === null ? (
        <NotSetUp what="Audio sermons" />
      ) : (
        <>
          <AddCard title="Add a Sermon" open={!!msg && !msg[0]}>
            <SermonForm />
          </AddCard>
          {sermons.length === 0 ? (
            <p className="text-sm" style={{ color: MUTED }}>
              No sermons yet. The website is showing the built-in sermon until you add one.
            </p>
          ) : (
            <div className="space-y-3">
              {sermons.map((s, i) => (
                <div key={s.id} className="bg-white rounded-xl p-3 sm:p-4 flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-4" style={cardStyle}>
                  <span className="w-6 text-center text-sm font-bold flex-shrink-0" style={{ color: MUTED }}>
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: 'var(--brand-dark)' }}>
                      {s.title}
                    </p>
                    <a
                      href={s.audiomack_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs truncate block hover:underline"
                      style={{ color: MUTED }}
                    >
                      Open on Audiomack ↗
                    </a>
                  </div>
                  <MoveButtons table="sermons" id={s.id} index={i} count={sermons.length} />
                  <EditDialog title="Edit sermon" action={updateSermon} hidden={{ id: s.id }}>
                    <TextField label="Sermon title" name="title" defaultValue={s.title} required />
                    <TextField label="Audiomack link" name="audiomack_url" type="url" defaultValue={s.audiomack_url} required />
                  </EditDialog>
                  <ConfirmDelete
                    action={deleteSermon}
                    fields={{ id: s.id }}
                    title="Remove this sermon?"
                    message={`"${s.title}" will be removed from the website. It stays on Audiomack.`}
                    confirmLabel="Remove"
                  />
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
