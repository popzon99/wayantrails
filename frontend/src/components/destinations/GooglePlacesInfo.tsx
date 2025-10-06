/**
 * GooglePlacesInfo Component
 * Displays real-time data from Google Places API
 */
'use client';

import { Star, MapPin, Phone, Globe, Clock, Users } from 'lucide-react';

interface GoogleReview {
  author: string;
  rating: number;
  text: string;
  time: number;
  profile_photo?: string;
}

interface GoogleOpeningHours {
  open_now?: boolean;
  weekday_text?: string[];
}

interface GooglePlacesInfoProps {
  googleRating?: number;
  googleTotalRatings?: number;
  googleMapsUrl?: string;
  googlePhone?: string;
  googleWebsite?: string;
  googleReviews?: GoogleReview[];
  googleOpeningHours?: GoogleOpeningHours;
  className?: string;
}

export default function GooglePlacesInfo({
  googleRating,
  googleTotalRatings,
  googleMapsUrl,
  googlePhone,
  googleWebsite,
  googleReviews = [],
  googleOpeningHours,
  className = '',
}: GooglePlacesInfoProps) {
  // Don't render if no Google data
  if (!googleRating && !googleMapsUrl && !googlePhone && !googleWebsite) {
    return null;
  }

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <img
          src="https://www.google.com/favicon.ico"
          alt="Google"
          className="w-5 h-5"
        />
        <h3 className="text-lg font-semibold text-gray-800">
          Google Places Information
        </h3>
      </div>

      <div className="space-y-4">
        {/* Google Rating */}
        {googleRating && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span className="text-2xl font-bold text-gray-800">
                {googleRating.toFixed(1)}
              </span>
            </div>
            <div className="text-sm text-gray-600">
              <Users className="w-4 h-4 inline mr-1" />
              {googleTotalRatings?.toLocaleString()} reviews
            </div>
          </div>
        )}

        {/* Opening Hours */}
        {googleOpeningHours && (
          <div className="border-t pt-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-gray-600" />
              <span className="font-semibold text-gray-800">Opening Hours</span>
              {googleOpeningHours.open_now !== undefined && (
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    googleOpeningHours.open_now
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {googleOpeningHours.open_now ? 'Open Now' : 'Closed'}
                </span>
              )}
            </div>
            {googleOpeningHours.weekday_text && (
              <ul className="space-y-1 text-sm text-gray-600 ml-7">
                {googleOpeningHours.weekday_text.map((day, index) => (
                  <li key={index}>{day}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Contact Information */}
        <div className="border-t pt-4 space-y-2">
          {googlePhone && (
            <a
              href={`tel:${googlePhone}`}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span className="text-sm">{googlePhone}</span>
            </a>
          )}

          {googleWebsite && (
            <a
              href={googleWebsite}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <Globe className="w-4 h-4" />
              <span className="text-sm">Visit Website</span>
            </a>
          )}

          {googleMapsUrl && (
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <MapPin className="w-4 h-4" />
              <span className="text-sm">View on Google Maps</span>
            </a>
          )}
        </div>

        {/* Google Reviews */}
        {googleReviews && googleReviews.length > 0 && (
          <div className="border-t pt-4">
            <h4 className="font-semibold text-gray-800 mb-3">
              Recent Google Reviews
            </h4>
            <div className="space-y-3">
              {googleReviews.slice(0, 3).map((review, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-lg p-3 border border-gray-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm text-gray-800">
                      {review.author}
                    </span>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < review.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {review.text}
                  </p>
                </div>
              ))}
            </div>
            {googleMapsUrl && (
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                View all reviews on Google →
              </a>
            )}
          </div>
        )}
      </div>

      {/* Google Attribution */}
      <div className="mt-4 pt-4 border-t">
        <p className="text-xs text-gray-500">
          Information provided by Google Places API
        </p>
      </div>
    </div>
  );
}
