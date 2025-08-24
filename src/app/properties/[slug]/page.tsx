'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Review } from '@/lib/types';
import { mockReviews } from '@/data/mock-reviews';
import { formatDateConsistent } from '@/lib/dateUtils';
import { getPropertyImages } from '@/lib/propertyImages';
import Header from '@/components/Header';
import Image from 'next/image';

export default function PropertyPage() {
  const params = useParams();
  const [propertyReviews, setPropertyReviews] = useState<Review[]>([]);
  const propertyName = params.slug ? decodeURIComponent(params.slug as string) : '';
  
  // Get property images
  const propertyImages = getPropertyImages(propertyName);
  
  // Calculate review statistics
  const averageRating = propertyReviews.length > 0 
    ? propertyReviews.reduce((sum, review) => sum + review.rating, 0) / propertyReviews.length 
    : 0;
  
  const ratingBreakdown = [5, 4, 3, 2, 1].map(rating => {
    const count = propertyReviews.filter(review => review.rating === rating).length;
    const percentage = propertyReviews.length > 0 ? (count / propertyReviews.length) * 100 : 0;
    return { rating, count, percentage };
  });

  useEffect(() => {
    if (!propertyName) return;
    const approvedReviews = mockReviews.filter(
      (review) => review.listingName === propertyName && review.status === 'approved'
    );
    setPropertyReviews(approvedReviews);
  }, [propertyName]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-r from-teal-600 to-teal-800">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-white">
            <h1 className="text-5xl font-bold mb-4">{propertyName}</h1>
            <p className="text-xl opacity-90">Premium serviced apartment in London</p>
            <div className="flex items-center mt-4">
              <div className="flex items-center">
                <span className="text-2xl font-bold">{averageRating.toFixed(1)}</span>
                <div className="flex ml-2">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className={`w-6 h-6 ${i < Math.floor(averageRating) ? 'text-yellow-400' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.164c.969 0 1.371 1.24.588 1.81l-3.368 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.539 1.118l-3.368-2.448a1 1 0 00-1.175 0l-3.368 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.25 9.384c-.783-.57-.38-1.81.588-1.81h4.164a1 1 0 00.95-.69L9.049 2.927z" />
                    </svg>
                  ))}
                </div>
                <span className="ml-2 text-lg">({propertyReviews.length} reviews)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Content */}
          <div className="lg:col-span-2">
            
            {/* Property Images Gallery */}
            <div className="mb-12">
              <div className="grid grid-cols-2 gap-4 h-96">
                {/* Main Image */}
                <div className="relative rounded-lg overflow-hidden">
                  <Image
                    src={propertyImages.main}
                    alt={`${propertyName} - Main View`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                </div>
                
                {/* Gallery Images */}
                <div className="grid grid-cols-2 gap-4">
                  {propertyImages.gallery.slice(0, 3).map((imageUrl, index) => (
                    <div key={index} className="relative rounded-lg overflow-hidden">
                      <Image
                        src={imageUrl}
                        alt={`${propertyName} - View ${index + 2}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    </div>
                  ))}
                  
                  {/* Show More Button */}
                  <div className="relative rounded-lg bg-gray-900 bg-opacity-75 flex items-center justify-center text-white font-semibold cursor-pointer hover:bg-opacity-60 transition-all">
                    <span className="text-sm">+{propertyImages.gallery.length - 3} more</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Property Details */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">About this place</h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  Experience luxury living in this beautifully designed serviced apartment. Located in the heart of London, 
                  this property offers modern amenities, stunning views, and exceptional service that makes it perfect for 
                  both short and extended stays.
                </p>
              </div>
              
              <div className="grid grid-cols-3 gap-6 mt-8">
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-teal-600">2</div>
                  <div className="text-gray-600">Bedrooms</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-teal-600">2</div>
                  <div className="text-gray-600">Bathrooms</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-teal-600">4</div>
                  <div className="text-gray-600">Guests</div>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Guest Reviews</h2>
                <button className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
                  Write a Review
                </button>
              </div>

              {/* Rating Overview */}
              <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="text-center">
                    <div className="text-6xl font-bold text-teal-600 mb-2">{averageRating.toFixed(1)}</div>
                    <div className="flex justify-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className={`w-6 h-6 ${i < Math.floor(averageRating) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.164c.969 0 1.371 1.24.588 1.81l-3.368 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.539 1.118l-3.368-2.448a1 1 0 00-1.175 0l-3.368 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.25 9.384c-.783-.57-.38-1.81.588-1.81h4.164a1 1 0 00.95-.69L9.049 2.927z" />
                        </svg>
                      ))}
                    </div>
                    <div className="text-gray-600">{propertyReviews.length} reviews</div>
                  </div>
                  
                  <div className="space-y-3">
                    {ratingBreakdown.map(({ rating, count, percentage }) => (
                      <div key={rating} className="flex items-center">
                        <span className="text-sm text-gray-600 w-8">{rating}★</span>
                        <div className="flex-1 mx-3 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-teal-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600 w-8">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Individual Reviews */}
              {propertyReviews.length > 0 ? (
                <div className="space-y-6">
                  {propertyReviews.map((review) => (
                    <div key={review.id} className="bg-white rounded-xl shadow-sm p-8 hover:shadow-md transition-shadow">
                      <div className="flex items-start">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-teal-400 to-teal-600 flex items-center justify-center font-bold text-white text-lg">
                          {review.author.charAt(0)}
                        </div>
                        <div className="ml-4 flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-bold text-lg text-gray-900">{review.author}</h3>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <svg key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.164c.969 0 1.371 1.24.588 1.81l-3.368 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.539 1.118l-3.368-2.448a1 1 0 00-1.175 0l-3.368 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.25 9.384c-.783-.57-.38-1.81.588-1.81h4.164a1 1 0 00.95-.69L9.049 2.927z" />
                                </svg>
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-gray-500 mb-3">{formatDateConsistent(review.date)}</p>
                          <p className="text-gray-700 leading-relaxed">{review.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                  <div className="text-gray-400 text-6xl mb-4">📝</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No reviews yet</h3>
                  <p className="text-gray-600">Be the first to share your experience!</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              {/* Booking Card */}
              <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-gray-900">£150<span className="text-lg font-normal text-gray-600">/night</span></div>
                  <div className="text-sm text-gray-500">Minimum 3 nights</div>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Check-in</label>
                    <input type="date" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Check-out</label>
                    <input type="date" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Guests</label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent">
                      <option>1 guest</option>
                      <option>2 guests</option>
                      <option>3 guests</option>
                      <option>4 guests</option>
                    </select>
                  </div>
                </div>
                
                <button className="w-full bg-gradient-to-r from-teal-600 to-teal-700 text-white py-4 rounded-lg font-semibold hover:from-teal-700 hover:to-teal-800 transition-colors">
                  Book Now
                </button>
                
                <div className="mt-4 text-center text-sm text-gray-500">
                  You won't be charged yet
                </div>
              </div>

              {/* Property Features */}
              <div className="bg-white rounded-xl shadow-sm p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">What this place offers</h3>
                <div className="space-y-4">
                  {['WiFi', 'Kitchen', 'Washer', 'Dryer', 'Air conditioning', 'Heating'].map((feature) => (
                    <div key={feature} className="flex items-center">
                      <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center mr-3">
                        <div className="w-2 h-2 bg-teal-600 rounded-full"></div>
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
