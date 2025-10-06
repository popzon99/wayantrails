'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MapPin, Wifi, Coffee, Waves, Car, Shield, Heart, Share2, Phone, Calendar, Users, Check, X, ChevronLeft, ChevronRight, Plus, Minus, AlertCircle, Sparkles, TrendingDown, MessageCircle, Copy, ExternalLink, CheckCircle, ChevronDown, Navigation, Clock, ArrowRight, Compass, Camera, Utensils, Hotel as HotelIcon } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import Script from 'next/script';
import { useNearbyDestinations } from '@/lib/hooks';
import { useSimilarResorts } from '@/lib/hooks/useResorts';
import { getAllNearbyAmenities, formatDistance, getCategoryIcon, getCategoryName, type NearbyPlace } from '@/lib/overpass';
import HeroGallery from './components/HeroGallery';
import StickyBookingCard from './components/StickyBookingCard';
import StickyBottomBar from './components/StickyBottomBar';
import Breadcrumb from '@/components/Breadcrumb';
import BookingModal from '@/components/bookings/BookingModal';

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
  phone: '+91 98765 43210',
  whatsappNumber: '919876543210',
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
    {
      type: 'Check-in & Check-out',
      details: [
        'Check-in: 2:00 PM onwards',
        'Check-out: 11:00 AM',
        'Early check-in subject to availability',
        'Late check-out may incur additional charges'
      ]
    },
    {
      type: 'Cancellation Policy',
      details: [
        'Free cancellation up to 48 hours before check-in',
        '50% refund if cancelled 24-48 hours before check-in',
        'No refund for cancellations within 24 hours',
        'Full refund in case of property cancellation'
      ]
    },
    {
      type: 'Children & Extra Beds',
      details: [
        'Children of all ages welcome',
        'Children under 5 years stay free',
        'Extra bed available on request (₹1,500/night)',
        'Maximum 1 extra bed per room'
      ]
    },
    {
      type: 'Pet Policy',
      details: [
        'Pets are not allowed',
        'Service animals are welcome',
        'Please inform in advance if bringing service animal'
      ]
    },
    {
      type: 'House Rules',
      details: [
        'No smoking in rooms (designated smoking areas available)',
        'No parties or events allowed',
        'Quiet hours: 10:00 PM - 7:00 AM',
        'Valid ID proof required at check-in'
      ]
    },
  ],
  coordinates: {
    lat: 11.6854,
    lng: 76.1163
  },
  faqs: [
    {
      id: 1,
      question: 'What are the check-in and check-out times?',
      answer: 'Check-in is from 2:00 PM to 8:00 PM. Check-out is at 11:00 AM. Early check-in and late check-out may be available for an additional fee, subject to availability.'
    },
    {
      id: 2,
      question: 'Is breakfast included in the room rate?',
      answer: 'Yes, complimentary breakfast is included for all guests. We serve a buffet breakfast from 7:30 AM to 10:00 AM with both continental and Indian options.'
    },
    {
      id: 3,
      question: 'Do you have free parking?',
      answer: 'Yes, we offer complimentary parking for all guests. Covered parking is available on a first-come, first-served basis.'
    },
    {
      id: 4,
      question: 'Is WiFi free throughout the property?',
      answer: 'Yes, high-speed WiFi is complimentary in all rooms and common areas.'
    },
    {
      id: 5,
      question: 'Are pets allowed?',
      answer: 'Unfortunately, we do not allow pets at our property, with the exception of registered service animals.'
    },
    {
      id: 6,
      question: 'What activities are available nearby?',
      answer: 'The resort is close to many attractions including Edakkal Caves (2.5km), Soochipara Falls (3.2km), and Chembra Peak (4.1km). We can help arrange trekking, plantation tours, and wildlife safaris.'
    }
  ]
};

export default function ResortDetailPage() {
  const [selectedRoomType, setSelectedRoomType] = useState(0);
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [guestCount, setGuestCount] = useState(2);
  const [numberOfNights, setNumberOfNights] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [specialRequests, setSpecialRequests] = useState('');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [expandedPolicy, setExpandedPolicy] = useState<number | null>(null);
  const [showAllReviews, setShowAllReviews] = useState(false);

  // Extract city from resort location for nearby destinations
  const resortCity = resortData.location.split(',')[0].trim(); // "Vythiri" from "Vythiri, Wayanad"
  const { destinations: nearbyDestinations, isLoading: loadingDestinations } = useNearbyDestinations(resortCity, 4);

  // Fetch similar resorts from same city
  const { resorts: similarResorts, isLoading: loadingSimilarResorts } = useSimilarResorts(resortCity, resortData.slug, 4);

  // OpenStreetMap real-time nearby places
  // Mock data for nearby attractions and hotels
  const mockAttractions: NearbyPlace[] = [
    {
      id: '1',
      type: 'node',
      lat: 11.6718,
      lon: 76.0791,
      name: 'Edakkal Caves',
      tags: { tourism: 'attraction', name: 'Edakkal Caves' },
      distance: 2500,
    },
    {
      id: '2',
      type: 'node',
      lat: 11.6234,
      lon: 76.1456,
      name: 'Soochipara Falls',
      tags: { tourism: 'attraction', waterway: 'waterfall', name: 'Soochipara Falls' },
      distance: 3200,
    },
    {
      id: '3',
      type: 'node',
      lat: 11.6012,
      lon: 76.0723,
      name: 'Chembra Peak',
      tags: { tourism: 'attraction', natural: 'peak', name: 'Chembra Peak' },
      distance: 4100,
    },
    {
      id: '4',
      type: 'node',
      lat: 11.7234,
      lon: 76.0912,
      name: 'Banasura Sagar Dam',
      tags: { tourism: 'attraction', name: 'Banasura Sagar Dam' },
      distance: 4800,
    },
    {
      id: '5',
      type: 'node',
      lat: 11.5634,
      lon: 76.0567,
      name: 'Pookode Lake',
      tags: { tourism: 'viewpoint', name: 'Pookode Lake' },
      distance: 3700,
    },
    {
      id: '6',
      type: 'node',
      lat: 11.6445,
      lon: 76.1123,
      name: 'Meenmutty Falls',
      tags: { tourism: 'attraction', waterway: 'waterfall', name: 'Meenmutty Falls' },
      distance: 2900,
    },
  ];

  const mockHotels: Array<NearbyPlace & { slug?: string; image?: string; rating?: string; price?: string }> = [
    {
      id: 'h2',
      type: 'node',
      lat: 11.6812,
      lon: 76.0987,
      name: 'Wayanad Silverwoods',
      tags: { tourism: 'hotel', name: 'Wayanad Silverwoods', stars: '4' },
      distance: 1500,
      slug: 'wayanad-silverwoods',
      image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400',
      rating: '4.7',
      price: '12,000',
    },
    {
      id: 'h3',
      type: 'node',
      lat: 11.6934,
      lon: 76.1156,
      name: 'AfterTheRains Resort',
      tags: { tourism: 'hotel', name: 'AfterTheRains Resort', stars: '4' },
      distance: 1800,
      slug: 'aftertherains-resort',
      image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400',
      rating: '4.8',
      price: '14,000',
    },
    {
      id: 'h4',
      type: 'node',
      lat: 11.6623,
      lon: 76.0923,
      name: 'Green Gates Hotel',
      tags: { tourism: 'hotel', name: 'Green Gates Hotel', stars: '3' },
      distance: 2100,
      slug: 'green-gates-hotel',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
      rating: '4.3',
      price: '8,500',
    },
  ];

  const [osmAttractions, setOsmAttractions] = useState<NearbyPlace[]>(mockAttractions);
  const [osmHotels, setOsmHotels] = useState<NearbyPlace[]>(mockHotels);
  const [osmLoading, setOsmLoading] = useState(false);

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

  // Generate WhatsApp message
  const generateWhatsAppMessage = () => {
    const formatDate = (dateStr: string) => {
      if (!dateStr) return '';
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    let message = `Hi! I'm interested in booking at *${resortData.name}*\n\n`;
    message += `📅 *Check-in:* ${formatDate(checkInDate)}\n`;
    message += `📅 *Check-out:* ${formatDate(checkOutDate)}\n`;
    message += `🛏️ *Room Type:* ${selectedRoom.name}\n`;
    message += `👥 *Guests:* ${guestCount}\n`;
    message += `🌙 *Nights:* ${numberOfNights}\n\n`;

    if (discount > 0) {
      message += `💰 *Room Cost:* ₹${(selectedRoom.price * numberOfNights).toLocaleString()}\n`;
      message += `🎉 *Discount:* -₹${discount.toLocaleString()}\n`;
    }
    message += `💳 *Total Amount:* ₹${totalPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}\n\n`;

    if (specialRequests) {
      message += `📝 *Special Requests:*\n${specialRequests}\n\n`;
    }

    message += `Please confirm availability and share booking details. Thank you!`;

    return encodeURIComponent(message);
  };

  const handleWhatsAppBooking = () => {
    const message = generateWhatsAppMessage();
    const whatsappURL = `https://wa.me/${resortData.whatsappNumber}?text=${message}`;
    window.open(whatsappURL, '_blank');
  };

  const copyMessage = () => {
    const message = decodeURIComponent(generateWhatsAppMessage());
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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

  // JSON-LD Structured Data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Hotel",
    "name": resortData.name,
    "description": resortData.description,
    "image": resortData.images,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": resortData.location.split(',')[0],
      "addressRegion": "Kerala",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": resortData.coordinates.lat,
      "longitude": resortData.coordinates.lng
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": resortData.rating,
      "reviewCount": resortData.reviewCount
    },
    "priceRange": `₹${Math.min(...resortData.roomTypes.map(r => r.price))} - ₹${Math.max(...resortData.roomTypes.map(r => r.price))}`,
    "telephone": resortData.phone,
    "starRating": {
      "@type": "Rating",
      "ratingValue": "5"
    },
    "amenityFeature": resortData.amenities.map(a => ({
      "@type": "LocationFeatureSpecification",
      "name": a.name,
      "value": a.available
    }))
  };

  return (
    <>
      {/* JSON-LD Structured Data for SEO */}
      <Script
        id="resort-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="min-h-screen bg-gray-50">
        <Navbar />

      {/* Breadcrumb Navigation */}
      <div className="mt-16 sm:mt-20">
        <Breadcrumb
          items={[
            { label: 'Wayanad', href: '/destinations/wayanad' },
            { label: 'Resorts', href: '/resorts' },
            { label: resortData.name }
          ]}
        />
      </div>

      {/* Hero Gallery */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-4">
        <HeroGallery images={resortData.images} resortName={resortData.name} />
      </div>

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

              {/* Save & Share Buttons */}
              <div className="flex flex-wrap gap-3 mt-4">
                <button
                  onClick={() => alert('Save feature coming soon!')}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
                >
                  <Heart className="w-4 h-4" />
                  <span>Save</span>
                </button>
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: resortData.name,
                        text: resortData.description,
                        url: window.location.href
                      });
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      alert('Link copied to clipboard!');
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>
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
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Room Types & Live Availability</h2>
                <div className="px-3 py-1.5 bg-blue-100 rounded-full">
                  <span className="text-xs font-semibold text-blue-700">At {resortData.name}</span>
                </div>
              </div>
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
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Guest Reviews</h2>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-100 rounded-full">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-bold text-gray-900">{resortData.rating}</span>
                    <span className="text-xs text-gray-600">({resortData.reviewCount})</span>
                  </div>
                </div>
                <button
                  onClick={() => setShowAllReviews(!showAllReviews)}
                  className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors flex items-center gap-1"
                >
                  {showAllReviews ? 'Show Less' : 'View All'}
                  <ChevronDown className={`w-4 h-4 transition-transform ${showAllReviews ? 'rotate-180' : ''}`} />
                </button>
              </div>

              <div className="space-y-4">
                {resortData.reviews.slice(0, showAllReviews ? undefined : 2).map((review) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 sm:p-5 bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl hover:shadow-md transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                        {review.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                          <div>
                            <h4 className="font-bold text-gray-900 text-base sm:text-lg">{review.name}</h4>
                            <p className="text-xs sm:text-sm text-gray-500 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {review.date}
                            </p>
                          </div>
                          <div className="flex items-center gap-0.5 px-2.5 py-1 bg-yellow-50 rounded-full border border-yellow-200 w-fit">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{review.comment}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {!showAllReviews && resortData.reviews.length > 2 && (
                <div className="mt-4 text-center">
                  <button
                    onClick={() => setShowAllReviews(true)}
                    className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors"
                  >
                    View {resortData.reviews.length - 2} More Reviews
                  </button>
                </div>
              )}
            </div>

            {/* Policies Accordion */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Policies & Information</h2>
              <div className="space-y-3">
                {resortData.policies.map((policy, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setExpandedPolicy(expandedPolicy === index ? null : index)}
                      className="w-full px-4 sm:px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <span className="font-semibold text-gray-900 text-left">{policy.type}</span>
                      <motion.div
                        animate={{ rotate: expandedPolicy === index ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="w-5 h-5 text-gray-600" />
                      </motion.div>
                    </button>
                    <AnimatePresence>
                      {expandedPolicy === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 sm:px-6 py-4 bg-white">
                            <ul className="space-y-2">
                              {policy.details.map((detail, i) => (
                                <li key={i} className="flex items-start gap-2 text-gray-700">
                                  <Check className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                                  <span className="text-sm sm:text-base">{detail}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>

            {/* Location & Map */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Location</h2>

              {/* Address */}
              <div className="flex items-start gap-3 mb-6">
                <MapPin className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-gray-900 mb-1">{resortData.name}</p>
                  <p className="text-gray-600">{resortData.location}</p>
                </div>
              </div>

              {/* Google Map Embed */}
              <div className="relative w-full h-64 sm:h-80 rounded-xl overflow-hidden mb-4">
                <iframe
                  src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15658.123456789012!2d${resortData.coordinates.lng}!3d${resortData.coordinates.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTHCsDQxJzA3LjQiTiA3NsKwMDYnNTguNyJF!5e0!3m2!1sen!2sin!4v1234567890123`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                ></iframe>
              </div>

              {/* Get Directions Button */}
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${resortData.coordinates.lat},${resortData.coordinates.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <Navigation className="w-5 h-5" />
                Get Directions
              </a>
            </div>

            {/* Things to Do Nearby */}
            <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-sm border border-emerald-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                    <Compass className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Explore Nearby</h2>
                    <p className="text-sm text-gray-600">Top attractions you can book instantly</p>
                  </div>
                </div>
                <Link
                  href="/destinations"
                  className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-emerald-600 font-semibold rounded-lg border border-emerald-200 transition-colors group"
                >
                  View All
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {osmLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse bg-white rounded-xl overflow-hidden p-4">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
                      <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" />
                      <div className="h-3 bg-gray-200 rounded w-2/3" />
                    </div>
                  ))}
                </div>
              ) : osmAttractions.length === 0 && nearbyDestinations.length === 0 ? (
                <div className="bg-white rounded-xl p-8 text-center">
                  <Compass className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">No nearby attractions found</p>
                  <p className="text-sm text-gray-400 mt-2">Try exploring the map or browse all destinations</p>
                  <Link
                    href="/destinations"
                    className="mt-4 inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-semibold"
                  >
                    Browse All Destinations
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* OpenStreetMap Real-Time Attractions */}
                  {osmAttractions.length > 0 && (
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Camera className="w-5 h-5 text-emerald-600" />
                        Nearby Attractions (Real-Time from OpenStreetMap)
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {osmAttractions.map((place) => (
                          <motion.div
                            key={place.id}
                            whileHover={{ y: -2 }}
                            className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all border border-gray-200"
                          >
                            <div className="flex items-start gap-3">
                              <div className="p-2 bg-emerald-100 rounded-lg">
                                <Camera className="w-5 h-5 text-emerald-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 line-clamp-1 mb-1">
                                  {place.name}
                                </h4>
                                <p className="text-xs text-gray-600 mb-2">
                                  {getCategoryName(place.tags)}
                                </p>
                                <div className="flex items-center gap-2">
                                  <MapPin className="w-3 h-3 text-gray-500" />
                                  <span className="text-xs text-gray-500">
                                    {formatDistance(place.distance || 0)} away
                                  </span>
                                </div>
                                <button
                                  onClick={() => window.open(`https://www.openstreetmap.org/directions?from=${resortData.coordinates.lat},${resortData.coordinates.lng}&to=${place.lat},${place.lon}`, '_blank')}
                                  className="mt-3 w-full py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-1"
                                >
                                  <Navigation className="w-3 h-3" />
                                  Get Directions
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Backend Destinations (if available) */}
                  {nearbyDestinations.length > 0 && (
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 mb-4">Bookable Experiences</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {nearbyDestinations.map((destination) => (
                          <motion.div
                            key={destination.id}
                            whileHover={{ y: -4 }}
                            className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all group"
                          >
                            {/* Destination Image */}
                            <div className="relative h-48 overflow-hidden">
                              <img
                                src={destination.cover_image || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400'}
                                alt={destination.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                              {/* Gradient Overlay */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                              {/* Type Badge */}
                              <div className="absolute top-3 left-3 px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-full text-xs font-bold text-gray-900 shadow-lg">
                                {destination.destination_type?.replace('_', ' ').toUpperCase()}
                              </div>

                              {/* Instant Booking Badge */}
                              {destination.instant_booking && (
                                <div className="absolute top-3 right-3 px-3 py-1.5 bg-emerald-500 text-white rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                                  <Check className="w-3 h-3" />
                                  Instant Book
                                </div>
                              )}

                              {/* Rating */}
                              {destination.average_rating && (
                                <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-lg flex items-center gap-1">
                                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                  <span className="text-xs font-bold text-white">{parseFloat(destination.average_rating).toFixed(1)}</span>
                                </div>
                              )}
                            </div>

                            {/* Destination Details */}
                            <div className="p-4">
                              <h3 className="font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-emerald-600 transition-colors">
                                {destination.name}
                              </h3>

                              {/* Location */}
                              <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                                <span className="line-clamp-1">{destination.city}</span>
                              </div>

                              {/* Entry Fee or Activity Info */}
                              <div className="flex items-center gap-3 mb-3">
                                {destination.is_free_entry ? (
                                  <div className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">
                                    FREE ENTRY
                                  </div>
                                ) : (
                                  <div className="text-sm text-gray-600">
                                    <span className="text-xs text-gray-500">Entry Fee: </span>
                                    <span className="font-semibold text-emerald-600">₹{parseFloat(destination.entry_fee || '0').toFixed(0)}</span>
                                  </div>
                                )}
                                {destination.opening_time && destination.closing_time && (
                                  <div className="flex items-center gap-1 text-xs text-gray-500">
                                    <Clock className="w-3 h-3" />
                                    <span>{destination.opening_time} - {destination.closing_time}</span>
                                  </div>
                                )}
                              </div>

                              {/* Description */}
                              <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                                {destination.short_description}
                              </p>

                              {/* Price and CTA */}
                              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                <div>
                                  {!destination.is_free_entry && destination.entry_fee && parseFloat(destination.entry_fee) > 0 ? (
                                    <>
                                      <p className="text-xs text-gray-500 mb-0.5">Entry Fee</p>
                                      <p className="text-xl font-bold text-emerald-600">
                                        ₹{parseFloat(destination.entry_fee).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                      </p>
                                    </>
                                  ) : destination.is_free_entry ? (
                                    <>
                                      <p className="text-xs text-gray-500 mb-0.5">Entry</p>
                                      <p className="text-xl font-bold text-emerald-600">FREE</p>
                                    </>
                                  ) : (
                                    <>
                                      <p className="text-xs text-gray-500 mb-0.5">Visit</p>
                                      <p className="text-lg font-semibold text-gray-900">Explore</p>
                                    </>
                                  )}
                                </div>
                                <Link
                                  href={`/destinations/${destination.slug}`}
                                  className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-lg font-semibold text-sm transition-all shadow-md hover:shadow-lg flex items-center gap-2 group/btn"
                                >
                                  Book Now
                                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                </Link>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* View All Button - Mobile */}
              <Link
                href="/destinations"
                className="sm:hidden mt-6 w-full py-3 bg-white hover:bg-gray-50 text-emerald-600 font-bold rounded-lg border-2 border-emerald-200 transition-colors flex items-center justify-center gap-2 group"
              >
                Explore All Destinations
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* FAQ Section */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Frequently Asked Questions</h2>

              <div className="space-y-3">
                {resortData.faqs.map((faq, index) => (
                  <details
                    key={faq.id}
                    className="group border border-gray-200 rounded-lg hover:border-emerald-300 transition-colors"
                    open={index === 0}
                  >
                    <summary className="p-4 cursor-pointer font-medium text-gray-900 hover:bg-gray-50 flex items-center justify-between transition-colors">
                      <span className="text-sm sm:text-base">{faq.question}</span>
                      <ChevronDown className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform flex-shrink-0 ml-2" />
                    </summary>
                    <div className="px-4 pb-4 text-sm sm:text-base text-gray-700 leading-relaxed">
                      {faq.answer}
                    </div>
                  </details>
                ))}
              </div>
            </div>

            {/* Similar Properties */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Similar Properties Nearby</h2>

              {(loadingSimilarResorts || osmLoading) ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-48 bg-gray-200 rounded-xl mb-3" />
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                      <div className="h-4 bg-gray-200 rounded w-1/2" />
                    </div>
                  ))}
                </div>
              ) : (similarResorts && similarResorts.length > 0) || osmHotels.length > 0 ? (
                <div className="space-y-6">
                  {/* Backend Similar Resorts */}
                  {similarResorts && similarResorts.filter(r => r.price_per_night && parseFloat(r.price_per_night) > 0).length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-600 mb-3">From Our Platform</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {similarResorts
                          .filter(resort => resort.price_per_night && parseFloat(resort.price_per_night) > 0)
                          .map((resort) => (
                          <Link key={resort.id} href={`/resorts/${resort.slug}`} className="group">
                            <div className="border border-gray-200 rounded-xl overflow-hidden hover:border-emerald-300 hover:shadow-lg transition-all">
                              <div className="relative h-40">
                                <img
                                  src={resort.cover_image || 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400'}
                                  alt={resort.name}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              </div>
                              <div className="p-3">
                                <h4 className="font-bold text-gray-900 mb-1 line-clamp-1 group-hover:text-emerald-600 transition-colors">{resort.name}</h4>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1">
                                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-current" />
                                    <span className="text-sm font-semibold">
                                      {resort.average_rating ? parseFloat(resort.average_rating).toFixed(1) : '4.5'}
                                    </span>
                                  </div>
                                  <p className="text-sm font-bold text-emerald-600">
                                    ₹{parseFloat(resort.price_per_night).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* OSM Hotels (Real-Time) */}
                  {osmHotels.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-600 mb-3 flex items-center gap-2">
                        <HotelIcon className="w-4 h-4 text-emerald-600" />
                        Nearby Properties
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {osmHotels.map((hotel: any) => (
                          <Link key={hotel.id} href={`/resorts/${hotel.slug || '#'}`} className="group">
                            <div className="border border-gray-200 rounded-xl overflow-hidden hover:border-emerald-300 hover:shadow-lg transition-all">
                              <div className="relative h-40">
                                <img
                                  src={hotel.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400'}
                                  alt={hotel.name}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute top-2 right-2 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-700 flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-emerald-600" />
                                  {formatDistance(hotel.distance || 0)}
                                </div>
                              </div>
                              <div className="p-3">
                                <h4 className="font-bold text-gray-900 mb-1 line-clamp-1 group-hover:text-emerald-600 transition-colors">
                                  {hotel.name}
                                </h4>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1">
                                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-current" />
                                    <span className="text-sm font-semibold">
                                      {hotel.rating || '4.5'}
                                    </span>
                                  </div>
                                  <p className="text-sm font-bold text-emerald-600">
                                    ₹{hotel.price || '10,000'}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No similar properties found nearby</p>
                  <Link
                    href="/resorts"
                    className="mt-3 inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-semibold"
                  >
                    Browse All Resorts
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Sticky Booking Card (Desktop Only) */}
          <div className="lg:col-span-1">
            <StickyBookingCard
              resortName={resortData.name}
              roomTypes={resortData.roomTypes}
              onBookingChange={(data) => {
                setCheckInDate(data.checkIn);
                setCheckOutDate(data.checkOut);
                setGuestCount(data.guests);
                setSelectedRoomType(data.selectedRoomIndex);
              }}
              onReserve={() => setShowBookingModal(true)}
            />
          </div>
        </div>
      </div>

      {/* WhatsApp Booking Modal */}
      <AnimatePresence>
        {showWhatsAppModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowWhatsAppModal(false)}
              className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-4 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-lg bg-white rounded-2xl shadow-2xl z-50 overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <MessageCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">WhatsApp Booking</h3>
                      <p className="text-sm text-white/90">Instant confirmation</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowWhatsAppModal(false)}
                    className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 max-h-[calc(100vh-200px)] sm:max-h-96 overflow-y-auto">
                {/* Booking Summary */}
                <div className="bg-emerald-50 rounded-xl p-4 mb-6">
                  <h4 className="font-bold text-gray-900 mb-3">Booking Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Property:</span>
                      <span className="font-semibold text-gray-900">{resortData.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Room:</span>
                      <span className="font-semibold text-gray-900">{selectedRoom.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Check-in:</span>
                      <span className="font-semibold text-gray-900">{checkInDate ? new Date(checkInDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Check-out:</span>
                      <span className="font-semibold text-gray-900">{checkOutDate ? new Date(checkOutDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Guests:</span>
                      <span className="font-semibold text-gray-900">{guestCount}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-emerald-200">
                      <span className="text-gray-900 font-bold">Total Amount:</span>
                      <span className="font-bold text-emerald-600 text-lg">₹{totalPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                    </div>
                  </div>
                </div>

                {/* Special Requests */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Special Requests (Optional)
                  </label>
                  <textarea
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="Early check-in, airport pickup, dietary requirements, etc."
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
                  />
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={handleWhatsAppBooking}
                    className="w-full py-4 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-2 shadow-lg"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Open WhatsApp
                    <ExternalLink className="w-4 h-4" />
                  </button>

                  <button
                    onClick={copyMessage}
                    className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-5 h-5" />
                        Copy Message
                      </>
                    )}
                  </button>
                </div>

                <p className="text-xs text-gray-500 text-center mt-4">
                  You'll be redirected to WhatsApp with a pre-filled message. The property will confirm your booking.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Floating WhatsApp Button (Mobile/Desktop) */}
      <motion.a
        href={`https://wa.me/${resortData.whatsappNumber}`}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 sm:w-16 sm:h-16 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-full shadow-2xl flex items-center justify-center transition-colors"
      >
        <MessageCircle className="w-7 h-7 sm:w-8 sm:h-8" />
      </motion.a>

      {/* Sticky Mobile CTA Bar */}
      {/* Sticky Bottom Bar (Mobile Only) */}
      <StickyBottomBar
        minPrice={Math.min(...resortData.roomTypes.map(r => r.price))}
        resortName={resortData.name}
        roomTypes={resortData.roomTypes}
        onReserve={() => setShowBookingModal(true)}
      />

      {/* Booking Modal */}
      <BookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        resort={{
          id: resortData.id,
          name: resortData.name,
          city: resortData.location.split(',')[0],
          state: resortData.location.split(',')[1]?.trim() || 'Wayanad'
        }}
        roomTypes={resortData.roomTypes.map(room => ({
          id: resortData.roomTypes.indexOf(room) + 1,
          name: room.name,
          price_per_night: room.price.toString(),
          max_guests: room.capacity,
          description: room.features.join(', '),
          amenities: room.features
        }))}
        initialCheckIn={checkInDate}
        initialCheckOut={checkOutDate}
        initialAdults={guestCount}
        initialChildren={0}
      />
    </div>
    </>
  );
}
