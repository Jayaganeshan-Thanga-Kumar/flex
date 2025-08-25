'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { mockReviews } from '@/data/mock-reviews';
import Header from '@/components/Header';
import Image from 'next/image';

import { Review } from '@/lib/types';

interface Property {
  id: string;
  name: string;
  location: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  pricePerNight: number;
  image: string;
  totalReviews: number;
  averageRating: number;
  approvedReviews: number;
  pendingReviews: number;
  occupancyRate: number;
  status: 'active' | 'maintenance' | 'inactive';
}

interface PropertyStats {
  totalReviews: number;
  averageRating: number;
  approvedReviews: number;
  pendingReviews: number;
}

export default function PropertiesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('name');

  // Calculate property statistics from reviews
  const propertyStats = useMemo(() => {
  const stats: Record<string, PropertyStats> = {};
  // Get unique property names from reviews
  const uniqueProperties = Array.from(new Set(mockReviews.map(r => r.listingName)));

    uniqueProperties.forEach(propertyName => {
      const propertyReviews = mockReviews.filter(r => r.listingName === propertyName);
      const approvedReviews = propertyReviews.filter(r => r.status === 'approved');
      const pendingReviews = propertyReviews.filter(r => r.status === 'pending');
      
      stats[propertyName] = {
        totalReviews: propertyReviews.length,
        approvedReviews: approvedReviews.length,
        pendingReviews: pendingReviews.length,
        averageRating: approvedReviews.length > 0 
          ? approvedReviews.reduce((sum, r) => sum + r.rating, 0) / approvedReviews.length 
          : 0
      };
    });
    
    return stats;
  }, []);

  // Mock properties data with real review statistics
  const properties: Property[] = useMemo(() => [
    {
      id: '1',
      name: 'Sunset Villa',
      location: 'Kensington, London',
      type: 'Villa',
      bedrooms: 3,
      bathrooms: 2,
      maxGuests: 6,
      pricePerNight: 280,
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      totalReviews: propertyStats['Sunset Villa']?.totalReviews || 0,
      averageRating: propertyStats['Sunset Villa']?.averageRating || 0,
      approvedReviews: propertyStats['Sunset Villa']?.approvedReviews || 0,
      pendingReviews: propertyStats['Sunset Villa']?.pendingReviews || 0,
      occupancyRate: 85,
      status: 'active'
    },
    {
      id: '2',
      name: 'Downtown Core Apartment',
      location: 'City of London',
      type: 'Apartment',
      bedrooms: 1,
      bathrooms: 1,
      maxGuests: 2,
      pricePerNight: 180,
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      totalReviews: propertyStats['Downtown Core Apartment']?.totalReviews || 0,
      averageRating: propertyStats['Downtown Core Apartment']?.averageRating || 0,
      approvedReviews: propertyStats['Downtown Core Apartment']?.approvedReviews || 0,
      pendingReviews: propertyStats['Downtown Core Apartment']?.pendingReviews || 0,
      occupancyRate: 92,
      status: 'active'
    },
    {
      id: '3',
      name: 'Skyline Penthouse',
      location: 'Canary Wharf, London',
      type: 'Penthouse',
      bedrooms: 2,
      bathrooms: 2,
      maxGuests: 4,
      pricePerNight: 450,
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      totalReviews: propertyStats['Skyline Penthouse']?.totalReviews || 0,
      averageRating: propertyStats['Skyline Penthouse']?.averageRating || 0,
      approvedReviews: propertyStats['Skyline Penthouse']?.approvedReviews || 0,
      pendingReviews: propertyStats['Skyline Penthouse']?.pendingReviews || 0,
      occupancyRate: 78,
      status: 'active'
    },
    {
      id: '4',
      name: 'Garden District Home',
      location: 'Hampstead, London',
      type: 'House',
      bedrooms: 4,
      bathrooms: 3,
      maxGuests: 8,
      pricePerNight: 320,
      image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      totalReviews: propertyStats['Garden District Home']?.totalReviews || 0,
      averageRating: propertyStats['Garden District Home']?.averageRating || 0,
      approvedReviews: propertyStats['Garden District Home']?.approvedReviews || 0,
      pendingReviews: propertyStats['Garden District Home']?.pendingReviews || 0,
      occupancyRate: 88,
      status: 'active'
    },
    {
      id: '5',
      name: 'Waterfront Studio',
      location: 'Greenwich, London',
      type: 'Studio',
      bedrooms: 0,
      bathrooms: 1,
      maxGuests: 2,
      pricePerNight: 120,
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      totalReviews: propertyStats['Waterfront Studio']?.totalReviews || 0,
      averageRating: propertyStats['Waterfront Studio']?.averageRating || 0,
      approvedReviews: propertyStats['Waterfront Studio']?.approvedReviews || 0,
      pendingReviews: propertyStats['Waterfront Studio']?.pendingReviews || 0,
      occupancyRate: 65,
      status: 'maintenance'
    },
    {
      id: '6',
      name: 'Business District Loft',
      location: 'Shoreditch, London',
      type: 'Loft',
      bedrooms: 2,
      bathrooms: 1,
      maxGuests: 4,
      pricePerNight: 220,
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      totalReviews: propertyStats['Business District Loft']?.totalReviews || 0,
      averageRating: propertyStats['Business District Loft']?.averageRating || 0,
      approvedReviews: propertyStats['Business District Loft']?.approvedReviews || 0,
      pendingReviews: propertyStats['Business District Loft']?.pendingReviews || 0,
      occupancyRate: 90,
      status: 'active'
    },
    {
      id: '7',
      name: 'Historic Quarter Apartment',
      location: 'Westminster, London',
      type: 'Apartment',
      bedrooms: 2,
      bathrooms: 1,
      maxGuests: 4,
      pricePerNight: 260,
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      totalReviews: propertyStats['Historic Quarter Apartment']?.totalReviews || 0,
      averageRating: propertyStats['Historic Quarter Apartment']?.averageRating || 0,
      approvedReviews: propertyStats['Historic Quarter Apartment']?.approvedReviews || 0,
      pendingReviews: propertyStats['Historic Quarter Apartment']?.pendingReviews || 0,
      occupancyRate: 82,
      status: 'active'
    },
    {
      id: '8',
      name: 'Coastal Retreat',
      location: 'Brighton, East Sussex',
      type: 'House',
      bedrooms: 3,
      bathrooms: 2,
      maxGuests: 6,
      pricePerNight: 200,
      image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      totalReviews: propertyStats['Coastal Retreat']?.totalReviews || 0,
      averageRating: propertyStats['Coastal Retreat']?.averageRating || 0,
      approvedReviews: propertyStats['Coastal Retreat']?.approvedReviews || 0,
      pendingReviews: propertyStats['Coastal Retreat']?.pendingReviews || 0,
      occupancyRate: 75,
      status: 'active'
    }
  ], [propertyStats]);

  // Filter and sort properties
  const filteredAndSortedProperties = useMemo(() => {
    const filtered = properties.filter(property => {
      const matchesSearch = property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           property.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLocation = !locationFilter || property.location.includes(locationFilter);
      const matchesType = !typeFilter || property.type === typeFilter;
      const matchesStatus = !statusFilter || property.status === statusFilter;
      
      return matchesSearch && matchesLocation && matchesType && matchesStatus;
    });

    // Sort properties
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rating':
          return b.averageRating - a.averageRating;
        case 'reviews':
          return b.totalReviews - a.totalReviews;
        case 'occupancy':
          return b.occupancyRate - a.occupancyRate;
        case 'price':
          return b.pricePerNight - a.pricePerNight;
        default:
          return 0;
      }
    });

    return filtered;
  }, [properties, searchTerm, locationFilter, typeFilter, statusFilter, sortBy]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const uniqueLocations = Array.from(new Set(properties.map(p => p.location.split(',')[1]?.trim() || p.location)));
  const uniqueTypes = Array.from(new Set(properties.map(p => p.type)));

  const handleViewDetails = (propertyName: string) => {
    const encodedName = encodeURIComponent(propertyName);
    console.log('Navigating to property:', propertyName, 'Encoded:', encodedName);
    router.push(`/properties/${encodedName}`);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-white">
        <div className="relative h-64 bg-gradient-to-r from-gray-100 to-gray-50 overflow-hidden">
          <div className="absolute inset-0 bg-white bg-opacity-60"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
            <div className="text-left">
              <h1 className="text-4xl md:text-5xl font-light text-gray-800 mb-4 tracking-wide">
                Properties
                <span className="block text-2xl md:text-3xl font-extralight text-gray-600 mt-2">Portfolio Management</span>
              </h1>
              <p className="text-lg text-gray-600 font-light">
                Manage and monitor all your properties in one place
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Properties</p>
                <p className="text-3xl font-light text-gray-900">{properties.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h3M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Avg Occupancy</p>
                <p className="text-3xl font-light text-gray-900">
                  {Math.round(properties.reduce((sum, p) => sum + p.occupancyRate, 0) / properties.length)}%
                </p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Avg Rating</p>
                <p className="text-3xl font-light text-gray-900">
                  {(properties.reduce((sum, p) => sum + p.averageRating, 0) / properties.length).toFixed(1)}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.164c.969 0 1.371 1.24.588 1.81l-3.368 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.539 1.118l-3.368-2.448a1 1 0 00-1.175 0l-3.368 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.25 9.384c-.783-.57-.38-1.81.588-1.81h4.164a1 1 0 00.95-.69L9.049 2.927z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Active Properties</p>
                <p className="text-3xl font-light text-gray-900">
                  {properties.filter(p => p.status === 'active').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8 border border-gray-100">
          <h2 className="text-xl font-light text-gray-900 mb-6">Filter Properties</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                placeholder="Property name or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-gray-300 focus:border-gray-300 text-black placeholder-black"
                style={{ color: 'black' }}
              />
            </div>
            
            {/* Location Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-gray-300 focus:border-gray-300 text-black"
                style={{ color: 'black' }}
              >
                <option value="" style={{ color: 'black' }}>All Locations</option>
                {uniqueLocations.map(location => (
                  <option key={location} value={location} style={{ color: 'black' }}>{location}</option>
                ))}
              </select>
            </div>
            
            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-gray-300 focus:border-gray-300 text-black"
                style={{ color: 'black' }}
              >
                <option value="" style={{ color: 'black' }}>All Types</option>
                {uniqueTypes.map(type => (
                  <option key={type} value={type} style={{ color: 'black' }}>{type}</option>
                ))}
              </select>
            </div>
            
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-gray-300 focus:border-gray-300 text-black"
                style={{ color: 'black' }}
              >
                <option value="" style={{ color: 'black' }}>All Status</option>
                <option value="active" style={{ color: 'black' }}>Active</option>
                <option value="maintenance" style={{ color: 'black' }}>Maintenance</option>
                <option value="inactive" style={{ color: 'black' }}>Inactive</option>
              </select>
            </div>
            
            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-gray-300 focus:border-gray-300 text-black"
                style={{ color: 'black' }}
              >
                <option value="name" style={{ color: 'black' }}>Name</option>
                <option value="rating" style={{ color: 'black' }}>Rating</option>
                <option value="reviews" style={{ color: 'black' }}>Reviews</option>
                <option value="occupancy" style={{ color: 'black' }}>Occupancy</option>
                <option value="price" style={{ color: 'black' }}>Price</option>
              </select>
            </div>
          </div>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAndSortedProperties.map((property) => (
            <div key={property.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden">
              {/* Property Image */}
              <div className="relative h-48 bg-gray-200 overflow-hidden">
                <Image 
                  src={property.image}
                  alt={property.name}
                  width={400}
                  height={192}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNzUgMTIwTDIwMCAxNDBMMjI1IDEyMEwyNTAgMTQwTDI3NSAxMjBMMjc1IDE4MEwxNzUgMTgwVjEyMFoiIGZpbGw9IiM5Q0E0QUYiLz4KPGNpcmNsZSBjeD0iMjAwIiBjeT0iMTUwIiByPSIxNSIgZmlsbD0iIzY5N0M5QSIvPgo8L3N2Zz4K';
                  }}
                />
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(property.status)}`}>
                  {property.status}
                </div>
              </div>
              
              {/* Property Details */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">{property.name}</h3>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">£{property.pricePerNight}</div>
                    <div className="text-sm text-gray-500">per night</div>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4">{property.location}</p>
                
                {/* Property Stats */}
                <div className="grid grid-cols-3 gap-2 mb-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2" />
                    </svg>
                    {property.bedrooms} bed
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10v11M20 10v11" />
                    </svg>
                    {property.bathrooms} bath
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                    {property.maxGuests} guests
                  </div>
                </div>
                
                {/* Performance Metrics */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Rating</span>
                    <div className="flex items-center">
                      {property.averageRating > 0 ? (
                        <>
                          <div className="flex items-center mr-2">
                            {[...Array(5)].map((_, i) => (
                              <svg key={i} className={`w-4 h-4 ${i < Math.floor(property.averageRating) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.164c.969 0 1.371 1.24.588 1.81l-3.368 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.539 1.118l-3.368-2.448a1 1 0 00-1.175 0l-3.368 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.25 9.384c-.783-.57-.38-1.81.588-1.81h4.164a1 1 0 00.95-.69L9.049 2.927z" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-sm font-medium">{property.averageRating.toFixed(1)}</span>
                        </>
                      ) : (
                        <span className="text-sm text-gray-400">No ratings</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Reviews</span>
                    <span className="text-sm font-medium">
                      {property.totalReviews} total ({property.pendingReviews} pending)
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Occupancy</span>
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${property.occupancyRate}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{property.occupancyRate}%</span>
                    </div>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleViewDetails(property.name)}
                    className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-900 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredAndSortedProperties.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <div className="text-gray-400 text-6xl mb-4">🏢</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No properties found</h3>
            <p className="text-gray-600">Try adjusting your filters to see more results</p>
          </div>
        )}
      </div>
    </div>
  );
}
