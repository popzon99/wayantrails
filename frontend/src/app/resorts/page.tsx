'use client';

import { motion } from 'framer-motion';
import { Building2, Star, MapPin, Wifi, Coffee, Waves, Shield } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

const resorts = [
  { id: 1, name: 'Vythiri Village Resort', location: 'Vythiri', type: 'Luxury', price: '12000', rating: 4.9, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', features: ['Pool', 'Spa', 'Treehouse', 'Wildlife'] },
  { id: 2, name: 'AfterTheRains Resort', location: 'Lakkidi', type: 'Eco', price: '8500', rating: 4.8, image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800', features: ['Mountain view', 'Organic food', 'Yoga', 'Trekking'] },
  { id: 3, name: 'Wayanad Silverwoods', location: 'Kalpetta', type: 'Boutique', price: '10000', rating: 4.7, image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800', features: ['Coffee estate', 'Pool', 'Restaurant', 'Bonfire'] },
  { id: 4, name: 'The Windflower Resort', location: 'Vythiri', type: 'Luxury', price: '15000', rating: 4.9, image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800', features: ['Infinity pool', 'Fine dining', 'Spa', 'Valley view'] },
  { id: 5, name: 'Sterling Wayanad', location: 'Meppadi', type: 'Family', price: '7000', rating: 4.6, image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800', features: ['Kids play area', 'Family rooms', 'Activities', 'Restaurant'] },
  { id: 6, name: 'Jungle Resort', location: 'Mananthavady', type: 'Adventure', price: '6500', rating: 4.5, image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800', features: ['Bamboo cottages', 'Campfire', 'Nature trails', 'Bird watching'] },
  { id: 7, name: 'Tranquil Plantation', location: 'Meppadi', type: 'Eco', price: '9000', rating: 4.8, image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800', features: ['Plantation walks', 'Organic meals', 'Stream view', 'Privacy'] },
  { id: 8, name: 'Mountain Mist Resort', location: 'Vythiri', type: 'Boutique', price: '11000', rating: 4.7, image: 'https://images.unsplash.com/photo-1563911302283-d2bc129e7570?w=800', features: ['Mist views', 'Ayurvedic spa', 'Pool', 'Private balcony'] },
  { id: 9, name: 'Banasura Hill Resort', location: 'Kalpetta', type: 'Luxury', price: '13500', rating: 4.9, image: 'https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=800', features: ['Earth homes', 'Dam view', 'Infinity pool', 'Spa'] },
];

export default function ResortsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Header */}
      <section className="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 py-20 px-6 mt-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center text-white"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Luxury Resorts in Wayanad</h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
              Experience premium hospitality amidst the lush hills of Wayanad
            </p>
          </motion.div>
        </div>
      </section>

      {/* Resorts Grid */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {resorts.map((resort, index) => (
              <motion.div
                key={resort.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={resort.image}
                    alt={resort.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-emerald-500 text-white px-4 py-2 rounded-full">
                    <span className="text-sm font-bold">{resort.type}</span>
                  </div>
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center">
                    <Shield className="w-4 h-4 mr-1 text-emerald-600" />
                    <span className="text-sm font-bold text-emerald-600">Verified</span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{resort.name}</h3>

                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm">{resort.location}</span>
                  </div>

                  <div className="flex items-center mb-4">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="ml-2 font-semibold text-gray-700">{resort.rating}</span>
                  </div>

                  <ul className="space-y-2 mb-6">
                    {resort.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-gray-600 text-sm">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <p className="text-sm text-gray-500">Per night</p>
                      <p className="text-3xl font-bold text-emerald-600">₹{resort.price}</p>
                    </div>
                    <Link href={`/resorts/${resort.name.toLowerCase().replace(/\s+/g, '-')}`}>
                      <button className="px-6 py-3 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all">
                        View Details
                      </button>
                    </Link>
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
