import { DEFAULT_SLIDE_BUTTON, getSlideRows } from '@/lib/slides'
import { getOrderableBooks } from '@/lib/resources'
import { orderPath } from '@/lib/order-settings'
import ButtonLinkField, { type LinkOption } from './button-link-field'
import { deleteSlide, updateSlide } from './actions'
import EditDialog from './edit-dialog'
import { SLIDE_MESSAGES } from './messages'
import SlideForm from './slide-form'
import ConfirmDelete from './confirm-delete'
import { AddCard, Checkbox, ImageField, MoveButtons, MUTED, NotSetUp, Notice, SectionHeader, TextField, cardStyle } from './admin-ui'

export default async function SliderSection({ status }: { status?: string }) {
  const [slides, books] = await Promise.all([getSlideRows(), getOrderableBooks()])
  // Order pages the slide button can point to.
  // The main order page is always offered; each priced book also gets its own page.
  const linkOptions: LinkOption[] = [
    { label: 'Order page (all books)', url: '/order' },
    ...books.map((b) => ({ label: `Order: ${b.title}`, url: orderPath(b.id) })),
  ]
  const linkLabel = (url: string) => linkOptions.find((o) => o.url === url)?.label ?? url
  const msg = status ? SLIDE_MESSAGES[status] : undefined

  return (
    <div>
      <SectionHeader id="slider" title="Homepage Slider" hint="Images play in this order; new images go first. Use the arrows to reorder." />
      {/* Successes show as a pop-up; errors also stay here, next to the form. */}
      {msg && !msg[0] && <Notice ok={false}>{msg[1]}</Notice>}

      {slides === null ? (
        <NotSetUp what="The slider" />
      ) : (
        <>
          <AddCard title="Add an Image" open={!!msg && !msg[0]}>
            <SlideForm linkOptions={linkOptions} />
          </AddCard>
          {slides.length === 0 ? (
            <p className="text-sm" style={{ color: MUTED }}>
              No images yet. The website is showing the built-in images until you add one.
            </p>
          ) : (
            <div className="space-y-3">
              {slides.map((s, i) => (
                <div key={s.id} className="bg-white rounded-xl p-3 flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-4" style={cardStyle}>
                  <span className="w-6 text-center text-sm font-bold flex-shrink-0" style={{ color: MUTED }}>
                    {i + 1}
                  </span>
                  <img src={s.image_url} alt="" className="w-28 sm:w-32 aspect-video rounded-lg object-cover flex-shrink-0 bg-gray-100" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: 'var(--brand-dark)' }}>
                      {s.alt || 'Untitled image'}
                    </p>
                    {s.banner && (
                      <span className="inline-block mt-1 mr-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-pale text-brand-dark">
                        Banner
                      </span>
                    )}
                    {s.button_url && (
                      <span
                        title={linkLabel(s.button_url)}
                        className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800"
                      >
                        Button: {s.button_label || DEFAULT_SLIDE_BUTTON}
                      </span>
                    )}
                  </div>
                  <MoveButtons table="slides" id={s.id} index={i} count={slides.length} />
                  <EditDialog title="Edit slide" action={updateSlide} hidden={{ id: s.id, image_url: s.image_url }}>
                    <ImageField label="Image" currentUrl={s.image_url} />
                    <TextField label="Short description" name="alt" defaultValue={s.alt} />
                    <Checkbox name="banner" defaultChecked={s.banner}>
                      <strong>This is a designed banner</strong> (shown whole on phones instead of being cropped)
                    </Checkbox>
                    <ButtonLinkField options={linkOptions} defaultUrl={s.button_url} />
                    <TextField label="Button text" name="button_label" defaultValue={s.button_label} placeholder={DEFAULT_SLIDE_BUTTON} />
                  </EditDialog>
                  <ConfirmDelete
                    action={deleteSlide}
                    fields={{ id: s.id, image_url: s.image_url }}
                    title="Remove this image?"
                    message="It will disappear from the homepage slider. This cannot be undone."
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
