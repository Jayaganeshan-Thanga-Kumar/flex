import { NextResponse } from 'next/server';
import { Review } from '@/lib/types';

export async function GET() {
  const accountId = '61148';
  const apiKey = 'f94377ebbbb479490bb3ec364649168dc443dda2e4830facaf5de2e74ccc9152';
  const url = `https://api.hostaway.com/v1/reviews?accountId=${accountId}`;

  try {
    // Real API integration for production
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Cache-control': 'no-cache'
      }
    });

    if (!response.ok) {
      let errorBody = '';
      try {
        errorBody = await response.text();
      } catch {
        errorBody = '[Could not read error body]';
      }
      console.error('Hostaway API error response:', errorBody);
      throw new Error(`Hostaway API error: ${response.status} ${response.statusText}\nBody: ${errorBody}`);
    }

    const hostawayData = await response.json();

    // Validate API response structure
    if (!hostawayData || hostawayData.status !== 'success' || !Array.isArray(hostawayData.result)) {
      throw new Error('Invalid response format from Hostaway API');
    }

    // Normalize the reviews to our internal format
    const normalizedReviews: Review[] = hostawayData.result
      .filter((review: unknown) => (review as { type?: string }).type === 'guest-to-host') // Only guest reviews
      .map((review: unknown) => {
        const r = review as {
          id: string | number;
          guestName?: string;
          publicReview?: string;
          submittedAt?: string | number;
          listingName?: string;
          rating?: number;
          reviewCategory?: { rating: number }[];
        };
        // Calculate overall rating from categories if no direct rating provided
        let overallRating = r.rating;

        if (!overallRating && r.reviewCategory && r.reviewCategory.length > 0) {
          const avgCategoryRating = r.reviewCategory.reduce(
            (acc: number, curr: { rating: number }) => acc + curr.rating,
            0
          ) / r.reviewCategory.length;
          // Convert from 10-point scale to 5-point scale
          overallRating = avgCategoryRating / 2;
        }

        // Default to 5 if still no rating available
        if (!overallRating) {
          overallRating = 5;
        }

        return {
          id: r.id.toString(),
          author: r.guestName,
          rating: Math.round(overallRating * 2) / 2, // Round to nearest 0.5
          content: r.publicReview,
          date: r.submittedAt ? new Date(r.submittedAt).toISOString().split('T')[0] : '',
          status: 'pending' as const, // All new reviews start as pending for manager review
          listingName: r.listingName,
          source: 'hostaway' as const,
          channel: 'Hostaway Platform'
        };
      });

    return NextResponse.json(normalizedReviews);
    
  } catch (error) {
    console.error('Failed to fetch reviews from Hostaway:', error);
    
    // Return appropriate error responses
    if (error instanceof Error) {
      if (error.message.includes('Hostaway API error')) {
        return NextResponse.json(
          { error: 'External API unavailable', message: 'Hostaway service is currently unavailable' }, 
          { status: 502 }
        );
      }
      
      if (error.message.includes('Invalid response format')) {
        return NextResponse.json(
          { error: 'Data format error', message: 'Received invalid data format from external service' }, 
          { status: 502 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Internal server error', message: 'Failed to fetch reviews' }, 
      { status: 500 }
    );
  }
}
