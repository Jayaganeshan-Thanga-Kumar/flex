'use client';

import { useState, useMemo } from 'react';
import { mockReviews } from '@/data/mock-reviews';
import { useEffect } from 'react';
import Header from '@/components/Header';

interface AnalyticsData {
  totalReviews: number;
  averageRating: number;
  approvalRate: number;
  monthlyGrowth: number;
  ratingDistribution: { rating: number; count: number; percentage: number }[];
  propertyPerformance: { name: string; rating: number; reviews: number; trend: number }[];
  monthlyTrends: { month: string; reviews: number; rating: number }[];
  topPerformers: { name: string; rating: number; reviews: number }[];
  needsAttention: { name: string; rating: number; issues: string[] }[];
}

export default function AnalyticsPage() {
  const [googleReviews, setGoogleReviews] = useState([]);
  const [timeRange, setTimeRange] = useState('6m');
  const [selectedMetric, setSelectedMetric] = useState('reviews');
  useEffect(() => {
    fetch('/api/reviews/google')
      .then(res => res.json())
      .then(data => setGoogleReviews(data))
      .catch(() => setGoogleReviews([]));
  }, []);

  // Calculate analytics data based on selected time range
  const analyticsData: AnalyticsData = useMemo(() => {
  // Combine all reviews
  const allReviews = [...mockReviews, ...googleReviews];
    // Filter reviews based on selected time range
    const getFilteredReviews = () => {
      const now = new Date();
      let startDate = new Date();
      switch (timeRange) {
        case '1m':
          startDate.setMonth(now.getMonth() - 1);
          break;
        case '3m':
          startDate.setMonth(now.getMonth() - 3);
          break;
        case '6m':
          startDate.setMonth(now.getMonth() - 6);
          break;
        case '1y':
          startDate.setFullYear(now.getFullYear() - 1);
          break;
        default:
          startDate.setMonth(now.getMonth() - 6);
      }
      return allReviews.filter(review => {
        const reviewDate = new Date(review.date);
        return reviewDate >= startDate;
      });
    };

    const filteredReviews = getFilteredReviews();
    const approvedReviews = filteredReviews.filter(r => r.status === 'approved');

    // Generate monthly trends based on time range
    const generateMonthlyTrends = () => {
      const now = new Date();
      const trends = [];
      let monthsToShow = 6;
      
      switch (timeRange) {
        case '1m':
          monthsToShow = 1;
          break;
        case '3m':
          monthsToShow = 3;
          break;
        case '6m':
          monthsToShow = 6;
          break;
        case '1y':
          monthsToShow = 12;
          break;
      }
      
      // Store all reviews from the trends for consistency calculations
      let allTrendReviews = [];
      
      for (let i = monthsToShow - 1; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthName = date.toLocaleDateString('en-US', { month: 'short' });
        
        // Filter reviews for this specific month
        const monthReviews = filteredReviews.filter(review => {
          const reviewDate = new Date(review.date);
          return reviewDate.getMonth() === date.getMonth() && 
                 reviewDate.getFullYear() === date.getFullYear();
        });
        
        // Add to all trend reviews for later calculations
        allTrendReviews.push(...monthReviews);
        
        const monthRating = monthReviews.length > 0 
          ? monthReviews.reduce((sum, r) => sum + r.rating, 0) / monthReviews.length 
          : 0;
        
        trends.push({
          month: monthName,
          reviews: monthReviews.length,
          rating: monthRating
        });
      }
      
      return { trends, allTrendReviews };
    };

    const { trends: monthlyTrends, allTrendReviews } = generateMonthlyTrends();

    // Calculate totals based on reviews actually included in monthly trends
    const totalReviewsFromTrends = monthlyTrends.reduce((sum, month) => sum + month.reviews, 0);
    const approvedInTrends = allTrendReviews.filter(r => r.status === 'approved');
    const adjustedApprovalRate = totalReviewsFromTrends > 0 ? (approvedInTrends.length / totalReviewsFromTrends) * 100 : 0;
    const adjustedAverageRating = approvedInTrends.length > 0 
      ? approvedInTrends.reduce((sum, r) => sum + r.rating, 0) / approvedInTrends.length 
      : 0;

    // Rating distribution based on reviews that appear in monthly trends
    const ratingDistribution = [5, 4, 3, 2, 1].map(rating => {
      const count = allTrendReviews.filter(r => r.rating === rating).length;
      const percentage = totalReviewsFromTrends > 0 ? (count / totalReviewsFromTrends) * 100 : 0;
      return { rating, count, percentage };
    });

    // Property performance based on filtered reviews
    const propertyStats = new Map();
    filteredReviews.forEach(review => {
      if (!propertyStats.has(review.listingName)) {
        propertyStats.set(review.listingName, { ratings: [], count: 0 });
      }
      const stats = propertyStats.get(review.listingName);
      stats.ratings.push(review.rating);
      stats.count++;
    });

    // Create deterministic trend data based on property name
    const getTrendForProperty = (propertyName: string) => {
      const hash = propertyName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      return ((hash % 41) - 20); // Creates a value between -20 and 20
    };

    const propertyPerformance = Array.from(propertyStats.entries()).map(([name, stats]) => ({
      name,
      rating: stats.ratings.reduce((sum: number, r: number) => sum + r, 0) / stats.ratings.length,
      reviews: stats.count,
      trend: getTrendForProperty(name) // Deterministic trend data
    })).sort((a, b) => b.rating - a.rating);

    // Top performers
    const topPerformers = propertyPerformance.slice(0, 3);

    // Properties needing attention
    const needsAttention = propertyPerformance
      .filter(p => p.rating < 4.0 || p.reviews < 3)
      .map(p => ({
        name: p.name,
        rating: p.rating,
        issues: [
          ...(p.rating < 3.5 ? ['Low rating'] : []),
          ...(p.rating < 4.0 ? ['Below average rating'] : []),
          ...(p.reviews < 3 ? ['Few reviews'] : []),
          ...(p.trend < -5 ? ['Declining trend'] : [])
        ]
      }));

    return {
      totalReviews: totalReviewsFromTrends,
      averageRating: adjustedAverageRating,
      approvalRate: adjustedApprovalRate,
      monthlyGrowth: 15.2, // Mock data
      ratingDistribution,
      propertyPerformance,
      monthlyTrends,
      topPerformers,
      needsAttention
    };
  }, [timeRange]);

  const getMetricColor = (value: number, type: 'rating' | 'trend' | 'approval') => {
    switch (type) {
      case 'rating':
        if (value >= 4.5) return 'text-green-600';
        if (value >= 4.0) return 'text-yellow-600';
        return 'text-red-600';
      case 'trend':
        if (value > 5) return 'text-green-600';
        if (value > -5) return 'text-yellow-600';
        return 'text-red-600';
      case 'approval':
        if (value >= 80) return 'text-green-600';
        if (value >= 60) return 'text-yellow-600';
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getTrendIcon = (trend: number) => {
    if (trend > 5) {
      return (
        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7H7" />
        </svg>
      );
    } else if (trend < -5) {
      return (
        <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 7l-9.2 9.2M7 7v10h10" />
        </svg>
      );
    }
    return (
      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
      </svg>
    );
  };

  // Get time range label for display
  const getTimeRangeLabel = () => {
    switch (timeRange) {
      case '1m':
        return 'Last Month';
      case '3m':
        return 'Last 3 Months';
      case '6m':
        return 'Last 6 Months';
      case '1y':
        return 'Last Year';
      default:
        return 'Last 6 Months';
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-white">
        <div className="relative h-64 bg-gradient-to-r from-gray-100 to-gray-50 overflow-hidden">
          <div className="absolute inset-0 bg-white bg-opacity-60"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
            <div className="text-left">
              <h1 className="text-4xl md:text-5xl font-light text-gray-800 mb-4 tracking-wide">
                Analytics
                <span className="block text-2xl md:text-3xl font-extralight text-gray-600 mt-2">Performance Insights</span>
              </h1>
              <p className="text-lg text-gray-600 font-light">
                Deep insights into your property performance and guest satisfaction
              </p>
              <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                Showing data for: {getTimeRangeLabel()}
              </div>
            </div>
            
            {/* Time Range Filter */}
            <div className="hidden md:block">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-gray-400 focus:border-transparent"
              >
                <option value="1m">Last Month</option>
                <option value="3m">Last 3 Months</option>
                <option value="6m">Last 6 Months</option>
                <option value="1y">Last Year</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500">Total Reviews</h3>
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <p className="text-3xl font-light text-gray-900">{analyticsData.totalReviews}</p>
              <div className="flex items-center text-sm">
                <svg className="w-4 h-4 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7H7" />
                </svg>
                <span className="text-green-600 font-medium">+{analyticsData.monthlyGrowth}%</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500">Average Rating</h3>
              <div className="w-8 h-8 bg-yellow-50 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.164c.969 0 1.371 1.24.588 1.81l-3.368 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.539 1.118l-3.368-2.448a1 1 0 00-1.175 0l-3.368 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.25 9.384c-.783-.57-.38-1.81.588-1.81h4.164a1 1 0 00.95-.69L9.049 2.927z" />
                </svg>
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <p className={`text-3xl font-light ${getMetricColor(analyticsData.averageRating, 'rating')}`}>
                {analyticsData.averageRating.toFixed(1)}
              </p>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className={`w-4 h-4 ${i < Math.floor(analyticsData.averageRating) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.164c.969 0 1.371 1.24.588 1.81l-3.368 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.539 1.118l-3.368-2.448a1 1 0 00-1.175 0l-3.368 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.25 9.384c-.783-.57-.38-1.81.588-1.81h4.164a1 1 0 00.95-.69L9.049 2.927z" />
                  </svg>
                ))}
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500">Approval Rate</h3>
              <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <p className={`text-3xl font-light ${getMetricColor(analyticsData.approvalRate, 'approval')}`}>
                {analyticsData.approvalRate.toFixed(0)}%
              </p>
              <div className="w-16 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${analyticsData.approvalRate}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500">Response Rate</h3>
              <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <p className="text-3xl font-light text-gray-900">94%</p>
              <span className="text-xs text-gray-500">Avg 2.3h</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          
          {/* Rating Distribution */}
          <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-100">
            <h2 className="text-xl font-light text-gray-900 mb-6">Rating Distribution</h2>
            <div className="space-y-4">
              {analyticsData.ratingDistribution.map(({ rating, count, percentage }) => (
                <div key={rating} className="flex items-center">
                  <div className="flex items-center w-16">
                    <span className="text-sm font-medium text-gray-600 mr-2">{rating}</span>
                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.164c.969 0 1.371 1.24.588 1.81l-3.368 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.539 1.118l-3.368-2.448a1 1 0 00-1.175 0l-3.368 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.25 9.384c-.783-.57-.38-1.81.588-1.81h4.164a1 1 0 00.95-.69L9.049 2.927z" />
                    </svg>
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-900 w-8">{count}</span>
                    <span className="text-sm text-gray-500 w-12">{percentage.toFixed(1)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Trends */}
          <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-100">
            <h2 className="text-xl font-light text-gray-900 mb-6">Monthly Trends</h2>
            <div className="space-y-4">
              {analyticsData.monthlyTrends.map((month, index) => (
                <div key={month.month} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">{month.month}</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{month.reviews} reviews</div>
                      <div className="text-xs text-gray-500">Rating: {month.rating}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${(month.reviews / 30) * 100}%` }}
                      ></div>
                    </div>
                    <span className={`text-sm font-medium ${getMetricColor(month.rating, 'rating')}`}>
                      {month.rating}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Property Performance */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-8 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-light text-gray-900">Property Performance</h2>
              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
              >
                <option value="reviews">By Reviews</option>
                <option value="rating">By Rating</option>
                <option value="trend">By Trend</option>
              </select>
            </div>
            <div className="space-y-4">
              {analyticsData.propertyPerformance.map((property, index) => (
                <div key={property.name} className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">{index + 1}</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{property.name}</h3>
                      <p className="text-sm text-gray-500">{property.reviews} reviews</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className={`w-3 h-3 ${i < Math.floor(property.rating) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.164c.969 0 1.371 1.24.588 1.81l-3.368 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.539 1.118l-3.368-2.448a1 1 0 00-1.175 0l-3.368 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.25 9.384c-.783-.57-.38-1.81.588-1.81h4.164a1 1 0 00.95-.69L9.049 2.927z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-sm font-medium text-gray-900">{property.rating.toFixed(1)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      {getTrendIcon(property.trend)}
                      <span className={`text-sm font-medium ${getMetricColor(property.trend, 'trend')}`}>
                        {property.trend > 0 ? '+' : ''}{property.trend.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Items */}
          <div className="space-y-8">
            
            {/* Top Performers */}
            <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-100">
              <h2 className="text-xl font-light text-gray-900 mb-6">Top Performers</h2>
              <div className="space-y-4">
                {analyticsData.topPerformers.map((property, index) => (
                  <div key={property.name} className="flex items-center space-x-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                      index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-yellow-600'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{property.name}</p>
                      <p className="text-xs text-gray-500">{property.rating.toFixed(1)} rating • {property.reviews} reviews</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Needs Attention */}
            <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-100">
              <h2 className="text-xl font-light text-gray-900 mb-6">Needs Attention</h2>
              <div className="space-y-4">
                {analyticsData.needsAttention.length > 0 ? (
                  analyticsData.needsAttention.map((property) => (
                    <div key={property.name} className="p-3 bg-red-50 rounded-lg border border-red-100">
                      <h3 className="text-sm font-medium text-gray-900 mb-1">{property.name}</h3>
                      <p className="text-xs text-red-600 mb-2">Rating: {property.rating.toFixed(1)}</p>
                      <div className="space-y-1">
                        {property.issues.map((issue, index) => (
                          <span key={index} className="inline-block text-xs bg-red-100 text-red-700 px-2 py-1 rounded mr-1">
                            {issue}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <div className="text-green-500 text-2xl mb-2">✅</div>
                    <p className="text-sm text-gray-600">All properties performing well!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
