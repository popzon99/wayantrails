'use client';

import { useFeaturedResorts } from '@/lib/hooks';
import { Card } from '@/components/ui';

/**
 * Example component demonstrating API integration with hooks
 * This fetches and displays featured resorts from the backend
 */
export function FeaturedResortsExample() {
  const { resorts, isLoading, isError } = useFeaturedResorts();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Featured Resorts</h2>
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
          <p className="font-semibold">Error loading featured resorts</p>
          <p className="text-sm mt-1">
            Please ensure the backend is running at {process.env.NEXT_PUBLIC_API_URL}
          </p>
        </div>
      </div>
    );
  }

  if (!resorts || resorts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Featured Resorts</h2>
        <div className="text-center py-12 text-gray-500">
          No featured resorts available at the moment.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Featured Resorts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resorts.map((resort) => (
          <Card key={resort.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            {resort.cover_image && (
              <div className="relative h-48 bg-gray-200">
                <img
                  src={resort.cover_image}
                  alt={resort.name}
                  className="w-full h-full object-cover"
                />
                {resort.is_verified && (
                  <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                    Verified
                  </span>
                )}
              </div>
            )}
            <div className="p-4">
              <h3 className="font-bold text-lg mb-2">{resort.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{resort.city}, {resort.state}</p>
              {resort.short_description && (
                <p className="text-sm text-gray-700 line-clamp-2 mb-3">
                  {resort.short_description}
                </p>
              )}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <span className="text-yellow-500">★</span>
                  <span className="font-semibold">{resort.star_rating}</span>
                  {resort.average_rating && (
                    <span className="text-sm text-gray-500">
                      ({resort.average_rating})
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">From</div>
                  <div className="font-bold text-lg">
                    ₹{resort.price_range_min}
                  </div>
                </div>
              </div>
              <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition-colors">
                View Details
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
