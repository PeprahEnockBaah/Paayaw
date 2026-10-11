import { getLeaderRows, LEADER_GROUPS, type Leader } from '@/lib/leaders'
import { deleteLeader, updateLeader } from './actions'
import EditDialog from './edit-dialog'
import { LEADER_MESSAGES } from './messages'
import LeaderForm from './leader-form'
import ConfirmDelete from './confirm-delete'
import { AddCard, ImageField, MoveButtons, MUTED, NotSetUp, Notice, SectionHeader, SelectField, TextField, cardStyle } from './admin-ui'

export default async function LeadersSection({ status }: { status?: string }) {
  const leaders = await getLeaderRows()
  const msg = status ? LEADER_MESSAGES[status] : undefined

  return (
    <div>
      <SectionHeader
        id="leadership"
        title="Leadership"
        hint="Shown on the About Us page: Leadership on the left, Staff on the right, each in this order. The tab appears there once anyone is added."
      />
      {/* Successes show as a pop-up; errors also stay here, next to the form. */}
      {msg && !msg[0] && <Notice ok={false}>{msg[1]}</Notice>}

      {leaders === null ? (
        <NotSetUp what="Leadership" />
      ) : (
        <>
          <AddCard title="Add Leadership or Staff" open={!!msg && !msg[0]}>
            <LeaderForm />
          </AddCard>
          {leaders.length === 0 ? (
            <p className="text-sm" style={{ color: MUTED }}>
              No one added yet. The Leadership tab is hidden from the About Us page until you add someone.
            </p>
          ) : (
            <div className="space-y-6">
              {LEADER_GROUPS.map((group) => (
                <PeopleList key={group} title={group} people={leaders.filter((l) => l.team === group)} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

function PeopleList({ title, people }: { title: string; people: Leader[] }) {
  return (
    <div>
      <h3 className="font-heading text-lg font-bold mb-3" style={{ color: 'var(--brand-dark)' }}>
        {title} ({people.length})
      </h3>
      {people.length === 0 ? (
        <p className="text-sm" style={{ color: MUTED }}>No one here yet.</p>
      ) : (
        <div className="space-y-3">
          {people.map((l, i) => (
            <div key={l.id} className="bg-white rounded-xl p-3 flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-4" style={cardStyle}>
              <span className="w-6 text-center text-sm font-bold flex-shrink-0" style={{ color: MUTED }}>
                {i + 1}
              </span>
              <img src={l.image_url} alt="" className="w-14 h-14 rounded-full object-cover object-top flex-shrink-0 bg-gray-100" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate" style={{ color: 'var(--brand-dark)' }}>
                  {l.name}
                </p>
                <p className="text-xs truncate" style={{ color: MUTED }}>{l.role}</p>
              </div>
              <MoveButtons table="leaders" id={l.id} index={i} count={people.length} />
              <EditDialog title="Edit" action={updateLeader} hidden={{ id: l.id, image_url: l.image_url }}>
                <SelectField label="Show under" name="team" defaultValue={l.team} options={LEADER_GROUPS} />
                <TextField label="Name" name="name" defaultValue={l.name} required />
                <TextField label="Role / title" name="role" defaultValue={l.role} required />
                <ImageField label="Photo" currentUrl={l.image_url} />
              </EditDialog>
              <ConfirmDelete
                action={deleteLeader}
                fields={{ id: l.id, image_url: l.image_url }}
                title="Remove this person?"
                message={`${l.name} will be removed from the About Us page. This cannot be undone.`}
                confirmLabel="Remove"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
