import { NextResponse } from 'next/server';

// Securely use Google Places API key from environment variables
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

// Example property: "The Ritz London"
const PROPERTY_NAME = 'The Ritz London';
const PROPERTY_ADDRESS = "150 Piccadilly, St. James's, London W1J 9BR, United Kingdom";

// Helper to get place_id from Google Places API
async function getPlaceId(name: string, address: string): Promise<string | null> {
  const searchUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(
    name + ' ' + address
  )}&inputtype=textquery&fields=place_id&key=${GOOGLE_API_KEY}`;
  const response = await fetch(searchUrl);
  const data = await response.json();
  if (data.candidates && data.candidates.length > 0) {
    return data.candidates[0].place_id;
  }
  return null;
}

// Helper to get reviews from Google Place Details API
async function getGoogleReviews(placeId: string) {
  const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,reviews&key=${GOOGLE_API_KEY}`;
  const response = await fetch(detailsUrl);
  const data = await response.json();
  // Only return up to 5 reviews for demo
  return (data.result?.reviews || []).slice(0, 5);
}

export async function GET() {
  try {
    const placeId = await getPlaceId(PROPERTY_NAME, PROPERTY_ADDRESS);
    if (!placeId) {
      return NextResponse.json({ error: 'Place not found on Google Maps.' }, { status: 404 });
    }
    const reviews = await getGoogleReviews(placeId);
    // Normalize reviews to your internal format
    const normalizedReviews = reviews.map((review: any, idx: number) => ({
      id: review.time ? review.time.toString() : idx.toString(),
      author: review.author_name,
      rating: review.rating,
      content: review.text,
      date: new Date(review.time * 1000).toISOString().split('T')[0],
      status: 'approved',
      listingName: PROPERTY_NAME,
      source: 'google',
      channel: 'Google Reviews (fetched from Google)',
    }));
    return NextResponse.json(normalizedReviews);
  } catch (error) {
    console.error('Failed to fetch Google Reviews:', error);
    return NextResponse.json({ error: 'Failed to fetch Google Reviews.' }, { status: 500 });
  }
}
