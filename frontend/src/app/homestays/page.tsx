'use client';

import { motion } from 'framer-motion';
import { Home as HomeIcon, Star, MapPin, Users, Coffee, Utensils, Shield } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

const homestays = [
  { id: 1, name: 'Tribal Heritage Home', location: 'Mananthavady', host: 'Bomman Gowda', price: '2200', guests: 8, rating: 4.9, image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800', features: ['Traditional meals', 'Tribal culture', 'Organic farm'] },
  { id: 2, name: 'Tranquil Farmstay', location: 'Vythiri', host: 'Rajesh Kumar', price: '3000', guests: 6, rating: 4.8, image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800', features: ['Coffee plantation', 'Home-cooked food', 'Nature walks'] },
  { id: 3, name: 'Green Valley Homestay', location: 'Kalpetta', host: 'Suma Devi', price: '1800', guests: 4, rating: 4.7, image: 'https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=800', features: ['Valley view', 'Kerala cuisine', 'Campfire nights'] },
  { id: 4, name: 'Spice Garden Retreat', location: 'Meppadi', host: 'Thomas Joseph', price: '2500', guests: 5, rating: 4.8, image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800', features: ['Spice tour', 'Ayurvedic herbs', 'Cooking classes'] },
  { id: 5, name: 'Misty Mountain Home', location: 'Lakkidi', host: 'Priya Menon', price: '2800', guests: 6, rating: 4.9, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', features: ['Mountain views', 'Bonfire setup', 'Bird watching'] },
  { id: 6, name: 'River View Cottage', location: 'Pulpally', host: 'Vineeth Das', price: '2000', guests: 4, rating: 4.6, image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800', features: ['River access', 'Fishing', 'Traditional architecture'] },
  { id: 7, name: 'Coffee Estate Stay', location: 'Vythiri', host: 'Lakshmi Amma', price: '3200', guests: 8, rating: 4.9, image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800', features: ['Coffee tasting', 'Estate tour', 'Homemade pickles'] },
  { id: 8, name: 'Bamboo Grove Homestay', location: 'Meenangadi', host: 'Ravi Varma', price: '1600', guests: 3, rating: 4.5, image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800', features: ['Eco-friendly', 'Bamboo crafts', 'Organic garden'] },
  { id: 9, name: 'Sunset Hills Home', location: 'Sulthan Bathery', host: 'Maya George', price: '2400', guests: 5, rating: 4.7, image: 'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=800', features: ['Sunset views', 'Local cuisine', 'Cultural programs'] },
];

export default function HomestaysPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Header */}
      <section className="bg-gradient-to-br from-teal-600 via-cyan-600 to-blue-600 py-20 px-6 mt-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center text-white"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Authentic Homestays in Wayanad</h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
              Experience Kerala's warmth with verified local families and traditional hospitality
            </p>
          </motion.div>
        </div>
      </section>

      {/* Homestays Grid */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {homestays.map((homestay, index) => (
              <motion.div
                key={homestay.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={homestay.image}
                    alt={homestay.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-teal-500 text-white px-3 py-1 rounded-full flex items-center">
                    <Shield className="w-4 h-4 mr-1" />
                    <span className="text-sm font-bold">Verified</span>
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center">
                    <Users className="w-4 h-4 mr-1 text-teal-600" />
                    <span className="text-sm font-bold text-teal-600">{homestay.guests} guests</span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{homestay.name}</h3>

                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm">{homestay.location}</span>
                  </div>

                  <div className="flex items-center mb-4">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="ml-2 font-semibold text-gray-700">{homestay.rating}</span>
                    <span className="ml-2 text-sm text-gray-500">• Host: {homestay.host}</span>
                  </div>

                  <ul className="space-y-2 mb-6">
                    {homestay.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-gray-600 text-sm">
                        <Coffee className="w-4 h-4 text-teal-500 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <p className="text-sm text-gray-500">Per night</p>
                      <p className="text-3xl font-bold text-teal-600">₹{homestay.price}</p>
                    </div>
                    <Link href={`/homestays/${homestay.name.toLowerCase().replace(/\s+/g, '-')}`}>
                      <button className="px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all">
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
