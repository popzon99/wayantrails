'use client';

import { useFeaturedHomestays } from '@/lib/hooks';
import { Card, Badge } from '@/components/ui';

/**
 * Example component demonstrating homestays API integration
 */
export function FeaturedHomestaysExample() {
  const { homestays, isLoading, isError } = useFeaturedHomestays();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Featured Homestays</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-48 rounded-t-lg"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          <p className="font-semibold">Error loading featured homestays</p>
          <p className="text-sm mt-1">
            Please ensure the backend is running at {process.env.NEXT_PUBLIC_API_URL}
          </p>
        </div>
      </div>
    );
  }

  if (!homestays || homestays.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Featured Homestays</h2>
        <div className="text-center py-12 text-gray-500">
          No featured homestays available at the moment.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Featured Homestays</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {homestays.map((homestay) => (
          <Card key={homestay.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            {homestay.cover_image && (
              <div className="relative h-48 bg-gray-200">
                <img
                  src={homestay.cover_image}
                  alt={homestay.name}
                  className="w-full h-full object-cover"
                />
                {homestay.is_verified && (
                  <Badge variant="success" className="absolute top-2 right-2">
                    Verified
                  </Badge>
                )}
              </div>
            )}
            <div className="p-4">
              <h3 className="font-bold text-lg mb-2">{homestay.name}</h3>
              <p className="text-sm text-gray-600 mb-2">
                Hosted by {homestay.host_name}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                {homestay.city}, {homestay.state}
              </p>
              {homestay.short_description && (
                <p className="text-sm text-gray-700 line-clamp-2 mb-3">
                  {homestay.short_description}
                </p>
              )}
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="secondary">{homestay.homestay_type}</Badge>
                {homestay.provides_meals && (
                  <Badge variant="secondary">Meals Included</Badge>
                )}
                {homestay.pet_friendly && (
                  <Badge variant="secondary">Pet Friendly</Badge>
                )}
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Max {homestay.max_guests} guests
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Per night</div>
                  <div className="font-bold text-lg">
                    ₹{homestay.price_per_night}
                  </div>
                </div>
              </div>
              <button className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-2 rounded transition-colors">
                Book Now
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
