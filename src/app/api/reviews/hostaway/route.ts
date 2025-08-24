import { NextResponse } from 'next/server';
import { Review } from '@/lib/types';

export async function GET() {
  const accountId = '61148';
  const apiKey = 'f94377ebbbb479490bb3ec364649168dc443dda2e4830facaf5de2e74ccc9152';
  const url = `https://api.hostaway.com/v1/reviews?accountId=${accountId}`;

  try {
    // Real API integration (commented for development)
    // Uncomment below for production with actual API
    /*
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Cache-control': 'no-cache'
      }
    });

    if (!response.ok) {
      throw new Error(`Hostaway API error: ${response.status} ${response.statusText}`);
    }

    const hostawayData = await response.json();
    */

    // For development/demo purposes, using mock data that matches Hostaway API structure
    const hostawayData = {
      "status": "success",
      "result": [
        {
          "id": 7453,
          "type": "host-to-guest",
          "status": "published",
          "rating": null,
          "publicReview": "Shane and family are wonderful! Would definitely host again :)",
          "reviewCategory": [
            { "category": "cleanliness", "rating": 10 },
            { "category": "communication", "rating": 10 },
            { "category": "respect_house_rules", "rating": 10 }
          ],
          "submittedAt": "2020-08-21 22:45:14",
          "guestName": "Shane Finkelstein",
          "listingName": "2B N1 A - 29 Shoreditch Heights"
        },
        {
          "id": 7454,
          "type": "guest-to-host",
          "status": "published",
          "rating": 5,
          "publicReview": "Amazing stay, beautiful apartment and great host!",
          "reviewCategory": [],
          "submittedAt": "2023-10-15 10:30:00",
          "guestName": "Alice Johnson",
          "listingName": "Modern Downtown Loft"
        },
        {
          "id": 7455,
          "type": "guest-to-host",
          "status": "published",
          "rating": 4,
          "publicReview": "Great location, comfortable space. Minor issues with wifi but overall excellent.",
          "reviewCategory": [
            { "category": "cleanliness", "rating": 9 },
            { "category": "communication", "rating": 8 },
            { "category": "location", "rating": 10 }
          ],
          "submittedAt": "2023-11-02 14:22:30",
          "guestName": "David Park",
          "listingName": "City Center Apartment"
        },
        {
          "id": 7456,
          "type": "guest-to-host",
          "status": "published",
          "rating": null,
          "publicReview": "Perfect for our business trip. Professional setup and excellent amenities.",
          "reviewCategory": [
            { "category": "cleanliness", "rating": 10 },
            { "category": "location", "rating": 9 },
            { "category": "value", "rating": 8 }
          ],
          "submittedAt": "2023-11-05 09:15:45",
          "guestName": "Sarah Martinez",
          "listingName": "Executive Suite"
        }
      ]
    };

    // Validate API response structure
    if (!hostawayData || hostawayData.status !== 'success' || !Array.isArray(hostawayData.result)) {
      throw new Error('Invalid response format from Hostaway API');
    }

    // Normalize the reviews to our internal format
    const normalizedReviews: Review[] = hostawayData.result
      .filter(review => review.type === 'guest-to-host') // Only guest reviews
      .map(review => {
        // Calculate overall rating from categories if no direct rating provided
        let overallRating = review.rating;
        
        if (!overallRating && review.reviewCategory && review.reviewCategory.length > 0) {
          const avgCategoryRating = review.reviewCategory.reduce((acc, curr) => acc + curr.rating, 0) 
            / review.reviewCategory.length;
          // Convert from 10-point scale to 5-point scale
          overallRating = avgCategoryRating / 2;
        }
        
        // Default to 5 if still no rating available
        if (!overallRating) {
          overallRating = 5;
        }

        return {
          id: review.id.toString(),
          author: review.guestName,
          rating: Math.round(overallRating * 2) / 2, // Round to nearest 0.5
          content: review.publicReview,
          date: new Date(review.submittedAt).toISOString().split('T')[0],
          status: 'pending' as const, // All new reviews start as pending for manager review
          listingName: review.listingName,
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
