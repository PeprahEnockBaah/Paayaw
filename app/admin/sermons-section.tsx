import { getSermonRows } from '@/lib/resources'
import { deleteSermon } from './actions'
import SermonForm from './sermon-form'
import ConfirmDelete from './confirm-delete'
import { AddCard, MoveButtons, MUTED, NotSetUp, Notice, SectionHeader, cardStyle } from './admin-ui'

const messages: Record<string, [boolean, string]> = {
  added: [true, 'Sermon added to the Resources page.'],
  deleted: [true, 'Sermon removed.'],
  missing: [false, 'Please enter a title for the sermon.'],
  badlink: [false, 'That doesn’t look like an Audiomack sermon link. Open the sermon on Audiomack, tap Share → Copy link, and paste it.'],
  error: [false, 'Could not save the sermon. Please try again.'],
}

export default async function SermonsSection({ status }: { status?: string }) {
  const sermons = await getSermonRows()
  const msg = status ? messages[status] : undefined

  return (
    <div className="mb-16">
      <SectionHeader
        id="sermons"
        title="Audio Sermons"
        hint="Sermons from Audiomack, shown on the Resources page in this order."
      />
      {msg && <Notice ok={msg[0]}>{msg[1]}</Notice>}

      {sermons === null ? (
        <NotSetUp what="Audio sermons" />
      ) : (
        <>
          <AddCard title="Add a Sermon">
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
