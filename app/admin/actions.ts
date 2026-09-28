'use server'

import { randomUUID } from 'crypto'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { supabaseAdmin, EVENT_IMAGES_BUCKET } from '@/lib/supabase'
import { checkPassword, isAuthed, sessionToken, COOKIE_NAME } from '@/lib/auth'
import { MAX_ATTEMPTS, visitorKey, recentFailures, recordFailure, clearFailures } from '@/lib/login-limit'
import { SLIDER_IMAGES_BUCKET } from '@/lib/slides'
import { BOOK_IMAGES_BUCKET, BOOK_CATEGORIES, normalizeAudiomackUrl } from '@/lib/resources'

export async function login(formData: FormData) {
  const key = visitorKey()
  // Locked out: don't even check the password, so guessing gains nothing.
  if ((await recentFailures(key)) >= MAX_ATTEMPTS) redirect('/admin?error=locked')

  const password = String(formData.get('password') || '')
  if (!checkPassword(password)) {
    await recordFailure(key)
    const left = MAX_ATTEMPTS - (await recentFailures(key))
    redirect(left > 0 ? `/admin?error=1&left=${left}` : '/admin?error=locked')
  }
  await clearFailures(key)
  cookies().set(COOKIE_NAME, sessionToken(), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  })
  redirect('/admin?welcome=1')
}

export async function logout() {
  cookies().delete(COOKIE_NAME)
  redirect('/admin?loggedout=1')
}

export async function createEvent(formData: FormData) {
  if (!isAuthed()) redirect('/admin')

  const title = String(formData.get('title') || '').trim()
  const event_date = String(formData.get('event_date') || '')
  const location = String(formData.get('location') || '').trim()
  const time = String(formData.get('time') || '').trim()
  const description = String(formData.get('description') || '').trim()
  const tag = String(formData.get('tag') || '').trim()
  const image = formData.get('image') as File | null

  if (!title || !event_date) {
    redirect('/admin?error=missing#events')
  }

  const supabase = supabaseAdmin()

  let image_url: string | null = null
  if (image && image.size > 0) {
    const ext = (image.name.split('.').pop() || 'jpg').toLowerCase()
    const path = `${randomUUID()}.${ext}`
    const bytes = new Uint8Array(await image.arrayBuffer())
    const { error: upErr } = await supabase.storage
      .from(EVENT_IMAGES_BUCKET)
      .upload(path, bytes, { contentType: image.type || 'image/jpeg', upsert: false })
    if (!upErr) {
      const { data: pub } = supabase.storage.from(EVENT_IMAGES_BUCKET).getPublicUrl(path)
      image_url = pub.publicUrl
    }
  }

  const { error } = await supabase
    .from('events')
    .insert({ title, event_date, location, time, description, tag, image_url })

  if (error) {
    redirect('/admin?error=save#events')
  }

  revalidatePath('/events')
  revalidatePath('/admin')
  redirect('/admin?added=1#events')
}

export async function deleteEvent(formData: FormData) {
  if (!isAuthed()) redirect('/admin')

  const id = String(formData.get('id') || '')
  const image_url = String(formData.get('image_url') || '')
  if (!id) redirect('/admin')

  const supabase = supabaseAdmin()

  // Remove the stored photo too, if there is one.
  if (image_url) {
    const marker = `/${EVENT_IMAGES_BUCKET}/`
    const idx = image_url.indexOf(marker)
    if (idx !== -1) {
      const path = image_url.slice(idx + marker.length)
      await supabase.storage.from(EVENT_IMAGES_BUCKET).remove([path])
    }
  }

  await supabase.from('events').delete().eq('id', id)

  revalidatePath('/events')
  revalidatePath('/admin')
  redirect('/admin?deleted=1#events')
}

// ── Shared helpers for slider, sermons and books ─────────────

type SupabaseClient = ReturnType<typeof supabaseAdmin>

/** Upload an image to a public bucket; returns its storage path and public URL, or null on failure. */
async function uploadImage(supabase: SupabaseClient, bucket: string, image: File) {
  const ext = (image.name.split('.').pop() || 'jpg').toLowerCase()
  const path = `${randomUUID()}.${ext}`
  const bytes = new Uint8Array(await image.arrayBuffer())
  const { error } = await supabase.storage.from(bucket).upload(path, bytes, { contentType: image.type, upsert: false })
  if (error) return null
  return { path, url: supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl }
}

/** Remove an uploaded image; built-in images (in /public) are left alone. */
async function removeImage(supabase: SupabaseClient, bucket: string, imageUrl: string) {
  const marker = `/${bucket}/`
  const idx = imageUrl.indexOf(marker)
  if (idx !== -1) await supabase.storage.from(bucket).remove([imageUrl.slice(idx + marker.length)])
}

/** Position for a new item: before the current first one, so the latest upload shows first. */
async function topPosition(supabase: SupabaseClient, table: OrderedTable) {
  const { data } = await supabase.from(table).select('position').order('position', { ascending: true }).limit(1)
  return (data?.[0]?.position ?? 1) - 1
}

const isImage = (f: File | null): f is File => !!f && f.size > 0 && f.type.startsWith('image/')

// Tables whose items can be reordered, with the page and admin section to refresh.
const ORDERED = {
  slides: { page: '/', section: 'slider' },
  sermons: { page: '/resources', section: 'sermons' },
  books: { page: '/resources', section: 'books' },
} as const
type OrderedTable = keyof typeof ORDERED

function refresh(table: OrderedTable) {
  revalidatePath(ORDERED[table].page)
  // Book titles, covers and prices also appear on the order pages.
  if (table === 'books') revalidatePath('/order', 'layout')
  revalidatePath('/admin')
}

export async function moveItem(formData: FormData) {
  if (!isAuthed()) redirect('/admin')

  const table = String(formData.get('table') || '') as OrderedTable
  if (!(table in ORDERED)) redirect('/admin')
  const id = String(formData.get('id') || '')
  const step = formData.get('direction') === 'up' ? -1 : 1

  const supabase = supabaseAdmin()
  const { data } = await supabase
    .from(table)
    .select('id, position')
    .order('position', { ascending: true })
    .order('created_at', { ascending: true })
  const rows = data ?? []

  const from = rows.findIndex((r) => r.id === id)
  const to = from + step
  if (from !== -1 && to >= 0 && to < rows.length) {
    ;[rows[from], rows[to]] = [rows[to], rows[from]]
    // Renumber 1..n so positions stay unique; only write rows that changed.
    await Promise.all(
      rows
        .map((r, i) => ({ ...r, next: i + 1 }))
        .filter((r) => r.position !== r.next)
        .map((r) => supabase.from(table).update({ position: r.next }).eq('id', r.id))
    )
  }

  refresh(table)
  redirect(`/admin?moved=${table}&dir=${step < 0 ? 'up' : 'down'}#${ORDERED[table].section}`)
}

// ── Homepage slider ──────────────────────────────────────────

/** A slide's optional button: link (web address or a page on this site like /resources) and text. */
function slideButton(formData: FormData) {
  const input = String(formData.get('button_url') || '').trim()
  const label = String(formData.get('button_label') || '').trim().slice(0, 30)
  if (!input) return { button_url: null, button_label: null }
  const button_url = input.startsWith('/') ? input : normalizeLink(input)
  if (!button_url) redirect('/admin?slide=badlink#slider')
  return { button_url, button_label: label || null }
}

export async function createSlide(formData: FormData) {
  if (!isAuthed()) redirect('/admin')
  const button = slideButton(formData)

  const image = formData.get('image') as File | null
  const alt = String(formData.get('alt') || '').trim()
  const banner = formData.get('banner') === 'on'
  if (!isImage(image)) redirect('/admin?slide=missing#slider')

  const supabase = supabaseAdmin()
  const uploaded = await uploadImage(supabase, SLIDER_IMAGES_BUCKET, image)
  if (!uploaded) redirect('/admin?slide=error#slider')

  const position = await topPosition(supabase, 'slides')
  const { error } = await supabase.from('slides').insert({ image_url: uploaded.url, alt, banner, position, ...button })
  if (error) {
    await supabase.storage.from(SLIDER_IMAGES_BUCKET).remove([uploaded.path])
    redirect('/admin?slide=error#slider')
  }

  refresh('slides')
  redirect('/admin?slide=added#slider')
}

export async function deleteSlide(formData: FormData) {
  if (!isAuthed()) redirect('/admin')
  const id = String(formData.get('id') || '')
  if (!id) redirect('/admin#slider')

  const supabase = supabaseAdmin()
  await removeImage(supabase, SLIDER_IMAGES_BUCKET, String(formData.get('image_url') || ''))
  await supabase.from('slides').delete().eq('id', id)

  refresh('slides')
  redirect('/admin?slide=deleted#slider')
}

// ── Audio sermons ────────────────────────────────────────────

export async function createSermon(formData: FormData) {
  if (!isAuthed()) redirect('/admin')

  const audiomack_url = normalizeAudiomackUrl(String(formData.get('audiomack_url') || ''))
  const title = String(formData.get('title') || '').trim()
  if (!audiomack_url) redirect('/admin?sermon=badlink#sermons')
  if (!title) redirect('/admin?sermon=missing#sermons')

  const supabase = supabaseAdmin()
  const position = await topPosition(supabase, 'sermons')
  const { error } = await supabase.from('sermons').insert({ title, audiomack_url, position })
  if (error) redirect('/admin?sermon=error#sermons')

  refresh('sermons')
  redirect('/admin?sermon=added#sermons')
}

export async function deleteSermon(formData: FormData) {
  if (!isAuthed()) redirect('/admin')
  const id = String(formData.get('id') || '')
  if (id) await supabaseAdmin().from('sermons').delete().eq('id', id)

  refresh('sermons')
  redirect('/admin?sermon=deleted#sermons')
}

// ── Books & devotionals ──────────────────────────────────────

/** A price typed in cedis ("50", "49.99", "1,200") as pesewas; null if empty, undefined if invalid. */
function parsePriceMinor(input: string): number | null | undefined {
  const cleaned = input.replace(/[,\s₵]|GHS|GH/gi, '')
  if (!cleaned) return null
  if (!/^\d+(\.\d{1,2})?$/.test(cleaned)) return undefined
  const minor = Math.round(Number(cleaned) * 100)
  return minor > 0 && minor <= 10_000_000 ? minor : undefined
}

/** Accepts "amazon.com/..." as well as full links; returns null if it isn't a valid web address. */
function normalizeLink(input: string): string | null {
  try {
    const u = new URL(/^https?:\/\//i.test(input) ? input : `https://${input}`)
    return u.hostname.includes('.') ? u.toString() : null
  } catch {
    return null
  }
}

export async function createBook(formData: FormData) {
  if (!isAuthed()) redirect('/admin')

  const title = String(formData.get('title') || '').trim()
  const categoryInput = String(formData.get('category') || '')
  const category = (BOOK_CATEGORIES as readonly string[]).includes(categoryInput) ? categoryInput : 'Books'
  const description = String(formData.get('description') || '').trim()
  const linkInput = String(formData.get('link_url') || '').trim()
  const image = formData.get('image') as File | null

  if (!title || !isImage(image)) redirect('/admin?book=missing#books')
  const link_url = linkInput ? normalizeLink(linkInput) : null
  if (linkInput && !link_url) redirect('/admin?book=badlink#books')
  const price_minor = parsePriceMinor(String(formData.get('price') || ''))
  if (price_minor === undefined) redirect('/admin?book=badprice#books')

  const supabase = supabaseAdmin()
  const uploaded = await uploadImage(supabase, BOOK_IMAGES_BUCKET, image)
  if (!uploaded) redirect('/admin?book=error#books')

  const position = await topPosition(supabase, 'books')
  const { error } = await supabase
    .from('books')
    .insert({ title, category, description, image_url: uploaded.url, link_url, price_minor, position })
  if (error) {
    await supabase.storage.from(BOOK_IMAGES_BUCKET).remove([uploaded.path])
    redirect('/admin?book=error#books')
  }

  refresh('books')
  redirect('/admin?book=added#books')
}

export async function deleteBook(formData: FormData) {
  if (!isAuthed()) redirect('/admin')
  const id = String(formData.get('id') || '')
  if (!id) redirect('/admin#books')

  const supabase = supabaseAdmin()
  await removeImage(supabase, BOOK_IMAGES_BUCKET, String(formData.get('image_url') || ''))
  await supabase.from('books').delete().eq('id', id)

  refresh('books')
  redirect('/admin?book=deleted#books')
}

// ── Editing ──────────────────────────────────────────────────

/**
 * If a replacement image was chosen, upload it and delete the old one from storage.
 * Returns the URL to keep: the new one, or `oldUrl` if no replacement was given.
 * Returns null if the upload failed.
 */
async function replaceImage(supabase: SupabaseClient, bucket: string, formData: FormData, oldUrl: string) {
  const image = formData.get('image') as File | null
  if (!image || image.size === 0) return oldUrl
  if (!isImage(image)) return null
  const uploaded = await uploadImage(supabase, bucket, image)
  if (!uploaded) return null
  if (oldUrl) await removeImage(supabase, bucket, oldUrl)
  return uploaded.url
}

export async function updateSlide(formData: FormData) {
  if (!isAuthed()) redirect('/admin')
  const id = String(formData.get('id') || '')
  if (!id) redirect('/admin#slider')
  const button = slideButton(formData)

  const supabase = supabaseAdmin()
  const image_url = await replaceImage(supabase, SLIDER_IMAGES_BUCKET, formData, String(formData.get('image_url') || ''))
  if (!image_url) redirect('/admin?slide=error#slider')

  const { error } = await supabase
    .from('slides')
    .update({
      image_url,
      alt: String(formData.get('alt') || '').trim(),
      banner: formData.get('banner') === 'on',
      ...button,
    })
    .eq('id', id)
  if (error) redirect('/admin?slide=error#slider')

  refresh('slides')
  redirect('/admin?slide=updated#slider')
}

export async function updateSermon(formData: FormData) {
  if (!isAuthed()) redirect('/admin')
  const id = String(formData.get('id') || '')
  const audiomack_url = normalizeAudiomackUrl(String(formData.get('audiomack_url') || ''))
  const title = String(formData.get('title') || '').trim()
  if (!id) redirect('/admin#sermons')
  if (!audiomack_url) redirect('/admin?sermon=badlink#sermons')
  if (!title) redirect('/admin?sermon=missing#sermons')

  const { error } = await supabaseAdmin().from('sermons').update({ title, audiomack_url }).eq('id', id)
  if (error) redirect('/admin?sermon=error#sermons')

  refresh('sermons')
  redirect('/admin?sermon=updated#sermons')
}

export async function updateBook(formData: FormData) {
  if (!isAuthed()) redirect('/admin')
  const id = String(formData.get('id') || '')
  const title = String(formData.get('title') || '').trim()
  const categoryInput = String(formData.get('category') || '')
  const category = (BOOK_CATEGORIES as readonly string[]).includes(categoryInput) ? categoryInput : 'Books'
  const description = String(formData.get('description') || '').trim()
  const linkInput = String(formData.get('link_url') || '').trim()
  if (!id) redirect('/admin#books')
  if (!title) redirect('/admin?book=missing#books')
  const link_url = linkInput ? normalizeLink(linkInput) : null
  if (linkInput && !link_url) redirect('/admin?book=badlink#books')
  const price_minor = parsePriceMinor(String(formData.get('price') || ''))
  if (price_minor === undefined) redirect('/admin?book=badprice#books')

  const supabase = supabaseAdmin()
  const image_url = await replaceImage(supabase, BOOK_IMAGES_BUCKET, formData, String(formData.get('image_url') || ''))
  if (!image_url) redirect('/admin?book=error#books')

  const { error } = await supabase
    .from('books')
    .update({ title, category, description, link_url, price_minor, image_url })
    .eq('id', id)
  if (error) redirect('/admin?book=error#books')

  refresh('books')
  redirect('/admin?book=updated#books')
}

export async function updateEvent(formData: FormData) {
  if (!isAuthed()) redirect('/admin')
  const id = String(formData.get('id') || '')
  const title = String(formData.get('title') || '').trim()
  const event_date = String(formData.get('event_date') || '')
  if (!id) redirect('/admin#events')
  if (!title || !event_date) redirect('/admin?error=missing#events')

  const supabase = supabaseAdmin()
  const oldUrl = String(formData.get('image_url') || '')
  let image_url: string | null = oldUrl
  if (formData.get('remove_image') === 'on') {
    if (oldUrl) await removeImage(supabase, EVENT_IMAGES_BUCKET, oldUrl)
    image_url = null
  } else {
    const replaced = await replaceImage(supabase, EVENT_IMAGES_BUCKET, formData, oldUrl)
    if (replaced === null) redirect('/admin?error=save#events')
    image_url = replaced || null
  }

  const { error } = await supabase
    .from('events')
    .update({
      title,
      event_date,
      location: String(formData.get('location') || '').trim(),
      time: String(formData.get('time') || '').trim(),
      description: String(formData.get('description') || '').trim(),
      tag: String(formData.get('tag') || '').trim(),
      image_url,
    })
    .eq('id', id)
  if (error) redirect('/admin?error=save#events')

  revalidatePath('/events')
  revalidatePath('/admin')
  redirect('/admin?updated=1#events')
}

// ── Book orders ──────────────────────────────────────────────

/** Mark an order as sent/collected, or undo that. */
export async function setOrderFulfilled(formData: FormData) {
  if (!isAuthed()) redirect('/admin')
  const id = String(formData.get('id') || '')
  const fulfilled = formData.get('fulfilled') === '1'
  if (!id) redirect('/admin#orders')

  const { error } = await supabaseAdmin()
    .from('book_orders')
    .update({ fulfilled_at: fulfilled ? new Date().toISOString() : null })
    .eq('id', id)
  if (error) redirect('/admin?order=error#orders')

  revalidatePath('/admin')
  redirect(`/admin?order=${fulfilled ? 'fulfilled' : 'reopened'}#orders`)
}
