import React from 'react';
import { Review } from '@/lib/types';
import { formatDateConsistent } from '@/lib/dateUtils';
import Link from 'next/link';

interface ReviewCardProps {
  review: Review;
  onApprove: (id: string) => void;
  onDeny: (id: string) => void;
}

export default function ReviewCard({ review, onApprove, onDeny }: ReviewCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'denied':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        );
      case 'pending':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
        );
      case 'denied':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-100">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
              <span className="text-gray-600 font-medium text-sm">{review.author.charAt(0)}</span>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">{review.author}</h3>
              <p className="text-gray-500 text-sm">{formatDateConsistent(review.date)}</p>
            </div>
          </div>
          
          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(review.status)}`}>
            {getStatusIcon(review.status)}
            <span className="ml-1 capitalize">{review.status}</span>
          </div>
        </div>

        {/* Property Link */}
        <div className="mb-3">
          <Link 
            href={`/properties/${encodeURIComponent(review.listingName)}`}
            className="inline-flex items-center text-gray-600 hover:text-gray-800 text-sm transition-colors"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h3M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            {review.listingName}
          </Link>
        </div>

        {/* Channel/Source Display */}
        {review.channel && (
          <div className="mb-3">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              {review.channel}
            </span>
          </div>
        )}

        {/* Rating */}
        <div className="flex items-center mb-4">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <svg 
                key={i} 
                className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.164c.969 0 1.371 1.24.588 1.81l-3.368 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.539 1.118l-3.368-2.448a1 1 0 00-1.175 0l-3.368 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.25 9.384c-.783-.57-.38-1.81.588-1.81h4.164a1 1 0 00.95-.69L9.049 2.927z" />
              </svg>
            ))}
          </div>
          <span className="ml-2 text-sm font-medium text-gray-600">{review.rating}/5</span>
        </div>

        {/* Review Content */}
        <div className="mb-6">
          <p className="text-gray-700 leading-relaxed">{review.content}</p>
        </div>

        {/* Action Buttons */}
        {review.status === 'pending' && (
          <div className="flex space-x-3 pt-4 border-t border-gray-100">
            <button
              onClick={() => onApprove(review.id)}
              className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-900 transition-colors flex items-center justify-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
              </svg>
              Approve
            </button>
            <button
              onClick={() => onDeny(review.id)}
              className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Deny
            </button>
          </div>
        )}

        {review.status === 'approved' && (
          <div className="pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">This review is visible to the public</span>
              <Link 
                href={`/properties/${encodeURIComponent(review.listingName)}`}
                className="text-gray-600 hover:text-gray-800 text-xs font-medium flex items-center transition-colors"
              >
                View on Property Page
                <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </Link>
            </div>
          </div>
        )}

        {review.status === 'denied' && (
          <div className="pt-4 border-t border-gray-100">
            <span className="text-xs text-gray-500">This review has been denied and is not visible to the public</span>
          </div>
        )}
      </div>
    </div>
  );
}
