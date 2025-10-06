'use client';

import { motion } from 'framer-motion';
import { Car, Bike, Shield, Star, Calendar, MapPin } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

const rentals = [
  { id: 1, name: 'Royal Enfield Classic 350', type: 'Bike', price: '800', rating: 4.8, image: 'https://images.unsplash.com/photo-1558981852-426c6c22a060?w=800', features: ['Helmet included', 'Fuel efficient', '24/7 support'] },
  { id: 2, name: 'Honda Activa 6G', type: 'Scooter', price: '500', rating: 4.6, image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800', features: ['Easy to ride', 'Perfect for hills', 'Low maintenance'] },
  { id: 3, name: 'Maruti Swift Dzire', type: 'Car', price: '2500', rating: 4.9, image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800', features: ['AC', '4+1 seater', 'GPS included'] },
  { id: 4, name: 'Yamaha FZ-S', type: 'Bike', price: '900', rating: 4.7, image: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800', features: ['Sporty design', 'Quick acceleration', 'Bluetooth helmet'] },
  { id: 5, name: 'Honda City', type: 'Car', price: '3000', rating: 4.8, image: 'https://images.unsplash.com/photo-1583267746897-bc321926e3b3?w=800', features: ['Luxury sedan', 'Spacious', 'Premium interiors'] },
  { id: 6, name: 'TVS Jupiter', type: 'Scooter', price: '450', rating: 4.5, image: 'https://images.unsplash.com/photo-1613238821032-e8b95736ba3c?w=800', features: ['Comfortable seat', 'Large storage', 'Economical'] },
];

export default function RentalsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Header */}
      <section className="bg-gradient-to-br from-cyan-600 via-blue-600 to-indigo-600 py-20 px-6 mt-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center text-white"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Vehicle Rentals in Wayanad</h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
              Explore Wayanad at your own pace with our reliable bikes, scooters, and cars
            </p>
          </motion.div>
        </div>
      </section>

      {/* Rentals Grid */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rentals.map((rental, index) => (
              <motion.div
                key={rental.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={rental.image}
                    alt={rental.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full">
                    <span className="text-sm font-bold text-cyan-600">{rental.type}</span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{rental.name}</h3>

                  <div className="flex items-center mb-4">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="ml-2 font-semibold text-gray-700">{rental.rating}</span>
                  </div>

                  <ul className="space-y-2 mb-6">
                    {rental.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-gray-600">
                        <Shield className="w-4 h-4 text-cyan-500 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <p className="text-sm text-gray-500">Per day</p>
                      <p className="text-3xl font-bold text-cyan-600">₹{rental.price}</p>
                    </div>
                    <button className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all">
                      Book Now
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
