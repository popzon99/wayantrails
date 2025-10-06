'use client';

import React, { useState, useEffect } from 'react';
import { AmenitiesFilter, AmenitiesSummary } from '@/components/amenities';
import { motion } from 'framer-motion';
import { Search, MapPin, Star, Users, DollarSign } from 'lucide-react';
import Link from 'next/link';

interface Resort {
  id: number;
  name: string;
  slug: string;
  short_description: string;
  city: string;
  state: string;
  cover_image: string;
  star_rating: number;
  price_range_min: number;
  price_range_max: number;
  average_rating: number;
  total_reviews: number;
  amenities_by_category?: Record<string, any[]>;
}

export default function ResortsWithFilters() {
  const [resorts, setResorts] = useState<Resort[]>([]);
  const [allAmenities, setAllAmenities] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [loading, setLoading] = useState(true);

  // Fetch available amenities for filter
  useEffect(() => {
    fetch('/api/resorts/amenities/')
      .then(res => res.json())
      .then(data => setAllAmenities(data))
      .catch(err => console.error('Error fetching amenities:', err));
  }, []);

  // Fetch resorts with filters
  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();

    if (searchTerm) params.set('search', searchTerm);
    if (selectedAmenities.length > 0) params.set('amenities', selectedAmenities.join(','));
    if (priceRange[0] > 0) params.set('min_price', priceRange[0].toString());
    if (priceRange[1] < 50000) params.set('max_price', priceRange[1].toString());

    fetch(`/api/resorts/?${params}`)
      .then(res => res.json())
      .then(data => {
        setResorts(data.results || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching resorts:', err);
        setLoading(false);
      });
  }, [searchTerm, selectedAmenities, priceRange]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl font-bold mb-4">Find Your Perfect Resort</h1>
            <p className="text-xl text-green-100 max-w-2xl mx-auto">
              Discover luxury accommodations with world-class amenities in Wayanad
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters Bar */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 sticky top-4 z-30">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search resorts by name or location..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Amenities Filter */}
            <AmenitiesFilter
              amenities={allAmenities}
              selectedAmenities={selectedAmenities}
              onFilterChange={setSelectedAmenities}
            />

            {/* Price Range (Simplified) */}
            <div className="lg:w-64">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Range
              </label>
              <select
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === 'all') setPriceRange([0, 50000]);
                  else if (value === 'budget') setPriceRange([0, 5000]);
                  else if (value === 'mid') setPriceRange([5000, 15000]);
                  else if (value === 'luxury') setPriceRange([15000, 50000]);
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="all">All Prices</option>
                <option value="budget">Budget (₹0 - ₹5,000)</option>
                <option value="mid">Mid-Range (₹5,000 - ₹15,000)</option>
                <option value="luxury">Luxury (₹15,000+)</option>
              </select>
            </div>
          </div>

          {/* Active Filters */}
          {selectedAmenities.length > 0 && (
            <div className="mt-4 flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium text-gray-700">Active Filters:</span>
              {selectedAmenities.map(id => {
                const amenity = allAmenities.find((a: any) => a.id === id);
                return amenity ? (
                  <span
                    key={id}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                  >
                    {(amenity as any).name}
                    <button
                      onClick={() => setSelectedAmenities(selectedAmenities.filter(a => a !== id))}
                      className="hover:text-green-900"
                    >
                      ×
                    </button>
                  </span>
                ) : null;
              })}
              <button
                onClick={() => setSelectedAmenities([])}
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Clear All
              </button>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-gray-600">
            {loading ? 'Loading...' : `${resorts.length} resorts found`}
          </p>
          <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm">
            <option>Sort by: Recommended</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Rating: High to Low</option>
          </select>
        </div>

        {/* Resorts Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
                <div className="w-full h-48 bg-gray-200" />
                <div className="p-6 space-y-3">
                  <div className="h-6 bg-gray-200 rounded" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : resorts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🏨</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No resorts found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your filters or search terms</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedAmenities([]);
                setPriceRange([0, 50000]);
              }}
              className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resorts.map((resort, index) => (
              <motion.div
                key={resort.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Link href={`/resorts/${resort.slug}`}>
                  <div className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-shadow overflow-hidden group cursor-pointer h-full flex flex-col">
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={resort.cover_image || '/placeholder-resort.jpg'}
                        alt={resort.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-bold text-sm">{resort.average_rating || 'New'}</span>
                      </div>
                      {resort.star_rating && (
                        <div className="absolute top-4 left-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                          {resort.star_rating} Star
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                        {resort.name}
                      </h3>

                      <div className="flex items-center gap-2 text-gray-600 mb-3">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{resort.city}, {resort.state}</span>
                      </div>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">
                        {resort.short_description}
                      </p>

                      {/* Amenities Summary */}
                      {resort.amenities_by_category && (
                        <div className="mb-4">
                          <AmenitiesSummary
                            amenitiesByCategory={resort.amenities_by_category}
                            maxDisplay={4}
                            showPremiumBadge={true}
                          />
                        </div>
                      )}

                      {/* Price & CTA */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div>
                          <div className="text-2xl font-bold text-green-600">
                            ₹{resort.price_range_min?.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500">per night</div>
                        </div>
                        <button className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
