import { getBookRows } from '@/lib/resources'
import { deleteBook } from './actions'
import BookForm from './book-form'
import ConfirmDelete from './confirm-delete'
import { AddCard, MoveButtons, MUTED, NotSetUp, Notice, SectionHeader, cardStyle } from './admin-ui'

const messages: Record<string, [boolean, string]> = {
  added: [true, 'Book added to the Resources page.'],
  deleted: [true, 'Book removed.'],
  missing: [false, 'Please enter a title and choose a cover image.'],
  badlink: [false, 'The “Get a Copy” link isn’t a valid web address. Leave it empty or paste the full link.'],
  error: [false, 'Could not save the book. Please try again.'],
}

export default async function BooksSection({ status }: { status?: string }) {
  const books = await getBookRows()
  const msg = status ? messages[status] : undefined

  return (
    <div className="mb-16">
      <SectionHeader
        id="books"
        title="Books & Devotionals"
        hint="Shown on the Resources page in this order."
      />
      {msg && <Notice ok={msg[0]}>{msg[1]}</Notice>}

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
                      {b.category} · {b.link_url ? 'Links to store' : 'Request a Copy via Contact'}
                    </p>
                  </div>
                  <MoveButtons table="books" id={b.id} index={i} count={books.length} />
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
