/**
 * Example Destination Page
 * Demonstrates FREE OpenStreetMap integration (no API keys needed)
 */
'use client';

import dynamic from 'next/dynamic';
import { MapPin, Clock, DollarSign, Users } from 'lucide-react';

// Import map components with SSR disabled (Leaflet requires window)
const LeafletMap = dynamic(() => import('@/components/maps/LeafletMap'), {
  ssr: false,
  loading: () => (
    <div className="h-96 bg-gray-200 rounded-lg animate-pulse flex items-center justify-center">
      <p className="text-gray-500">Loading map...</p>
    </div>
  ),
});

const NearbyPlaces = dynamic(() => import('@/components/maps/NearbyPlaces'), {
  ssr: false,
  loading: () => (
    <div className="h-64 bg-gray-200 rounded-lg animate-pulse"></div>
  ),
});

// Example destination data - Edakkal Caves
const destination = {
  name: 'Edakkal Caves',
  slug: 'edakkal-caves',
  type: 'Cultural Site',
  description:
    'Edakkal Caves are two natural caves at a remote location at Edakkal, 25 km from Kalpetta in the Wayanad district of Kerala. These caves have ancient petroglyphs dating back to at least 6,000 BCE.',
  latitude: 11.6718,
  longitude: 76.0791,
  entryFee: 40,
  openingTime: '09:00 AM',
  closingTime: '05:00 PM',
  bestTimeToVisit: 'October to May',
  duration: '2-3 hours',
  coverImage: 'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?w=800',
};

export default function ExampleDestinationPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div
        className="h-96 bg-cover bg-center relative"
        style={{ backgroundImage: `url(${destination.coverImage})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end">
          <div className="container mx-auto px-4 pb-8">
            <span className="inline-block px-3 py-1 bg-blue-600 text-white text-sm rounded-full mb-2">
              {destination.type}
            </span>
            <h1 className="text-4xl font-bold text-white mb-2">{destination.name}</h1>
            <div className="flex items-center gap-4 text-white text-sm">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>Wayanad, Kerala</span>
              </div>
              <div className="flex items-center gap-1">
                <DollarSign className="w-4 h-4" />
                <span>₹{destination.entryFee} entry fee</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{destination.duration}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">About</h2>
              <p className="text-gray-600 leading-relaxed">{destination.description}</p>
            </div>

            {/* Map Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Location</h2>
              <LeafletMap
                latitude={destination.latitude}
                longitude={destination.longitude}
                zoom={14}
                height="400px"
              />
            </div>

            {/* Nearby Places */}
            <NearbyPlaces
              latitude={destination.latitude}
              longitude={destination.longitude}
              radius={5000}
            />
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Quick Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-gray-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-800">Opening Hours</p>
                    <p className="text-sm text-gray-600">
                      {destination.openingTime} - {destination.closingTime}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <DollarSign className="w-5 h-5 text-gray-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-800">Entry Fee</p>
                    <p className="text-sm text-gray-600">₹{destination.entryFee} per person</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-gray-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-800">Best Time to Visit</p>
                    <p className="text-sm text-gray-600">{destination.bestTimeToVisit}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Book Now CTA */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg shadow-md p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">Plan Your Visit</h3>
              <p className="text-sm text-blue-100 mb-4">
                Book guided tours and activities at this destination
              </p>
              <button className="w-full bg-white text-blue-600 font-semibold py-3 rounded-lg hover:bg-blue-50 transition-colors">
                View Available Tours
              </button>
            </div>

            {/* Free Features Badge */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-2">
                ✅ 100% Free Features
              </h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Interactive OpenStreetMap</li>
                <li>• Nearby attractions finder</li>
                <li>• Free geocoding service</li>
                <li>• No API keys required!</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
