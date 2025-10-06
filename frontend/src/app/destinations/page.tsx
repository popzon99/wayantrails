'use client';

import { motion } from 'framer-motion';
import { Mountain, MapPin, Star, Clock, Users, Compass } from 'lucide-react';
import Navbar from '@/components/Navbar';

const destinations = [
  { id: 1, name: 'Chembra Peak Trek', category: 'Adventure', price: '1200', duration: '6-7 hours', difficulty: 'Moderate', image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800', description: 'Heart-shaped lake and stunning valley views' },
  { id: 2, name: 'Edakkal Caves', category: 'Historical', price: '800', duration: '3-4 hours', difficulty: 'Easy', image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800', description: 'Ancient rock art and prehistoric carvings' },
  { id: 3, name: 'Soochipara Waterfalls', category: 'Nature', price: '500', duration: '2-3 hours', difficulty: 'Easy', image: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=800', description: 'Three-tier waterfall with swimming pool' },
  { id: 4, name: 'Banasura Sagar Dam', category: 'Sightseeing', price: '600', duration: '2 hours', difficulty: 'Easy', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', description: 'Largest earthen dam in India' },
  { id: 5, name: 'Thirunelli Temple', category: 'Spiritual', price: '400', duration: '2 hours', difficulty: 'Easy', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800', description: 'Ancient temple in Brahmagiri mountains' },
  { id: 6, name: 'Pookode Lake', category: 'Nature', price: '500', duration: '1-2 hours', difficulty: 'Easy', image: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800', description: 'Freshwater lake with boating' },
  { id: 7, name: 'Meenmutty Waterfalls', category: 'Adventure', price: '900', duration: '4-5 hours', difficulty: 'Moderate', image: 'https://images.unsplash.com/photo-1509773896068-7fd415d91e2e?w=800', description: 'Largest waterfall in Wayanad' },
  { id: 8, name: 'Kuruva Island', category: 'Nature', price: '700', duration: '3 hours', difficulty: 'Easy', image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800', description: 'Uninhabited island with rare flora' },
  { id: 9, name: 'Tholpetty Wildlife Sanctuary', category: 'Wildlife', price: '1500', duration: '4 hours', difficulty: 'Easy', image: 'https://images.unsplash.com/photo-1549366021-9f761d450615?w=800', description: 'Safari with elephants and deer' },
];

export default function DestinationsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Header */}
      <section className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 py-20 px-6 mt-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center text-white"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Explore Wayanad</h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
              Discover breathtaking attractions, adventures, and natural wonders
            </p>
          </motion.div>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {destinations.map((destination, index) => (
              <motion.div
                key={destination.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-indigo-500 text-white px-4 py-2 rounded-full">
                    <span className="text-sm font-bold">{destination.category}</span>
                  </div>
                  <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full">
                    <span className="text-sm font-bold text-indigo-600">{destination.difficulty}</span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{destination.name}</h3>
                  <p className="text-gray-600 mb-4">{destination.description}</p>

                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {destination.duration}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <p className="text-sm text-gray-500">Starting from</p>
                      <p className="text-3xl font-bold text-indigo-600">₹{destination.price}</p>
                    </div>
                    <button className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all">
                      Book Tour
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
