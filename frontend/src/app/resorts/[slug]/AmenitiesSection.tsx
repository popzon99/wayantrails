'use client';

import React from 'react';
import { AmenitiesDisplay } from '@/components/amenities';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface AmenitiesSectionProps {
  amenitiesByCategory: Record<string, any[]>;
}

export default function AmenitiesSection({ amenitiesByCategory }: AmenitiesSectionProps) {
  // Count total amenities and premium ones
  const allAmenities = Object.values(amenitiesByCategory).flat();
  const premiumCount = allAmenities.filter(a => a.is_premium).length;

  return (
    <section className="py-16 bg-gradient-to-b from-white to-green-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Premium Amenities
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            World-Class Amenities & Facilities
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience luxury and comfort with our comprehensive range of {allAmenities.length} amenities,
            including {premiumCount} premium features designed for your ultimate relaxation.
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {allAmenities.length}
            </div>
            <div className="text-sm text-gray-600">Total Amenities</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
            <div className="text-3xl font-bold text-amber-600 mb-2">
              {premiumCount}
            </div>
            <div className="text-sm text-gray-600">Premium Features</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {Object.keys(amenitiesByCategory).length}
            </div>
            <div className="text-sm text-gray-600">Categories</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {allAmenities.filter(a => a.is_featured).length}
            </div>
            <div className="text-sm text-gray-600">Featured</div>
          </div>
        </motion.div>

        {/* Amenities Display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <AmenitiesDisplay
            amenitiesByCategory={amenitiesByCategory}
            layout="grid"
            showPremiumBadge={true}
            animated={true}
          />
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl p-8 shadow-xl">
            <h3 className="text-2xl font-bold mb-4">
              Ready to Experience These Amazing Amenities?
            </h3>
            <p className="text-green-100 mb-6 max-w-2xl mx-auto">
              Book your stay now and enjoy access to all our premium facilities and services.
            </p>
            <button className="px-8 py-3 bg-white text-green-600 font-bold rounded-lg hover:bg-green-50 transition-colors shadow-lg">
              Book Now
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
