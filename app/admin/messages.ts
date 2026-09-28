// Every admin action redirects back to /admin with a marker in the address
// (e.g. ?book=updated). These turn that marker into the message to show.

export type AdminMessage = { ok: boolean; text: string }
type Table = Record<string, [boolean, string]>

export const SLIDE_MESSAGES: Table = {
  added: [true, 'Image added to the top of the slider.'],
  updated: [true, 'Slide updated.'],
  deleted: [true, 'Image removed from the slider.'],
  missing: [false, 'Please choose an image file.'],
  error: [false, 'Could not save the slide. Please try again.'],
  badlink: [false, 'The button link isn’t a valid web address. Use a full link (e.g. amazon.com/…) or a page on this site (e.g. /resources).'],
}

export const SERMON_MESSAGES: Table = {
  added: [true, 'Sermon added to the top of the list.'],
  updated: [true, 'Sermon updated.'],
  deleted: [true, 'Sermon removed.'],
  missing: [false, 'Please enter a title for the sermon.'],
  badlink: [false, 'That doesn’t look like an Audiomack sermon link. Open the sermon on Audiomack, tap Share → Copy link, and paste it.'],
  error: [false, 'Could not save the sermon. Please try again.'],
}

export const BOOK_MESSAGES: Table = {
  added: [true, 'Book added to the top of the list.'],
  updated: [true, 'Book updated.'],
  deleted: [true, 'Book removed.'],
  missing: [false, 'Please enter a title (and choose a cover image for new books).'],
  badlink: [false, 'The “Get a Copy” link isn’t a valid web address. Leave it empty or paste the full link.'],
  badprice: [false, 'The price isn’t valid. Type it in cedis, like 50 or 49.99, or leave it empty.'],
  error: [false, 'Could not save the book. Please try again.'],
}

export const ORDER_MESSAGES: Table = {
  fulfilled: [true, 'Order marked as sent / collected.'],
  reopened: [true, 'Order moved back to “To send”.'],
  error: [false, 'Could not update the order. Please try again.'],
}

export const EVENT_MESSAGES: Table = {
  added: [true, 'Event added.'],
  updated: [true, 'Event updated.'],
  deleted: [true, 'Event deleted.'],
  missing: [false, 'Title and date are required.'],
  save: [false, 'Could not save the event. Please try again.'],
}

const MOVED: Record<string, string> = { slides: 'Slide', sermons: 'Sermon', books: 'Book' }

const pick = (table: Table, key?: string): AdminMessage | null =>
  key && table[key] ? { ok: table[key][0], text: table[key][1] } : null

/** The message for the pop-up notification, from the address's markers. */
export function adminMessage(sp: Record<string, string | undefined>): AdminMessage | null {
  if (sp.welcome) return { ok: true, text: 'Welcome back! You’re logged in.' }
  if (sp.moved && MOVED[sp.moved]) {
    return { ok: true, text: `${MOVED[sp.moved]} moved ${sp.dir === 'up' ? 'up' : 'down'}.` }
  }
  return (
    pick(SLIDE_MESSAGES, sp.slide) ||
    pick(SERMON_MESSAGES, sp.sermon) ||
    pick(BOOK_MESSAGES, sp.book) ||
    pick(ORDER_MESSAGES, sp.order) ||
    pick(EVENT_MESSAGES, sp.added ? 'added' : sp.updated ? 'updated' : sp.deleted ? 'deleted' : undefined) ||
    // Event errors use ?error=save / ?error=missing (?error=1 / locked are login errors, shown on the login form).
    pick(EVENT_MESSAGES, sp.error === 'save' || sp.error === 'missing' ? sp.error : undefined)
  )
}
