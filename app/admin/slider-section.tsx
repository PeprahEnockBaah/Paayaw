import { getSlideRows } from '@/lib/slides'
import { deleteSlide } from './actions'
import SlideForm from './slide-form'
import ConfirmDelete from './confirm-delete'
import { AddCard, MoveButtons, MUTED, NotSetUp, Notice, SectionHeader, cardStyle } from './admin-ui'

const messages: Record<string, [boolean, string]> = {
  added: [true, 'Image added to the slider.'],
  deleted: [true, 'Image removed from the slider.'],
  missing: [false, 'Please choose an image file.'],
  error: [false, 'Could not upload the image. Please try again.'],
}

export default async function SliderSection({ status }: { status?: string }) {
  const slides = await getSlideRows()
  const msg = status ? messages[status] : undefined

  return (
    <div className="mb-16">
      <SectionHeader id="slider" title="Homepage Slider" hint="Images play in this order. Use the arrows to reorder." />
      {msg && <Notice ok={msg[0]}>{msg[1]}</Notice>}

      {slides === null ? (
        <NotSetUp what="The slider" />
      ) : (
        <>
          <AddCard title="Add an Image">
            <SlideForm />
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
                      <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-pale text-brand-dark">
                        Banner
                      </span>
                    )}
                  </div>
                  <MoveButtons table="slides" id={s.id} index={i} count={slides.length} />
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
