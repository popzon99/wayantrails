'use client';

import { motion } from 'framer-motion';
import { Car as Taxi, Camera, Map, Users, Phone, Star, MapPin, Shield } from 'lucide-react';
import Navbar from '@/components/Navbar';

const services = [
  { id: 1, name: 'Wayanad Taxi Services', type: 'Taxi', rating: 4.8, phone: '+91 98765 43210', image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800', description: 'Reliable 24/7 taxi service across Wayanad', features: ['Airport pickup', 'Local sightseeing', 'Inter-district travel'] },
  { id: 2, name: 'Mountain Trail Guides', type: 'Guide', rating: 4.9, phone: '+91 98765 43211', image: 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=800', description: 'Expert local guides for trekking and tours', features: ['Trek guidance', 'Local knowledge', 'Safety equipment'] },
  { id: 3, name: 'Wildlife Photography Tours', type: 'Photographer', rating: 4.7, phone: '+91 98765 43212', image: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800', description: 'Professional photography services for your trip', features: ['Wildlife shoots', 'Candid photos', 'Drone coverage'] },
  { id: 4, name: 'Spice Garden Tours', type: 'Tour Operator', rating: 4.6, phone: '+91 98765 43213', image: 'https://images.unsplash.com/photo-1587894380167-b22a93ece988?w=800', description: 'Guided tours of coffee and spice plantations', features: ['Plantation visit', 'Spice tasting', 'Organic products'] },
  { id: 5, name: 'Adventure Sports Wayanad', type: 'Activity', rating: 4.8, phone: '+91 98765 43214', image: 'https://images.unsplash.com/photo-1476610182048-b716b8518aae?w=800', description: 'Ziplining, rock climbing, and adventure activities', features: ['Zipline', 'Rock climbing', 'Rappelling'] },
  { id: 6, name: 'Ayurvedic Spa & Wellness', type: 'Wellness', rating: 4.9, phone: '+91 98765 43215', image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800', description: 'Authentic Kerala Ayurvedic treatments', features: ['Massage therapy', 'Wellness packages', 'Herbal treatments'] },
  { id: 7, name: 'Wayanad Food Tours', type: 'Food', rating: 4.7, phone: '+91 98765 43216', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800', description: 'Explore authentic Kerala cuisine and local eateries', features: ['Local cuisine', 'Street food', 'Cooking classes'] },
  { id: 8, name: 'Camping & Bonfire Nights', type: 'Camping', rating: 4.6, phone: '+91 98765 43217', image: 'https://images.unsplash.com/photo-1504851149312-7a075b496cc7?w=800', description: 'Organized camping with bonfires and activities', features: ['Tent camping', 'Bonfire setup', 'Night activities'] },
  { id: 9, name: 'Bicycle Rental & Tours', type: 'Rental', rating: 4.5, phone: '+91 98765 43218', image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800', description: 'Explore Wayanad on eco-friendly bicycles', features: ['Mountain bikes', 'Guided tours', 'Cycling gear'] },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Header */}
      <section className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 py-20 px-6 mt-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center text-white"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Local Services in Wayanad</h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
              Connect with trusted local service providers for a seamless travel experience
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full">
                    <span className="text-sm font-bold text-purple-600">{service.type}</span>
                  </div>
                  <div className="absolute top-4 left-4 bg-purple-500 text-white px-3 py-1 rounded-full flex items-center">
                    <Shield className="w-4 h-4 mr-1" />
                    <span className="text-sm font-bold">Verified</span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{service.name}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>

                  <div className="flex items-center mb-4">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="ml-2 font-semibold text-gray-700">{service.rating}</span>
                  </div>

                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-gray-600 text-sm">
                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center gap-3 pt-4 border-t">
                    <a
                      href={`tel:${service.phone}`}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center"
                    >
                      <Phone className="w-5 h-5 mr-2" />
                      Call Now
                    </a>
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
