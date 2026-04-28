import { NextResponse } from 'next/server'
import { shopConfig } from '../../shops/honeys-fresh-n-frozen/config'

type FeedPost = {
  id: string
  image: string
  caption: string
  mediaType: 'post' | 'reel'
  href: string
  pinned?: boolean
  timestamp?: string
}

type InstagramGraphPost = {
  id: string
  caption?: string
  media_type?: string
  media_url?: string
  thumbnail_url?: string
  permalink?: string
  timestamp?: string
  children?: {
    data?: Array<{
      media_type?: string
      media_url?: string
      thumbnail_url?: string
    }>
  }
}

function getFallbackPosts(limit: number): FeedPost[] {
  const feed = shopConfig.instagramFeed

  if (!feed?.posts?.length) {
    return []
  }

  return [...feed.posts]
    .sort((a, b) => Number(Boolean(b.pinned)) - Number(Boolean(a.pinned)))
    .slice(0, limit)
}

function mapMediaType(mediaType?: string): 'post' | 'reel' {
  if (mediaType === 'VIDEO' || mediaType === 'REELS') {
    return 'reel'
  }

  return 'post'
}

function resolveMediaImage(post: InstagramGraphPost): string | null {
  if (post.media_type === 'VIDEO') {
    return post.thumbnail_url || post.media_url || null
  }

  if (post.media_type === 'CAROUSEL_ALBUM') {
    return (
      post.thumbnail_url ||
      post.media_url ||
      post.children?.data?.[0]?.thumbnail_url ||
      post.children?.data?.[0]?.media_url ||
      null
    )
  }

  return post.media_url || post.thumbnail_url || null
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const requestedLimit = Number.parseInt(searchParams.get('limit') || '6', 10)
  const limit = Number.isFinite(requestedLimit) ? Math.min(Math.max(requestedLimit, 1), 12) : 6

  const fallbackPosts = getFallbackPosts(limit)

  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN
  const businessAccountId =
    process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID || process.env.INSTAGRAM_USER_ID

  if (!accessToken || !businessAccountId) {
    return NextResponse.json({
      source: 'fallback',
      posts: fallbackPosts,
    })
  }

  try {
    const fields =
      'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,children{media_type,media_url,thumbnail_url}'
    const endpoint =
      `https://graph.facebook.com/v22.0/${businessAccountId}/media` +
      `?fields=${encodeURIComponent(fields)}` +
      `&limit=${limit}` +
      `&access_token=${encodeURIComponent(accessToken)}`

    const response = await fetch(endpoint, {
      next: { revalidate: 900 },
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok || data.error) {
      throw new Error(data.error?.message || 'Failed to fetch Instagram feed')
    }

    const posts = ((data.data as InstagramGraphPost[] | undefined) || [])
      .map((post): FeedPost | null => {
        const image = resolveMediaImage(post)
        if (!image || !post.permalink) {
          return null
        }

        return {
          id: post.id,
          image,
          caption: post.caption?.trim() || 'Latest update from Instagram',
          mediaType: mapMediaType(post.media_type),
          href: post.permalink,
          timestamp: post.timestamp,
        }
      })
      .filter((post): post is FeedPost => Boolean(post))
      .slice(0, limit)

    return NextResponse.json({
      source: 'instagram',
      posts: posts.length ? posts : fallbackPosts,
    })
  } catch (error) {
    console.error('Instagram feed fallback:', error)

    return NextResponse.json({
      source: 'fallback',
      posts: fallbackPosts,
    })
  }
}
