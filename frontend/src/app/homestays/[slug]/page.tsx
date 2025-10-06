'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, Users, Coffee, Heart, Share2, Phone, Calendar, Check, ChevronLeft, ChevronRight, Shield, User, MessageCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

// Mock homestay data
const homestayData = {
  id: 1,
  name: 'Tribal Heritage Home',
  slug: 'tribal-heritage-home',
  location: 'Mananthavady, Wayanad',
  host: 'Bomman Gowda',
  hostSince: '2018',
  hostLanguages: ['Malayalam', 'English', 'Hindi'],
  guests: 8,
  bedrooms: 3,
  bathrooms: 2,
  rating: 4.9,
  reviewCount: 156,
  pricePerNight: 2200,
  description: 'Experience authentic tribal culture in our traditional heritage home. Stay with a local Adivasi family and immerse yourself in the indigenous way of life.',
  longDescription: 'Our homestay offers a unique opportunity to experience the rich cultural heritage of Wayanad\'s tribal communities. Built using traditional methods with natural materials, our home sits on the edge of a pristine forest. Wake up to birdsong, enjoy organic meals cooked with ingredients from our farm, and learn about traditional crafts and customs from our family.',
  images: [
    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
    'https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=800',
    'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800',
  ],
  features: [
    { name: 'Traditional Meals', description: 'Authentic tribal cuisine with organic ingredients' },
    { name: 'Cultural Experience', description: 'Learn about tribal customs and traditions' },
    { name: 'Organic Farm', description: 'Farm-to-table fresh vegetables and spices' },
    { name: 'Nature Walks', description: 'Guided forest walks with the host' },
    { name: 'Campfire Nights', description: 'Evening storytelling around the fire' },
    { name: 'Craft Workshop', description: 'Learn traditional bamboo and cane work' },
  ],
  amenities: [
    'Free Wi-Fi',
    'Free Parking',
    'Kitchen Access',
    'Hot Water',
    'Laundry Service',
    'First Aid Kit',
  ],
  houseRules: [
    { rule: 'No smoking inside', allowed: false },
    { rule: 'Pets welcome', allowed: true },
    { rule: 'Events allowed', allowed: false },
    { rule: 'Children welcome', allowed: true },
  ],
  reviews: [
    { id: 1, name: 'Sarah Johnson', rating: 5, date: '1 week ago', comment: 'Incredible authentic experience! Bomman and his family were so welcoming. The food was absolutely delicious and learning about tribal traditions was fascinating.', avatar: 'SJ' },
    { id: 2, name: 'Vikram Reddy', rating: 5, date: '3 weeks ago', comment: 'Best homestay experience in Wayanad. The location is perfect, surrounded by nature. The host family made us feel like part of their family.', avatar: 'VR' },
    { id: 3, name: 'Maya Patel', rating: 4, date: '1 month ago', comment: 'Wonderful stay with genuine hospitality. The traditional meals were a highlight. A truly immersive cultural experience.', avatar: 'MP' },
  ],
  hostInfo: {
    bio: 'I am Bomman Gowda, a member of the Paniya tribal community. I have been sharing our traditional way of life with guests since 2018. My family and I are passionate about preserving our heritage and welcoming travelers who want to experience authentic tribal culture.',
    responseRate: '98%',
    responseTime: 'Within an hour',
    superhost: true,
  },
  nearbyActivities: [
    'Trekking to Thirunelli Temple - 6 km',
    'Visit to tribal museum - 4 km',
    'Bamboo rafting - 8 km',
    'Spice plantation tour - 3 km',
  ],
};

export default function HomestayDetailPage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % homestayData.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + homestayData.images.length) % homestayData.images.length);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Image Gallery */}
      <section className="relative h-[600px] mt-20 overflow-hidden bg-gray-900">
        <motion.img
          key={currentImageIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          src={homestayData.images[currentImageIndex]}
          alt={homestayData.name}
          className="w-full h-full object-cover"
        />

        {/* Gallery Navigation */}
        <button
          onClick={prevImage}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg"
        >
          <ChevronLeft className="w-6 h-6 text-gray-900" />
        </button>
        <button
          onClick={nextImage}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg"
        >
          <ChevronRight className="w-6 h-6 text-gray-900" />
        </button>

        {/* Image Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {homestayData.images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentImageIndex ? 'bg-white w-8' : 'bg-white/50'
              }`}
            />
          ))}
        </div>

        {/* Action Buttons */}
        <div className="absolute top-6 right-6 flex gap-3">
          <button className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg">
            <Share2 className="w-5 h-5 text-gray-900" />
          </button>
          <button className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg">
            <Heart className="w-5 h-5 text-gray-900" />
          </button>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center gap-1">
                  <Shield className="w-5 h-5 text-teal-600" />
                  <span className="text-sm font-semibold text-teal-600">Verified Homestay</span>
                </div>
                {homestayData.hostInfo.superhost && (
                  <span className="px-3 py-1 bg-gradient-to-r from-orange-400 to-red-400 text-white rounded-full text-sm font-semibold">
                    ⭐ Superhost
                  </span>
                )}
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-3">{homestayData.name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-gray-600">
                <div className="flex items-center gap-1">
                  <MapPin className="w-5 h-5" />
                  <span>{homestayData.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="font-semibold">{homestayData.rating}</span>
                  <span>({homestayData.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-5 h-5" />
                  <span>Up to {homestayData.guests} guests</span>
                </div>
              </div>
            </div>

            {/* Host Information */}
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {homestayData.host.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">Hosted by {homestayData.host}</h3>
                  <p className="text-gray-600">Hosting since {homestayData.hostSince}</p>
                  <div className="flex items-center gap-2 mt-2">
                    {homestayData.hostLanguages.map((lang, i) => (
                      <span key={i} className="px-3 py-1 bg-white rounded-full text-sm text-gray-700">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">{homestayData.hostInfo.bio}</p>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-teal-200">
                <div>
                  <p className="text-sm text-gray-600">Response rate</p>
                  <p className="text-lg font-bold text-gray-900">{homestayData.hostInfo.responseRate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Response time</p>
                  <p className="text-lg font-bold text-gray-900">{homestayData.hostInfo.responseTime}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Homestay</h2>
              <p className="text-gray-600 leading-relaxed mb-4">{homestayData.description}</p>
              <p className="text-gray-600 leading-relaxed">{homestayData.longDescription}</p>
            </div>

            {/* Property Details */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Property Details</h2>
              <div className="grid sm:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <Users className="w-8 h-8 text-teal-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{homestayData.guests}</p>
                  <p className="text-sm text-gray-600">Guests</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <Coffee className="w-8 h-8 text-teal-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{homestayData.bedrooms}</p>
                  <p className="text-sm text-gray-600">Bedrooms</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <Shield className="w-8 h-8 text-teal-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{homestayData.bathrooms}</p>
                  <p className="text-sm text-gray-600">Bathrooms</p>
                </div>
              </div>
            </div>

            {/* Special Features */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">What Makes This Stay Special</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {homestayData.features.map((feature, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-xl hover:border-teal-300 transition-colors">
                    <h4 className="font-bold text-gray-900 mb-2">{feature.name}</h4>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Amenities</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {homestayData.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-teal-600" />
                    <span className="text-gray-700">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* House Rules */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">House Rules</h2>
              <div className="space-y-3">
                {homestayData.houseRules.map((rule, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-900">{rule.rule}</span>
                    {rule.allowed ? (
                      <Check className="w-5 h-5 text-teal-600" />
                    ) : (
                      <span className="text-red-600 font-semibold">Not allowed</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Guest Reviews</h2>
              <div className="space-y-6">
                {homestayData.reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                        {review.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="font-bold text-gray-900">{review.name}</h4>
                            <p className="text-sm text-gray-500">{review.date}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: review.rating }).map((_, i) => (
                              <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-600 leading-relaxed">{review.comment}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Nearby Activities */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Things to Do Nearby</h2>
              <div className="space-y-3">
                {homestayData.nearbyActivities.map((activity, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                    <span className="text-gray-700">{activity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-lg sticky top-24">
              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl font-bold text-gray-900">₹{homestayData.pricePerNight.toLocaleString()}</span>
                  <span className="text-gray-600">/ night</span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="font-semibold">{homestayData.rating}</span>
                  <span className="text-gray-600">({homestayData.reviewCount} reviews)</span>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Check-in</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Check-out</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Guests</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
                      <option>1 Guest</option>
                      <option>2 Guests</option>
                      <option>3 Guests</option>
                      <option>4 Guests</option>
                      <option>5+ Guests</option>
                    </select>
                  </div>
                </div>
              </div>

              <button className="w-full py-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all mb-4">
                Request to Book
              </button>

              <div className="text-center text-sm text-gray-500 mb-4">
                Host will confirm your request
              </div>

              <div className="space-y-2 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-gray-600">
                  <span>₹{homestayData.pricePerNight.toLocaleString()} × 2 nights</span>
                  <span>₹{(homestayData.pricePerNight * 2).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Service fee</span>
                  <span>₹500</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span>₹{(homestayData.pricePerNight * 2 + 500).toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-5 h-5 text-teal-600" />
                  <span className="font-semibold text-gray-900">Have questions?</span>
                </div>
                <button className="w-full py-3 border-2 border-teal-500 text-teal-600 rounded-xl font-semibold hover:bg-teal-50 transition-all">
                  Message Host
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
