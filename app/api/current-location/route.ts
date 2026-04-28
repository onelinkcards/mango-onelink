import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

interface GeocodeResponse {
  status: string
  results: Array<{
    formatted_address: string
  }>
}

export async function GET(request: NextRequest) {
  try {
    const lat = request.nextUrl.searchParams.get('lat')
    const lng = request.nextUrl.searchParams.get('lng')

    if (!lat || !lng) {
      return NextResponse.json({ error: 'lat and lng are required' }, { status: 400 })
    }

    const apiKey = process.env.GOOGLE_PLACES_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'Google Places key not configured' }, { status: 500 })
    }

    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
    const response = await fetch(url, { cache: 'no-store' })
    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch geocode address' }, { status: 502 })
    }

    const data: GeocodeResponse = await response.json()
    if (data.status !== 'OK' || data.results.length === 0) {
      return NextResponse.json({ error: 'No address found for this location' }, { status: 404 })
    }

    return NextResponse.json({
      address: data.results[0].formatted_address,
      lat,
      lng,
    })
  } catch (error) {
    console.error('Current location geocode error:', error)
    return NextResponse.json({ error: 'Unable to resolve current location' }, { status: 500 })
  }
}
