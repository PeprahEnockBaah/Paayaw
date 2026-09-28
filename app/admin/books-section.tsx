import { getBookRows } from '@/lib/resources'
import { formatMoney } from '@/lib/giving'
import { deleteBook, updateBook } from './actions'
import EditDialog from './edit-dialog'
import { BOOK_MESSAGES } from './messages'
import { BOOK_CATEGORIES } from '@/lib/book-categories'
import BookForm from './book-form'
import ConfirmDelete from './confirm-delete'
import { AddCard, ImageField, MoveButtons, MUTED, NotSetUp, Notice, SectionHeader, SelectField, TextArea, TextField, cardStyle } from './admin-ui'

export default async function BooksSection({ status }: { status?: string }) {
  const books = await getBookRows()
  const msg = status ? BOOK_MESSAGES[status] : undefined

  return (
    <div className="mb-16">
      <SectionHeader
        id="books"
        title="Books & Devotionals"
        hint="Shown on the Resources page in this order; new books go first."
      />
      {/* Successes show as a pop-up; errors also stay here, next to the form. */}
      {msg && !msg[0] && <Notice ok={false}>{msg[1]}</Notice>}

      {books === null ? (
        <NotSetUp what="Books" />
      ) : (
        <>
          <AddCard title="Add a Book">
            <BookForm />
          </AddCard>
          {books.length === 0 ? (
            <p className="text-sm" style={{ color: MUTED }}>
              No books yet. The website is showing the built-in books until you add one.
            </p>
          ) : (
            <div className="space-y-3">
              {books.map((b, i) => (
                <div key={b.id} className="bg-white rounded-xl p-3 flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-4" style={cardStyle}>
                  <span className="w-6 text-center text-sm font-bold flex-shrink-0" style={{ color: MUTED }}>
                    {i + 1}
                  </span>
                  <img src={b.image_url} alt="" className="w-14 h-[74px] rounded-md object-cover flex-shrink-0 bg-gray-100" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: 'var(--brand-dark)' }}>
                      {b.title}
                    </p>
                    <p className="text-xs truncate" style={{ color: MUTED }}>
                      {b.category} ·{' '}
                      {b.price_minor
                        ? `${formatMoney(b.price_minor / 100, 'GHS')} · Order online`
                        : b.link_url
                          ? 'Links to store'
                          : 'Request a Copy via Contact'}
                    </p>
                  </div>
                  <MoveButtons table="books" id={b.id} index={i} count={books.length} />
                  <EditDialog title="Edit book" action={updateBook} hidden={{ id: b.id, image_url: b.image_url }}>
                    <TextField label="Title" name="title" defaultValue={b.title} required />
                    <SelectField label="Category" name="category" defaultValue={b.category} options={BOOK_CATEGORIES} />
                    <ImageField label="Cover image" currentUrl={b.image_url} />
                    <TextField label="“Get a Copy” link (optional)" name="link_url" defaultValue={b.link_url} placeholder="e.g. Amazon or store link" />
                    <TextField
                      label="Price in cedis (optional; with a price it can be ordered online)"
                      name="price"
                      defaultValue={b.price_minor ? String(b.price_minor / 100) : ''}
                      placeholder="e.g. 50"
                    />
                    <TextArea label="Short description" name="description" defaultValue={b.description} rows={2} />
                  </EditDialog>
                  <ConfirmDelete
                    action={deleteBook}
                    fields={{ id: b.id, image_url: b.image_url }}
                    title="Remove this book?"
                    message={`"${b.title}" will be removed from the Resources page. This cannot be undone.`}
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
