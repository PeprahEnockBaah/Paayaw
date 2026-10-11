import { formatNewsDate, getNewsRows, HOME_NEWS_COUNT } from '@/lib/news'
import { deleteNews, updateNews } from './actions'
import EditDialog from './edit-dialog'
import { NEWS_MESSAGES } from './messages'
import NewsForm from './news-form'
import ConfirmDelete from './confirm-delete'
import { AddCard, ImageField, MoveButtons, MUTED, NotSetUp, Notice, SectionHeader, TextArea, TextField, cardStyle } from './admin-ui'

export default async function NewsSection({ status }: { status?: string }) {
  const news = await getNewsRows()
  const msg = status ? NEWS_MESSAGES[status] : undefined

  return (
    <div>
      <SectionHeader
        id="news"
        title="News & Updates"
        hint={`The "Stay Updated" section on the homepage shows the first ${HOME_NEWS_COUNT}; new updates go first. Use the arrows to reorder.`}
      />
      {/* Successes show as a pop-up; errors also stay here, next to the form. */}
      {msg && !msg[0] && <Notice ok={false}>{msg[1]}</Notice>}

      {news === null ? (
        <NotSetUp what="News & updates" />
      ) : (
        <>
          <AddCard title="Add an Update" open={!!msg && !msg[0]}>
            <NewsForm />
          </AddCard>
          {news.length === 0 ? (
            <p className="text-sm" style={{ color: MUTED }}>
              No updates yet. The “Stay Updated” section is hidden from the homepage until you add one.
            </p>
          ) : (
            <div className="space-y-3">
              {news.map((n, i) => (
                <div key={n.id} className="bg-white rounded-xl p-3 flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-4" style={cardStyle}>
                  <span className="w-6 text-center text-sm font-bold flex-shrink-0" style={{ color: MUTED }}>
                    {i + 1}
                  </span>
                  <img src={n.image_url} alt="" className="w-24 sm:w-28 aspect-[3/2] rounded-lg object-cover flex-shrink-0 bg-gray-100" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: 'var(--brand-dark)' }}>
                      {n.title}
                    </p>
                    <p className="text-xs" style={{ color: MUTED }}>{formatNewsDate(n.news_date)}</p>
                    {i < HOME_NEWS_COUNT && (
                      <span className="inline-block mt-1 mr-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-pale text-brand-dark">
                        On homepage
                      </span>
                    )}
                    {n.body.trim() && (
                      <span className="inline-block mt-1 mr-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800">
                        Has full story
                      </span>
                    )}
                  </div>
                  <MoveButtons table="news" id={n.id} index={i} count={news.length} />
                  <EditDialog title="Edit update" action={updateNews} hidden={{ id: n.id, image_url: n.image_url }}>
                    <TextField label="Headline" name="title" defaultValue={n.title} required />
                    <TextField label="Date" name="news_date" type="date" defaultValue={n.news_date} required />
                    <ImageField label="Image" currentUrl={n.image_url} />
                    <TextArea label="Full story (optional)" name="body" defaultValue={n.body} rows={6} />
                    <TextField label="“Read more” link (optional)" name="link_url" defaultValue={n.link_url} placeholder="e.g. /media or youtube.com/…" />
                  </EditDialog>
                  <ConfirmDelete
                    action={deleteNews}
                    fields={{ id: n.id, image_url: n.image_url }}
                    title="Remove this update?"
                    message={`"${n.title}" will be removed from the website. This cannot be undone.`}
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
