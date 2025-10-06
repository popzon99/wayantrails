'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MapPin, Wifi, Coffee, Waves, Car, Shield, Heart, Share2, Phone, Calendar, Users, Check, X, ChevronLeft, ChevronRight, Plus, Minus, AlertCircle, Sparkles, TrendingDown } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

// Mock resort data
const resortData = {
  id: 1,
  name: 'Vythiri Village Resort',
  slug: 'vythiri-village-resort',
  location: 'Vythiri, Wayanad',
  type: 'Luxury',
  rating: 4.9,
  reviewCount: 248,
  pricePerNight: 12000,
  description: 'Nestled in the heart of Wayanad, Vythiri Village Resort offers an unparalleled luxury experience surrounded by lush rainforests and exotic wildlife.',
  longDescription: 'Spread across 150 acres of pristine rainforest, Vythiri Village Resort is a sanctuary for those seeking tranquility and luxury. Wake up to the symphony of exotic birds, spot wildlife from your private balcony, and indulge in world-class amenities.',
  images: [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
    'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800',
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
  ],
  amenities: [
    { name: 'Infinity Pool', icon: Waves, available: true },
    { name: 'Free Wi-Fi', icon: Wifi, available: true },
    { name: 'Restaurant', icon: Coffee, available: true },
    { name: 'Parking', icon: Car, available: true },
    { name: 'Spa & Wellness', icon: Shield, available: true },
    { name: '24/7 Room Service', icon: Phone, available: true },
  ],
  roomTypes: [
    { name: 'Treehouse Villa', price: 15000, capacity: 2, features: ['Valley View', 'Private Balcony', 'King Bed'], availability: 'available', roomsLeft: 3 },
    { name: 'Forest Cottage', price: 12000, capacity: 3, features: ['Garden View', 'Sitting Area', 'Queen Bed'], availability: 'limited', roomsLeft: 1 },
    { name: 'Luxury Suite', price: 18000, capacity: 4, features: ['Panoramic View', 'Living Room', '2 Bedrooms'], availability: 'available', roomsLeft: 5 },
  ],
  reviews: [
    { id: 1, name: 'Priya Sharma', rating: 5, date: '2 weeks ago', comment: 'Absolutely stunning! The treehouse was magical and the staff was incredibly hospitable.', avatar: 'PS' },
    { id: 2, name: 'Raj Kumar', rating: 5, date: '1 month ago', comment: 'Perfect blend of luxury and nature. The food was exceptional!', avatar: 'RK' },
    { id: 3, name: 'Anita Menon', rating: 4, date: '2 months ago', comment: 'Beautiful property with great amenities.', avatar: 'AM' },
  ],
  policies: [
    { type: 'Check-in', detail: '2:00 PM onwards' },
    { type: 'Check-out', detail: '11:00 AM' },
    { type: 'Cancellation', detail: 'Free cancellation up to 48 hours before check-in' },
    { type: 'Children', detail: 'Children of all ages welcome' },
  ],
  nearbyAttractions: [
    { name: 'Chembra Peak', distance: '8 km' },
    { name: 'Pookode Lake', distance: '5 km' },
    { name: 'Edakkal Caves', distance: '12 km' },
  ],
};

// Similar properties
const similarProperties = [
  { name: 'AfterTheRains Resort', price: 8500, rating: 4.8, image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400' },
  { name: 'Wayanad Silverwoods', price: 10000, rating: 4.7, image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400' },
];

export default function ResortDetailPage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedRoomType, setSelectedRoomType] = useState(0);
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [guestCount, setGuestCount] = useState(2);
  const [numberOfNights, setNumberOfNights] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);

  const selectedRoom = resortData.roomTypes[selectedRoomType];
  const serviceFee = 2000;
  const taxRate = 0.12; // 12% GST

  // Calculate number of nights
  useEffect(() => {
    if (checkInDate && checkOutDate) {
      const checkIn = new Date(checkInDate);
      const checkOut = new Date(checkOutDate);
      const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
      setNumberOfNights(nights > 0 ? nights : 0);
    } else {
      setNumberOfNights(0);
    }
  }, [checkInDate, checkOutDate]);

  // Calculate pricing with discounts
  useEffect(() => {
    if (numberOfNights > 0) {
      const basePrice = selectedRoom.price * numberOfNights;

      // Apply discounts based on stay duration
      let discountPercent = 0;
      if (numberOfNights >= 7) {
        discountPercent = 15;
      } else if (numberOfNights >= 5) {
        discountPercent = 10;
      } else if (numberOfNights >= 3) {
        discountPercent = 5;
      }

      const discountAmount = (basePrice * discountPercent) / 100;
      const subtotal = basePrice - discountAmount;
      const tax = subtotal * taxRate;
      const total = subtotal + serviceFee + tax;

      setDiscount(discountAmount);
      setTotalPrice(total);
    } else {
      setDiscount(0);
      setTotalPrice(0);
    }
  }, [numberOfNights, selectedRoomType, selectedRoom.price]);

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % resortData.images.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + resortData.images.length) % resortData.images.length);

  const getDiscountMessage = () => {
    if (numberOfNights >= 7) return { message: '15% off for 7+ nights!', color: 'bg-green-500' };
    if (numberOfNights >= 5) return { message: '10% off for 5+ nights!', color: 'bg-emerald-500' };
    if (numberOfNights >= 3) return { message: '5% off for 3+ nights', color: 'bg-teal-500' };
    if (numberOfNights === 2) return { message: 'Stay 3+ nights for discount', color: 'bg-gray-500' };
    return null;
  };

  const getAvailabilityBadge = (availability: string, roomsLeft: number) => {
    if (availability === 'available') {
      return { text: 'Available', color: 'bg-green-100 text-green-700 border-green-300' };
    } else if (availability === 'limited') {
      return { text: `Only ${roomsLeft} left!`, color: 'bg-orange-100 text-orange-700 border-orange-300' };
    }
    return { text: 'Sold Out', color: 'bg-red-100 text-red-700 border-red-300' };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Image Gallery */}
      <section className="relative h-[400px] sm:h-[500px] lg:h-[600px] mt-20 overflow-hidden bg-gray-900">
        <motion.img
          key={currentImageIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          src={resortData.images[currentImageIndex]}
          alt={resortData.name}
          className="w-full h-full object-cover"
        />

        <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg">
          <ChevronLeft className="w-6 h-6 text-gray-900" />
        </button>
        <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg">
          <ChevronRight className="w-6 h-6 text-gray-900" />
        </button>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {resortData.images.map((_, index) => (
            <button key={index} onClick={() => setCurrentImageIndex(index)} className={`w-2 h-2 rounded-full transition-all ${index === currentImageIndex ? 'bg-white w-8' : 'bg-white/50'}`} />
          ))}
        </div>

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            {/* Header */}
            <div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
                <span className="px-3 sm:px-4 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs sm:text-sm font-semibold">{resortData.type}</span>
                <div className="flex items-center gap-1">
                  <Shield className="w-4 sm:w-5 h-4 sm:h-5 text-emerald-600" />
                  <span className="text-xs sm:text-sm font-semibold text-emerald-600">Verified</span>
                </div>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">{resortData.name}</h1>
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm sm:text-base text-gray-600">
                <div className="flex items-center gap-1">
                  <MapPin className="w-5 h-5" />
                  <span>{resortData.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="font-semibold">{resortData.rating}</span>
                  <span>({resortData.reviewCount} reviews)</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">About This Resort</h2>
              <p className="text-gray-600 leading-relaxed mb-4">{resortData.description}</p>
              <p className="text-gray-600 leading-relaxed">{resortData.longDescription}</p>
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Amenities & Facilities</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {resortData.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <amenity.icon className="w-5 h-5 text-emerald-600" />
                    </div>
                    <span className="font-medium text-gray-900">{amenity.name}</span>
                    <Check className="w-5 h-5 text-emerald-600 ml-auto" />
                  </div>
                ))}
              </div>
            </div>

            {/* Room Types with Real-Time Availability */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Room Types & Live Availability</h2>
              <div className="space-y-4">
                {resortData.roomTypes.map((room, index) => {
                  const badge = getAvailabilityBadge(room.availability, room.roomsLeft);
                  return (
                    <motion.div
                      key={index}
                      onClick={() => setSelectedRoomType(index)}
                      whileHover={{ scale: 1.01 }}
                      className={`p-4 sm:p-6 border-2 rounded-xl cursor-pointer transition-all relative ${
                        selectedRoomType === index ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:border-emerald-300'
                      }`}
                    >
                      {/* Availability Badge */}
                      <div className={`absolute top-3 right-3 sm:top-4 sm:right-4 px-2 sm:px-3 py-1 rounded-full text-xs font-bold border ${badge.color}`}>
                        {badge.text}
                      </div>

                      <div className="mb-3 pr-20 sm:pr-24">
                        <div className="mb-3">
                          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">{room.name}</h3>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Users className="w-4 h-4" />
                            <span className="text-sm">Up to {room.capacity} guests</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-xl sm:text-2xl font-bold text-emerald-600">₹{room.price.toLocaleString()}</p>
                          <p className="text-xs sm:text-sm text-gray-500">per night</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {room.features.map((feature, i) => (
                          <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Guest Reviews</h2>
              <div className="space-y-6">
                {resortData.reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white font-bold">
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

            {/* Similar Properties */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Similar Properties Nearby</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {similarProperties.map((property, index) => (
                  <Link key={index} href="/resorts" className="group">
                    <div className="border border-gray-200 rounded-xl overflow-hidden hover:border-emerald-300 transition-all">
                      <img src={property.image} alt={property.name} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
                      <div className="p-4">
                        <h4 className="font-bold text-gray-900 mb-2">{property.name}</h4>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-semibold">{property.rating}</span>
                          </div>
                          <p className="text-lg font-bold text-emerald-600">₹{property.price.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Enhanced Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg lg:sticky lg:top-24 border-2 border-emerald-100">
              {/* Discount Banner */}
              {getDiscountMessage() && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`${getDiscountMessage()?.color} text-white px-4 py-3 rounded-xl mb-6 flex items-center gap-2`}
                >
                  <Sparkles className="w-5 h-5" />
                  <span className="font-bold text-sm">{getDiscountMessage()?.message}</span>
                </motion.div>
              )}

              <div className="mb-4 sm:mb-6">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl sm:text-4xl font-bold text-gray-900">₹{selectedRoom.price.toLocaleString()}</span>
                  <span className="text-sm sm:text-base text-gray-600">/ night</span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="font-semibold">{resortData.rating}</span>
                  <span className="text-gray-600">({resortData.reviewCount} reviews)</span>
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Check-in</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      value={checkInDate}
                      onChange={(e) => setCheckInDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Check-out</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      value={checkOutDate}
                      onChange={(e) => setCheckOutDate(e.target.value)}
                      min={checkInDate || new Date().toISOString().split('T')[0]}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Guest Counter */}
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Guests</label>
                  <div className="flex items-center gap-3 border-2 border-gray-300 rounded-lg p-3">
                    <button
                      onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                      className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center hover:bg-emerald-200 transition-colors"
                    >
                      <Minus className="w-5 h-5 text-emerald-600" />
                    </button>
                    <div className="flex-1 text-center">
                      <p className="text-2xl font-bold text-gray-900">{guestCount}</p>
                      <p className="text-xs text-gray-500">guests</p>
                    </div>
                    <button
                      onClick={() => setGuestCount(Math.min(selectedRoom.capacity, guestCount + 1))}
                      className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center hover:bg-emerald-200 transition-colors"
                    >
                      <Plus className="w-5 h-5 text-emerald-600" />
                    </button>
                  </div>
                  {guestCount >= selectedRoom.capacity && (
                    <p className="text-xs text-orange-600 mt-2 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Maximum capacity reached
                    </p>
                  )}
                </div>
              </div>

              {/* Dynamic Price Breakdown */}
              {numberOfNights > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mb-6 p-4 bg-emerald-50 rounded-xl border border-emerald-200"
                >
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-gray-700">
                      <span>₹{selectedRoom.price.toLocaleString()} × {numberOfNights} nights</span>
                      <span>₹{(selectedRoom.price * numberOfNights).toLocaleString()}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-green-600 font-semibold">
                        <span className="flex items-center gap-1">
                          <TrendingDown className="w-4 h-4" />
                          Discount
                        </span>
                        <span>-₹{discount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-gray-700">
                      <span>Service fee</span>
                      <span>₹{serviceFee.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>Taxes (12% GST)</span>
                      <span>₹{((selectedRoom.price * numberOfNights - discount) * taxRate).toLocaleString(Math, 'trunc')}</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {numberOfNights > 0 && (
                <div className="flex justify-between items-center text-lg font-bold text-gray-900 mb-6 p-4 bg-gray-50 rounded-xl">
                  <span>Total</span>
                  <span className="text-2xl text-emerald-600">₹{totalPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
              )}

              <button
                disabled={!checkInDate || !checkOutDate || numberOfNights === 0}
                className="w-full py-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-4"
              >
                {numberOfNights > 0 ? 'Reserve Now' : 'Select Dates'}
              </button>

              <div className="text-center text-sm text-gray-500 mb-4">
                You won't be charged yet
              </div>

              <div className="pt-6 border-t border-gray-200">
                <div className="flex items-center gap-3 mb-3">
                  <Phone className="w-5 h-5 text-emerald-600" />
                  <span className="font-semibold text-gray-900">Need help booking?</span>
                </div>
                <button className="w-full py-3 border-2 border-emerald-500 text-emerald-600 rounded-xl font-semibold hover:bg-emerald-50 transition-all">
                  Contact Property
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
