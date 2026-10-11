import { getLatestFullVideos } from '@/lib/youtube'

/** How many of the channel's latest full-length videos (no Shorts) the Media page shows. */
const MEDIA_VIDEO_COUNT = 6

export async function GET() {
  try {
    return Response.json({ videos: await getLatestFullVideos(MEDIA_VIDEO_COUNT) })
  } catch (error) {
    console.error('YouTube API error:', error)
    const missing = error instanceof Error && error.message === 'YouTube API configuration missing'
    return Response.json({ error: missing ? error.message : 'Failed to fetch videos' }, { status: 500 })
  }
}
