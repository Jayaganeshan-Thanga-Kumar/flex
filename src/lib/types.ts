export interface Review {
  id: string;
  author: string;
  rating: number;
  content: string;
  date: string;
  status: 'approved' | 'pending' | 'denied';
  listingName: string;
  source?: 'hostaway' | 'google' | 'airbnb' | 'booking' | 'direct';
  channel?: string;
}
