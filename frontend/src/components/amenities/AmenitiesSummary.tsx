'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Star } from 'lucide-react';
import { Amenity } from './AmenitiesDisplay';

export interface AmenitiesSummaryProps {
  amenitiesByCategory: Record<string, Amenity[]>;
  maxDisplay?: number;
  showPremiumBadge?: boolean;
  onShowAll?: () => void;
}

export default function AmenitiesSummary({
  amenitiesByCategory,
  maxDisplay = 6,
  showPremiumBadge = true,
  onShowAll
}: AmenitiesSummaryProps) {
  // Flatten all amenities and prioritize featured and premium
  const allAmenities = Object.values(amenitiesByCategory).flat();

  // Sort by: featured first, then premium, then by name
  const sortedAmenities = [...allAmenities].sort((a, b) => {
    if (a.is_featured !== b.is_featured) return a.is_featured ? -1 : 1;
    if (a.is_premium !== b.is_premium) return a.is_premium ? -1 : 1;
    return a.name.localeCompare(b.name);
  });

  const displayAmenities = sortedAmenities.slice(0, maxDisplay);
  const remainingCount = sortedAmenities.length - maxDisplay;

  if (allAmenities.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {displayAmenities.map((amenity, index) => (
          <motion.div
            key={amenity.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="group relative"
          >
            <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              amenity.is_premium
                ? 'bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 border border-amber-200'
                : 'bg-gray-50 text-gray-700 border border-gray-200 hover:border-green-300 hover:bg-green-50'
            }`}>
              <svg className="w-3.5 h-3.5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>{amenity.name}</span>
              {showPremiumBadge && amenity.is_premium && (
                <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
              )}
            </div>

            {/* Tooltip */}
            {amenity.additional_info && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-10 pointer-events-none">
                {amenity.additional_info}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
              </div>
            )}
          </motion.div>
        ))}

        {remainingCount > 0 && (
          <button
            onClick={onShowAll}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            {remainingCount} more
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 text-xs text-gray-500">
        <span>{allAmenities.length} total amenities</span>
        {allAmenities.some(a => a.is_premium) && (
          <span className="flex items-center gap-1">
            <Star className="w-3 h-3 text-amber-500" />
            {allAmenities.filter(a => a.is_premium).length} premium
          </span>
        )}
      </div>
    </div>
  );
}
