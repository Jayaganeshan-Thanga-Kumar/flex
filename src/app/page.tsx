'use client';

import { useState, useMemo, useEffect } from 'react';
import { Review } from '@/lib/types';
import { mockReviews } from '@/data/mock-reviews';
import { getDateTimestamp } from '@/lib/dateUtils';
import Filters from '@/components/Filters';
import ReviewCard from '@/components/ReviewCard';
import Header from '@/components/Header';

export default function Dashboard() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProperty, setSelectedProperty] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [ratingFilter, setRatingFilter] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>('newest');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({ start: '', end: '' });
  const [channelFilter, setChannelFilter] = useState<string>('');

  const reviewsPerPage = 6;

  // Fetch reviews from API on component mount
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Try to fetch from Hostaway API first
        const response = await fetch('/api/reviews/hostaway');
        
        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }
        
        const apiReviews = await response.json();
        
        // Combine API reviews with existing mock reviews for demonstration
        // In production, you'd typically use only API data
        const combinedReviews = [
          ...apiReviews,
          ...mockReviews.filter(mockReview => 
            !apiReviews.some((apiReview: Review) => apiReview.id === mockReview.id)
          )
        ];
        
        setReviews(combinedReviews);
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
        setError('Failed to load reviews from API. Using local data.');
        // Fallback to mock data if API fails
        setReviews(mockReviews);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // Apply all filters
  const filteredReviews = useMemo(() => {
    return reviews.filter(review => {
      // Property filter
      if (selectedProperty && review.listingName !== selectedProperty) return false;
      
      // Status filter
      if (statusFilter !== 'all' && review.status !== statusFilter) return false;
      
      // Rating filter
      if (ratingFilter > 0 && review.rating < ratingFilter) return false;
      
      // Search filter
      if (searchTerm && !review.content.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !review.author.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      
      // Date range filter
      if (dateRange.start && new Date(review.date) < new Date(dateRange.start)) return false;
      if (dateRange.end && new Date(review.date) > new Date(dateRange.end)) return false;
      
      // Channel filter
      if (channelFilter && review.source !== channelFilter) return false;
      
      return true;
    });
  }, [reviews, selectedProperty, statusFilter, ratingFilter, searchTerm, dateRange, channelFilter]);

  // Sort reviews
  const sortedReviews = useMemo(() => {
    const sorted = [...filteredReviews];
    switch (sortBy) {
      case 'newest':
        return sorted.sort((a, b) => getDateTimestamp(b.date) - getDateTimestamp(a.date));
      case 'oldest':
        return sorted.sort((a, b) => getDateTimestamp(a.date) - getDateTimestamp(b.date));
      case 'highest-rating':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'lowest-rating':
        return sorted.sort((a, b) => a.rating - b.rating);
      default:
        return sorted;
    }
  }, [filteredReviews, sortBy]);

  // Pagination
  const totalPages = Math.ceil(sortedReviews.length / reviewsPerPage);
  const paginatedReviews = sortedReviews.slice(
    (currentPage - 1) * reviewsPerPage,
    currentPage * reviewsPerPage
  );

  // Calculate dashboard statistics
  const stats = useMemo(() => {
    const total = reviews.length;
    const approved = reviews.filter(r => r.status === 'approved').length;
    const pending = reviews.filter(r => r.status === 'pending').length;
    const avgRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;
    
    return { total, approved, pending, avgRating };
  }, [reviews]);

  const uniqueProperties = Array.from(new Set(reviews.map(review => review.listingName)));
  const uniqueChannels = Array.from(new Set(reviews.map(review => review.source).filter(source => source !== undefined))) as string[];

  const handleApprove = (id: string) => {
    setReviews(reviews.map(review => 
      review.id === id ? { ...review, status: 'approved' as const } : review
    ));
  };

  const handleDeny = (id: string) => {
    setReviews(reviews.map(review => 
      review.id === id ? { ...review, status: 'denied' as const } : review
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Loading State */}
      {loading && (
        <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading reviews...</p>
          </div>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Hero Section */}
      <div className="bg-white">
        <div className="relative h-80 bg-gradient-to-r from-gray-100 to-gray-50 overflow-hidden">
          <div className="absolute inset-0 bg-white bg-opacity-60"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
            <div className="text-left">
              <h1 className="text-4xl md:text-5xl font-light text-gray-800 mb-4 tracking-wide">
                Reviews
                <span className="block text-3xl md:text-4xl font-extralight text-gray-600 mt-2">Management Dashboard</span>
              </h1>
              <p className="text-lg text-gray-600 font-light max-w-2xl">
                Monitor and manage guest reviews across all your properties
              </p>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Reviews</p>
                <p className="text-3xl font-light text-gray-900">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Approved</p>
                <p className="text-3xl font-light text-gray-900">{stats.approved}</p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <p className="text-3xl font-light text-gray-900">{stats.pending}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Avg Rating</p>
                <p className="text-3xl font-light text-gray-900">{stats.avgRating.toFixed(1)}</p>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.164c.969 0 1.371 1.24.588 1.81l-3.368 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.539 1.118l-3.368-2.448a1 1 0 00-1.175 0l-3.368 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.25 9.384c-.783-.57-.38-1.81.588-1.81h4.164a1 1 0 00.95-.69L9.049 2.927z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-light text-gray-900">Filter Reviews</h2>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Showing {paginatedReviews.length} of {sortedReviews.length} reviews</span>
            </div>
          </div>
          
          <Filters
            selectedProperty={selectedProperty}
            setSelectedProperty={setSelectedProperty}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            ratingFilter={ratingFilter}
            setRatingFilter={setRatingFilter}
            sortBy={sortBy}
            setSortBy={setSortBy}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            dateRange={dateRange}
            setDateRange={setDateRange}
            properties={uniqueProperties}
            channelFilter={channelFilter}
            setChannelFilter={setChannelFilter}
            channels={uniqueChannels}
          />
        </div>

        {/* Reviews Grid */}
        {paginatedReviews.length > 0 ? (
          <div className="space-y-6 mb-12">
            {paginatedReviews.map((review) => (
              <div key={review.id} className="transform hover:scale-[1.02] transition-transform duration-200">
                <ReviewCard
                  review={review}
                  onApprove={handleApprove}
                  onDeny={handleDeny}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No reviews found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your filters to see more results</p>
            <button 
              onClick={() => {
                setSelectedProperty('');
                setStatusFilter('all');
                setRatingFilter(0);
                setSearchTerm('');
                setDateRange({ start: '', end: '' });
                setCurrentPage(1);
              }}
              className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Enhanced Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between bg-white rounded-2xl shadow-lg p-6">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{(currentPage - 1) * reviewsPerPage + 1}</span> to{' '}
              <span className="font-medium">{Math.min(currentPage * reviewsPerPage, sortedReviews.length)}</span> of{' '}
              <span className="font-medium">{sortedReviews.length}</span> results
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              
              {/* Page Numbers */}
              <div className="flex space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                        currentPage === pageNum
                          ? 'bg-teal-600 text-white'
                          : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
