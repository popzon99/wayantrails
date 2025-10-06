'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wifi, Tv, Coffee, Fan, AirVent, Utensils, Flame, TreePine,
  Users, Shield, CarFront, Dumbbell, Waves, Sparkles, Home,
  ChefHat, GameController, BookOpen, Music, Bike, Baby, Briefcase,
  Heart, Activity, Building2, Tent, Camera, MapPin, Flower2,
  Lock, FileText, Clock, Snowflake, Sun, Moon, Star, Award,
  CheckCircle2, Info
} from 'lucide-react';

// Icon mapping for amenities
const iconMap: Record<string, React.ElementType> = {
  'wifi': Wifi,
  'tv': Tv,
  'coffee': Coffee,
  'fan': Fan,
  'ac': AirVent,
  'restaurant': Utensils,
  'campfire': Flame,
  'garden': TreePine,
  'parking': CarFront,
  'gym': Dumbbell,
  'swimming-pool': Waves,
  'spa': Sparkles,
  'room-service': Home,
  'cooking': ChefHat,
  'games': GameController,
  'library': BookOpen,
  'music': Music,
  'bicycle': Bike,
  'kids-club': Baby,
  'business': Briefcase,
  'yoga': Activity,
  'building': Building2,
  'camping': Tent,
  'tour': Camera,
  'hiking': MapPin,
  'flower': Flower2,
  'safe': Lock,
  'medical': Heart,
  'heater': Snowflake,
  'balcony': Sun,
  'night': Moon,
  'premium': Star,
  'award': Award,
};

export interface Amenity {
  id: number;
  name: string;
  icon: string;
  amenity_type: 'boolean' | 'count' | 'text' | 'list';
  is_premium: boolean;
  is_featured: boolean;
  value?: any;
  additional_info?: string;
}

export interface AmenitiesByCategoryProps {
  amenitiesByCategory: Record<string, Amenity[]>;
  layout?: 'grid' | 'list' | 'compact';
  showPremiumBadge?: boolean;
  animated?: boolean;
}

const categoryIcons: Record<string, React.ElementType> = {
  'Property Features': Building2,
  'Room Features': Home,
  'Services': Briefcase,
  'Dining': Utensils,
  'Activities': GameController,
  'Safety & Security': Shield,
  'Outdoor Areas': TreePine,
  'Entertainment': Music,
  'Kitchen & Dining': ChefHat,
  'Recreation': Dumbbell,
  'Wellness & Spa': Sparkles,
  'Business': Briefcase,
  'Family & Kids': Baby,
  'Outdoor Activities': Tent,
  'Transportation': CarFront,
};

export default function AmenitiesDisplay({
  amenitiesByCategory,
  layout = 'grid',
  showPremiumBadge = true,
  animated = true
}: AmenitiesByCategoryProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(Object.keys(amenitiesByCategory))
  );
  const [selectedAmenity, setSelectedAmenity] = useState<Amenity | null>(null);

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const getIcon = (iconName: string) => {
    const Icon = iconMap[iconName] || Info;
    return Icon;
  };

  const getCategoryIcon = (categoryName: string) => {
    const Icon = categoryIcons[categoryName] || Info;
    return Icon;
  };

  const renderAmenityValue = (amenity: Amenity) => {
    if (amenity.amenity_type === 'count' && amenity.value?.count) {
      return <span className="text-sm text-gray-600">({amenity.value.count})</span>;
    }
    if (amenity.amenity_type === 'text' && amenity.value?.text) {
      return <span className="text-sm text-gray-600">- {amenity.value.text}</span>;
    }
    if (amenity.amenity_type === 'list' && amenity.value?.items) {
      return (
        <div className="text-sm text-gray-600 ml-6">
          {amenity.value.items.map((item: string, idx: number) => (
            <div key={idx} className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
              {item}
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (Object.keys(amenitiesByCategory).length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <Info className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>No amenities information available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {Object.entries(amenitiesByCategory).map(([category, amenities]) => {
        const CategoryIcon = getCategoryIcon(category);
        const isExpanded = expandedCategories.has(category);
        const featuredAmenities = amenities.filter(a => a.is_featured);
        const premiumAmenities = amenities.filter(a => a.is_premium);

        return (
          <motion.div
            key={category}
            initial={animated ? "hidden" : false}
            animate={animated ? "visible" : false}
            variants={containerVariants}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* Category Header */}
            <button
              onClick={() => toggleCategory(category)}
              className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <CategoryIcon className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">{category}</h3>
                  <p className="text-sm text-gray-600">
                    {amenities.length} {amenities.length === 1 ? 'amenity' : 'amenities'}
                    {premiumAmenities.length > 0 && (
                      <span className="ml-2 text-amber-600">
                        • {premiumAmenities.length} premium
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </motion.div>
            </button>

            {/* Amenities List */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className={`p-6 ${
                    layout === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' :
                    layout === 'compact' ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3' :
                    'space-y-3'
                  }`}>
                    {amenities.map((amenity) => {
                      const Icon = getIcon(amenity.icon);
                      return (
                        <motion.div
                          key={amenity.id}
                          variants={itemVariants}
                          className={`group relative ${
                            layout === 'compact' ? 'p-3' : 'p-4'
                          } rounded-lg border border-gray-100 hover:border-green-300 hover:bg-green-50/50 transition-all cursor-pointer`}
                          onClick={() => setSelectedAmenity(amenity)}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`${
                              layout === 'compact' ? 'p-1.5' : 'p-2'
                            } rounded-lg bg-green-100 group-hover:bg-green-200 transition-colors flex-shrink-0`}>
                              <Icon className={`${
                                layout === 'compact' ? 'w-4 h-4' : 'w-5 h-5'
                              } text-green-600`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <h4 className={`${
                                  layout === 'compact' ? 'text-sm' : 'text-base'
                                } font-medium text-gray-900 group-hover:text-green-700 transition-colors`}>
                                  {amenity.name}
                                </h4>
                                {showPremiumBadge && amenity.is_premium && (
                                  <span className="flex-shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                                    <Star className="w-3 h-3" />
                                    Premium
                                  </span>
                                )}
                                {amenity.is_featured && (
                                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                                )}
                              </div>
                              {renderAmenityValue(amenity)}
                              {amenity.additional_info && layout !== 'compact' && (
                                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                  {amenity.additional_info}
                                </p>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}

      {/* Amenity Detail Modal */}
      <AnimatePresence>
        {selectedAmenity && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedAmenity(null)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-green-100 rounded-xl">
                  {React.createElement(getIcon(selectedAmenity.icon), {
                    className: 'w-8 h-8 text-green-600'
                  })}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {selectedAmenity.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    {selectedAmenity.is_premium && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                        <Star className="w-3 h-3" />
                        Premium Amenity
                      </span>
                    )}
                    {selectedAmenity.is_featured && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        <Award className="w-3 h-3" />
                        Featured
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {selectedAmenity.additional_info && (
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-gray-700">{selectedAmenity.additional_info}</p>
                </div>
              )}

              {renderAmenityValue(selectedAmenity)}

              <button
                onClick={() => setSelectedAmenity(null)}
                className="mt-6 w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
