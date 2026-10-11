// Latest uploads from the ministry's YouTube channel (VALOR TV). Server only.
// Needs YOUTUBE_API_KEY and YOUTUBE_CHANNEL_ID in .env.local.

export type YouTubeVideo = {
  id: string
  title: string
  thumbnail: string
  publishedAt: string
  channelName: string
}

/** Re-ask YouTube at most every 10 minutes, so new uploads show up quickly without using up the API quota. */
const REVALIDATE_SECONDS = 600

async function getJson(url: string) {
  const res = await fetch(url, { next: { revalidate: REVALIDATE_SECONDS } })
  return res.json()
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toVideo = (item: any): YouTubeVideo => ({
  id: item.contentDetails.videoId,
  title: item.snippet.title,
  thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url || '',
  publishedAt: item.snippet.publishedAt,
  channelName: item.snippet.channelTitle,
})

/** The channel's "uploads" playlist id ("UU…"), which lists every video, newest first. */
async function uploadsPlaylist(): Promise<{ key: string; uploads: string }> {
  const key = process.env.YOUTUBE_API_KEY
  const channelId = process.env.YOUTUBE_CHANNEL_ID
  if (!key || !channelId) throw new Error('YouTube API configuration missing')
  const data = await getJson(`https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${key}`)
  const uploads = data.items?.[0]?.contentDetails?.relatedPlaylists?.uploads
  if (!uploads) throw new Error('Channel not found')
  return { key, uploads }
}

async function playlistVideos(key: string, playlistId: string, limit: number): Promise<YouTubeVideo[]> {
  const data = await getJson(
    `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${playlistId}&maxResults=${limit}&key=${key}`
  )
  if (data.error) throw new Error(data.error.message || 'Playlist not available')
  return (data.items || []).map(toVideo)
}

/** "PT1H2M3S" → 3723 seconds. */
function durationSeconds(iso: string) {
  const m = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/.exec(iso || '')
  return m ? Number(m[1] || 0) * 3600 + Number(m[2] || 0) * 60 + Number(m[3] || 0) : 0
}

/** Shorts can be up to 3 minutes long; anything longer is a full video. */
const MAX_SHORT_SECONDS = 180

/**
 * The channel's latest full-length videos (Shorts skipped), newest first. Throws if YouTube isn't
 * configured or can't be reached. YouTube keeps a list of each channel's full-length videos only
 * ("UULF…" instead of "UU…"). It isn't officially documented, so if it ever stops working, recent
 * uploads are checked by length instead.
 */
export async function getLatestFullVideos(limit: number): Promise<YouTubeVideo[]> {
  const { key, uploads } = await uploadsPlaylist()
  try {
    const full = await playlistVideos(key, `UULF${uploads.slice(2)}`, limit)
    if (full.length) return full
  } catch {
    // Fall through to checking lengths.
  }
  const recent = await playlistVideos(key, uploads, 50)
  if (!recent.length) return []
  const details = await getJson(
    `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${recent.map((v) => v.id).join(',')}&key=${key}`
  )
  const seconds = new Map<string, number>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (details.items || []).map((d: any) => [d.id, durationSeconds(d.contentDetails?.duration)])
  )
  return recent.filter((v) => (seconds.get(v.id) || 0) > MAX_SHORT_SECONDS).slice(0, limit)
}

/** The newest full-length video (Shorts skipped), or null if there is none or YouTube can't be reached. */
export async function getLatestVideo(): Promise<YouTubeVideo | null> {
  try {
    return (await getLatestFullVideos(1))[0] ?? null
  } catch (e) {
    console.error('Latest YouTube video unavailable', e)
    return null
  }
}
