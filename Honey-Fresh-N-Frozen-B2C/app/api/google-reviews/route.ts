import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 3600 // Cache for 1 hour

interface GoogleReview {
  author_name: string
  author_url?: string
  profile_photo_url?: string
  rating: number
  relative_time_description: string
  text: string
  time: number
}

interface GooglePlacesResponse {
  result: {
    name: string
    rating: number
    user_ratings_total: number
    reviews: GoogleReview[]
    url?: string
  }
  status: string
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const placeId = searchParams.get('placeId')

    if (!placeId) {
      return NextResponse.json(
        { error: 'Place ID is required' },
        { status: 400 }
      )
    }

    const apiKey = process.env.GOOGLE_PLACES_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Google Places API key not configured' },
        { status: 500 }
      )
    }

    // Fetch place details with reviews
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,user_ratings_total,reviews,url&key=${apiKey}`

    const response = await fetch(url, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!response.ok) {
      throw new Error(`Google Places API error: ${response.statusText}`)
    }

    const data: GooglePlacesResponse = await response.json()

    if (data.status !== 'OK') {
      return NextResponse.json(
        { 
          error: `Google Places API error: ${data.status}`,
          message: data.status === 'NOT_FOUND' 
            ? 'Place ID not found. Please verify the Place ID is correct.'
            : data.status === 'REQUEST_DENIED'
            ? 'API request denied. Please check your API key permissions.'
            : `API returned status: ${data.status}`
        },
        { status: 400 }
      )
    }

    const result = data.result
    const rating = result.rating ?? 0
    const totalReviews = result.user_ratings_total ?? 0
    const reviews = result.reviews ?? []
    const placeUrl = result.url

    // Return up to 5 reviews (API limit)
    const limitedReviews = reviews.slice(0, 5)

    return NextResponse.json(
      {
        rating,
        totalReviews,
        reviews: limitedReviews,
        googleUrl: placeUrl,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      }
    )
  } catch (error) {
    console.error('Error fetching Google Reviews:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    )
  }
}
