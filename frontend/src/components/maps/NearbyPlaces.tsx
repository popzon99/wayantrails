/**
 * NearbyPlaces Component
 * Displays nearby attractions, restaurants, and hotels using FREE Overpass API
 */
'use client';

import { useEffect, useState } from 'react';
import { MapPin, Camera, Utensils, Hotel, Navigation } from 'lucide-react';
import {
  getAllNearbyAmenities,
  NearbyPlace,
  formatDistance,
  getCategoryIcon,
  getCategoryName,
} from '@/lib/overpass';

interface NearbyPlacesProps {
  latitude: number;
  longitude: number;
  radius?: number;
  className?: string;
}

const iconMap: { [key: string]: any } = {
  camera: Camera,
  utensils: Utensils,
  bed: Hotel,
  'map-pin': MapPin,
  droplet: MapPin,
  mountain: MapPin,
  building: MapPin,
};

export default function NearbyPlaces({
  latitude,
  longitude,
  radius = 5000,
  className = '',
}: NearbyPlacesProps) {
  const [loading, setLoading] = useState(true);
  const [attractions, setAttractions] = useState<NearbyPlace[]>([]);
  const [restaurants, setRestaurants] = useState<NearbyPlace[]>([]);
  const [accommodations, setAccommodations] = useState<NearbyPlace[]>([]);
  const [activeTab, setActiveTab] = useState<'attractions' | 'restaurants' | 'accommodations'>('attractions');

  useEffect(() => {
    async function fetchNearbyPlaces() {
      setLoading(true);
      try {
        const data = await getAllNearbyAmenities(latitude, longitude, radius);
        setAttractions(data.attractions.slice(0, 10));
        setRestaurants(data.restaurants.slice(0, 10));
        setAccommodations(data.accommodations.slice(0, 10));
      } catch (error) {
        console.error('Error fetching nearby places:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchNearbyPlaces();
  }, [latitude, longitude, radius]);

  const getActiveData = () => {
    switch (activeTab) {
      case 'attractions':
        return attractions;
      case 'restaurants':
        return restaurants;
      case 'accommodations':
        return accommodations;
      default:
        return [];
    }
  };

  const openDirections = (place: NearbyPlace) => {
    const url = `https://www.openstreetmap.org/directions?from=${latitude},${longitude}&to=${place.lat},${place.lon}`;
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Things to Do Nearby</h3>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-16 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const activeData = getActiveData();

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Things to Do Nearby</h3>
        <span className="text-sm text-gray-500">Within {formatDistance(radius)}</span>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4 border-b">
        <button
          onClick={() => setActiveTab('attractions')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'attractions'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Camera className="w-4 h-4 inline mr-1" />
          Attractions ({attractions.length})
        </button>
        <button
          onClick={() => setActiveTab('restaurants')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'restaurants'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Utensils className="w-4 h-4 inline mr-1" />
          Restaurants ({restaurants.length})
        </button>
        <button
          onClick={() => setActiveTab('accommodations')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'accommodations'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Hotel className="w-4 h-4 inline mr-1" />
          Hotels ({accommodations.length})
        </button>
      </div>

      {/* Places List */}
      <div className="space-y-3">
        {activeData.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-8">
            No {activeTab} found within {formatDistance(radius)}
          </p>
        ) : (
          activeData.map((place) => {
            const IconComponent = iconMap[getCategoryIcon(place.tags)] || MapPin;
            return (
              <div
                key={place.id}
                className="flex items-start justify-between p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <div className="flex items-start gap-3 flex-1">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <IconComponent className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-800 truncate">{place.name}</h4>
                    <p className="text-sm text-gray-600">{getCategoryName(place.tags)}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDistance(place.distance || 0)} away
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => openDirections(place)}
                  className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                  title="Get Directions"
                >
                  <Navigation className="w-5 h-5" />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* OpenStreetMap Attribution */}
      <div className="mt-4 pt-4 border-t">
        <p className="text-xs text-gray-500">
          Data provided by{' '}
          <a
            href="https://www.openstreetmap.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            OpenStreetMap
          </a>{' '}
          - Free & Open Source
        </p>
      </div>
    </div>
  );
}
