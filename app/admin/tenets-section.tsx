import { getTenetRows } from '@/lib/tenets'
import { deleteTenet, updateTenet } from './actions'
import EditDialog from './edit-dialog'
import { TENET_MESSAGES } from './messages'
import TenetForm from './tenet-form'
import ConfirmDelete from './confirm-delete'
import { AddCard, MoveButtons, MUTED, NotSetUp, Notice, SectionHeader, TextArea, TextField, cardStyle } from './admin-ui'

export default async function TenetsSection({ status }: { status?: string }) {
  const tenets = await getTenetRows()
  const msg = status ? TENET_MESSAGES[status] : undefined

  return (
    <div>
      <SectionHeader id="tenets" title="Tenets of Faith" hint="Shown on the About Us page's Tenets of Faith tab, in this order." />
      {/* Successes show as a pop-up; errors also stay here, next to the form. */}
      {msg && !msg[0] && <Notice ok={false}>{msg[1]}</Notice>}

      {tenets === null ? (
        <NotSetUp what="Tenets of Faith" />
      ) : (
        <>
          <AddCard title="Add a Tenet" open={!!msg && !msg[0]}>
            <TenetForm />
          </AddCard>
          {tenets.length === 0 ? (
            <p className="text-sm" style={{ color: MUTED }}>
              No tenets yet. The Tenets of Faith tab says they&apos;ll be published soon until you add one.
            </p>
          ) : (
            <div className="space-y-3">
              {tenets.map((t, i) => (
                <div key={t.id} className="bg-white rounded-xl p-3 sm:p-4 flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-4" style={cardStyle}>
                  <span className="w-6 text-center text-sm font-bold flex-shrink-0" style={{ color: MUTED }}>
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: 'var(--brand-dark)' }}>
                      {t.title}
                    </p>
                    <p className="text-xs line-clamp-2" style={{ color: MUTED }}>{t.body}</p>
                  </div>
                  <MoveButtons table="tenets" id={t.id} index={i} count={tenets.length} />
                  <EditDialog title="Edit tenet" action={updateTenet} hidden={{ id: t.id }}>
                    <TextField label="Title" name="title" defaultValue={t.title} required />
                    <TextArea label="What we believe" name="body" defaultValue={t.body} rows={4} />
                  </EditDialog>
                  <ConfirmDelete
                    action={deleteTenet}
                    fields={{ id: t.id }}
                    title="Remove this tenet?"
                    message={`"${t.title}" will be removed from the About Us page. This cannot be undone.`}
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
