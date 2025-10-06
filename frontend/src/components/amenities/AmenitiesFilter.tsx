'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Filter, X, Search, Star, Check, ChevronDown, SlidersHorizontal
} from 'lucide-react';

export interface AmenityFilterOption {
  id: number;
  name: string;
  category: string;
  category_display: string;
  is_premium: boolean;
  icon: string;
}

export interface AmenitiesFilterProps {
  amenities: AmenityFilterOption[];
  selectedAmenities: number[];
  onFilterChange: (selected: number[]) => void;
  showPremiumFilter?: boolean;
  showCategoryFilter?: boolean;
}

export default function AmenitiesFilter({
  amenities,
  selectedAmenities,
  onFilterChange,
  showPremiumFilter = true,
  showCategoryFilter = true
}: AmenitiesFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [premiumOnly, setPremiumOnly] = useState(false);
  const [localSelected, setLocalSelected] = useState<number[]>(selectedAmenities);

  // Get unique categories
  const categories = Array.from(new Set(amenities.map(a => a.category_display)));

  // Filter amenities based on search, category, and premium
  const filteredAmenities = amenities.filter(amenity => {
    const matchesSearch = amenity.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(amenity.category_display);
    const matchesPremium = !premiumOnly || amenity.is_premium;
    return matchesSearch && matchesCategory && matchesPremium;
  });

  // Group by category
  const amenitiesByCategory = filteredAmenities.reduce((acc, amenity) => {
    if (!acc[amenity.category_display]) {
      acc[amenity.category_display] = [];
    }
    acc[amenity.category_display].push(amenity);
    return acc;
  }, {} as Record<string, AmenityFilterOption[]>);

  const toggleAmenity = (id: number) => {
    const newSelected = localSelected.includes(id)
      ? localSelected.filter(a => a !== id)
      : [...localSelected, id];
    setLocalSelected(newSelected);
  };

  const toggleCategory = (category: string) => {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category];
    setSelectedCategories(newCategories);
  };

  const applyFilters = () => {
    onFilterChange(localSelected);
    setIsOpen(false);
  };

  const clearFilters = () => {
    setLocalSelected([]);
    setSelectedCategories([]);
    setPremiumOnly(false);
    setSearchTerm('');
    onFilterChange([]);
  };

  const selectedCount = localSelected.length;

  return (
    <div className="relative">
      {/* Filter Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
      >
        <SlidersHorizontal className="w-4 h-4" />
        <span className="font-medium">Filter Amenities</span>
        {selectedCount > 0 && (
          <span className="px-2 py-0.5 bg-green-600 text-white text-xs font-medium rounded-full">
            {selectedCount}
          </span>
        )}
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Filter Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 lg:right-auto mt-2 w-full lg:w-[600px] bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-[80vh] overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Filter className="w-5 h-5 text-green-600" />
                    Filter Amenities
                  </h3>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 hover:bg-white rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search amenities..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Quick Filters */}
              <div className="p-4 border-b border-gray-200 space-y-3">
                {showPremiumFilter && (
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={premiumOnly}
                      onChange={(e) => setPremiumOnly(e.target.checked)}
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <Star className="w-4 h-4 text-amber-500" />
                    <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                      Premium Amenities Only
                    </span>
                  </label>
                )}

                {showCategoryFilter && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Categories:</p>
                    <div className="flex flex-wrap gap-2">
                      {categories.map(category => (
                        <button
                          key={category}
                          onClick={() => toggleCategory(category)}
                          className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                            selectedCategories.includes(category)
                              ? 'bg-green-600 text-white border-green-600'
                              : 'bg-white text-gray-700 border-gray-300 hover:border-green-400'
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Amenities List */}
              <div className="flex-1 overflow-y-auto p-4">
                {Object.keys(amenitiesByCategory).length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Filter className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>No amenities match your filters</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {Object.entries(amenitiesByCategory).map(([category, categoryAmenities]) => (
                      <div key={category}>
                        <h4 className="text-sm font-semibold text-gray-900 mb-2 sticky top-0 bg-white py-1">
                          {category}
                        </h4>
                        <div className="space-y-2">
                          {categoryAmenities.map(amenity => (
                            <label
                              key={amenity.id}
                              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer group"
                            >
                              <input
                                type="checkbox"
                                checked={localSelected.includes(amenity.id)}
                                onChange={() => toggleAmenity(amenity.id)}
                                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                              />
                              <span className="flex-1 text-sm text-gray-700 group-hover:text-gray-900">
                                {amenity.name}
                              </span>
                              {amenity.is_premium && (
                                <Star className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                              )}
                              {localSelected.includes(amenity.id) && (
                                <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                              )}
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-gray-200 bg-gray-50 flex gap-3">
                <button
                  onClick={clearFilters}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Clear All
                </button>
                <button
                  onClick={applyFilters}
                  className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors shadow-sm"
                >
                  Apply Filters {selectedCount > 0 && `(${selectedCount})`}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
