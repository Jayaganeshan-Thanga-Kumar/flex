// Combines mockReviews and randomGoogleReviews for global usage
import { mockReviews } from './mock-reviews';
import { randomGoogleReviews } from './random-google-reviews';

export const allReviews = [...mockReviews, ...randomGoogleReviews].map(r => ({
	...r,
	status: r.status === 'approved' || r.status === 'pending' || r.status === 'denied' ? r.status : 'approved'
}));
