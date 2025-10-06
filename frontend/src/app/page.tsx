'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Search, MapPin, Star, Heart, ArrowRight, Shield, Award, Users, TrendingUp, Calendar, Phone, Home as HomeIcon, Building2, Car, Compass, Briefcase } from 'lucide-react';

interface Resort {
  id: number;
  name: string;
  slug: string;
  city: string;
  state: string;
  cover_image: string;
  price_range_min: string;
  star_rating: number;
  is_verified: boolean;
}

interface Homestay {
  id: number;
  name: string;
  slug: string;
  city: string;
  state: string;
  cover_image: string;
  price_per_night: string;
  is_verified: boolean;
}

interface Rental {
  id: number;
  name: string;
  vehicle_type: string;
  price_per_day: string;
  image: string;
}

interface Destination {
  id: number;
  name: string;
  category: string;
  price: string;
  image: string;
}

interface Service {
  id: number;
  name: string;
  service_type: string;
  contact: string;
  image: string;
}

// Mock data for all categories - Real Wayanad examples
const mockRentals: Rental[] = [
  { id: 1, name: 'Royal Enfield Classic 350', vehicle_type: 'bike', price_per_day: '800', image: 'https://images.unsplash.com/photo-1558981852-426c6c22a060?w=800' },
  { id: 2, name: 'Honda Activa 6G', vehicle_type: 'scooter', price_per_day: '500', image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800' },
  { id: 3, name: 'Maruti Swift Dzire', vehicle_type: 'car', price_per_day: '2500', image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800' },
];

const mockDestinations: Destination[] = [
  { id: 1, name: 'Chembra Peak Trek', category: 'adventure', price: '1200', image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800' },
  { id: 2, name: 'Edakkal Caves Tour', category: 'historical', price: '800', image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800' },
  { id: 3, name: 'Soochipara Waterfalls', category: 'nature', price: '500', image: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=800' },
];

const mockServices: Service[] = [
  { id: 1, name: 'Wayanad Taxi Services', service_type: 'taxi', contact: '+91 98765 43210', image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800' },
  { id: 2, name: 'Mountain Trail Guides', service_type: 'guide', contact: '+91 98765 43211', image: 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=800' },
  { id: 3, name: 'Wildlife Photography Tours', service_type: 'photographer', contact: '+91 98765 43212', image: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800' },
];

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } }
};

// Combined search data
const allSearchData = [
  // Resorts
  { id: 'r1', name: 'Vythiri Village Resort', category: 'Resorts', type: 'resort', slug: 'vythiri-village-resort' },
  { id: 'r2', name: 'AfterTheRains Resort', category: 'Resorts', type: 'resort', slug: 'afterrherains-resort' },
  { id: 'r3', name: 'Wayanad Silverwoods', category: 'Resorts', type: 'resort', slug: 'wayanad-silverwoods' },
  { id: 'r4', name: 'The Windflower Resort', category: 'Resorts', type: 'resort', slug: 'windflower-resort' },
  { id: 'r5', name: 'Sterling Wayanad', category: 'Resorts', type: 'resort', slug: 'sterling-wayanad' },
  { id: 'r6', name: 'Banasura Hill Resort', category: 'Resorts', type: 'resort', slug: 'banasura-hill-resort' },

  // Homestays
  { id: 'h1', name: 'Tribal Heritage Home', category: 'Homestays', type: 'homestay', slug: 'tribal-heritage-home' },
  { id: 'h2', name: 'Tranquil Farmstay', category: 'Homestays', type: 'homestay', slug: 'tranquil-farmstay' },
  { id: 'h3', name: 'Green Valley Homestay', category: 'Homestays', type: 'homestay', slug: 'green-valley-homestay' },
  { id: 'h4', name: 'Spice Garden Retreat', category: 'Homestays', type: 'homestay', slug: 'spice-garden-retreat' },
  { id: 'h5', name: 'Misty Mountain Home', category: 'Homestays', type: 'homestay', slug: 'misty-mountain-home' },

  // Rentals
  { id: 'v1', name: 'Royal Enfield Classic 350', category: 'Rentals', type: 'rental', slug: 'royal-enfield-classic-350' },
  { id: 'v2', name: 'Honda Activa 6G', category: 'Rentals', type: 'rental', slug: 'honda-activa-6g' },
  { id: 'v3', name: 'Maruti Swift Dzire', category: 'Rentals', type: 'rental', slug: 'maruti-swift-dzire' },
  { id: 'v4', name: 'Yamaha FZ-S', category: 'Rentals', type: 'rental', slug: 'yamaha-fz-s' },

  // Destinations
  { id: 'd1', name: 'Chembra Peak Trek', category: 'Destinations', type: 'destination', slug: 'chembra-peak-trek' },
  { id: 'd2', name: 'Edakkal Caves', category: 'Destinations', type: 'destination', slug: 'edakkal-caves' },
  { id: 'd3', name: 'Soochipara Waterfalls', category: 'Destinations', type: 'destination', slug: 'soochipara-waterfalls' },
  { id: 'd4', name: 'Banasura Sagar Dam', category: 'Destinations', type: 'destination', slug: 'banasura-sagar-dam' },
  { id: 'd5', name: 'Pookode Lake', category: 'Destinations', type: 'destination', slug: 'pookode-lake' },

  // Services
  { id: 's1', name: 'Wayanad Taxi Services', category: 'Services', type: 'service', slug: 'wayanad-taxi-services' },
  { id: 's2', name: 'Mountain Trail Guides', category: 'Services', type: 'service', slug: 'mountain-trail-guides' },
  { id: 's3', name: 'Wildlife Photography Tours', category: 'Services', type: 'service', slug: 'wildlife-photography-tours' },
  { id: 's4', name: 'Adventure Sports Wayanad', category: 'Services', type: 'service', slug: 'adventure-sports-wayanad' },
];

export default function Home() {
  const [resorts, setResorts] = useState<Resort[]>([]);
  const [homestays, setHomestays] = useState<Homestay[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<typeof allSearchData>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 800], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 800], [1, 0.98]);

  // Search handler
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length >= 1) {
      const filtered = allSearchData.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filtered.slice(0, 8));
      setShowSearchResults(true);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:8000/api/resorts/resorts/featured/').then(r => r.json()),
      fetch('http://localhost:8000/api/homestays/homestays/featured/').then(r => r.json())
    ]).then(([resortsData, homestaysData]) => {
      console.log('Resorts:', resortsData);
      console.log('Homestays:', homestaysData);
      console.log('Loading before:', loading);
      setResorts(resortsData.slice(0, 6));
      setHomestays(homestaysData.slice(0, 6));
      setLoading(false);
      console.log('Loading after:', false);
    }).catch(err => {
      console.error('API Error:', err);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Premium Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 w-full bg-white/95 backdrop-blur-lg z-50 border-b border-gray-100 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <motion.div
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.02 }}
            >
              <Image
                src="/logo.png"
                alt="WayanTrails Logo"
                width={50}
                height={50}
                className="object-contain"
                priority
              />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                  WayanTrails
                </h1>
                <p className="text-xs text-gray-500">Discover Wayanad</p>
              </div>
            </motion.div>

            <div className="hidden lg:flex items-center space-x-8">
              {['Resorts', 'Homestays', 'Rentals', 'Destinations', 'Services'].map((item) => (
                <Link
                  key={item}
                  href={`/${item.toLowerCase()}`}
                  className="text-gray-700 hover:text-emerald-600 font-medium transition-colors relative group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 group-hover:w-full transition-all duration-300"></span>
                </Link>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="hidden md:block px-5 py-2 text-gray-700 hover:text-emerald-600 font-medium transition"
              >
                List Property
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 text-white rounded-xl font-semibold shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 transition-all"
                suppressHydrationWarning
              >
                Sign In
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.section
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative pt-32 pb-24 px-6 overflow-hidden"
      >
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
          <div className="absolute top-0 left-0 w-full h-full opacity-30">
            <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
            <div className="absolute top-40 right-10 w-72 h-72 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center space-x-2 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full mb-8 shadow-lg">
              <Award className="w-5 h-5 text-emerald-600" />
              <span className="text-sm font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                #1 Travel Platform in Wayanad
              </span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-6xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight"
            >
              <span className="text-gray-900">Your Gateway to</span>
              <br />
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                Wayanad Paradise
              </span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed"
            >
              Discover handpicked luxury resorts, authentic homestays, and unforgettable experiences
              in Kerala's most beautiful hill station
            </motion.p>

            {/* Search Bar */}
            <motion.div
              variants={fadeInUp}
              className="max-w-2xl mx-auto mb-12 relative"
            >
              <div className="relative">
                <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search resorts, homestays, rentals, destinations..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  onFocus={() => searchQuery && setShowSearchResults(true)}
                  className="w-full pl-14 pr-6 py-5 rounded-2xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all text-lg"
                  suppressHydrationWarning
                />
              </div>

              {/* Search Results Dropdown */}
              {showSearchResults && searchResults.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
                >
                  {searchResults.map((result) => (
                    <Link
                      key={result.id}
                      href={`/${result.type === 'resort' ? 'resorts' : result.type === 'homestay' ? 'homestays' : result.type === 'rental' ? 'rentals' : result.type === 'destination' ? 'destinations' : 'services'}`}
                      onClick={() => setShowSearchResults(false)}
                      className="flex items-center justify-between px-6 py-4 hover:bg-emerald-50 transition-colors border-b border-gray-50 last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center">
                          {result.type === 'resort' && <Building2 className="w-5 h-5 text-white" />}
                          {result.type === 'homestay' && <HomeIcon className="w-5 h-5 text-white" />}
                          {result.type === 'rental' && <Car className="w-5 h-5 text-white" />}
                          {result.type === 'destination' && <Compass className="w-5 h-5 text-white" />}
                          {result.type === 'service' && <Briefcase className="w-5 h-5 text-white" />}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{result.name}</p>
                          <p className="text-sm text-gray-500">{result.category}</p>
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400" />
                    </Link>
                  ))}
                </motion.div>
              )}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 transition-all"
                suppressHydrationWarning
              >
                Explore All Properties
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white text-emerald-600 border-2 border-emerald-500 rounded-xl font-bold text-lg hover:bg-emerald-50 transition-all"
                suppressHydrationWarning
              >
                Plan Your Trip
              </motion.button>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={staggerContainer}
              className="grid grid-cols-2 md:grid-cols-4 gap-6"
            >
              {[
                { icon: Shield, number: '250+', label: 'Verified Properties', color: 'from-emerald-500 to-teal-500' },
                { icon: Users, number: '50K+', label: 'Happy Travelers', color: 'from-teal-500 to-cyan-500' },
                { icon: Star, number: '4.9', label: 'Average Rating', color: 'from-cyan-500 to-blue-500' },
                { icon: TrendingUp, number: '24/7', label: 'Support', color: 'from-blue-500 to-indigo-500' },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  variants={fadeInUp}
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all"
                >
                  <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl mb-4 shadow-lg`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{stat.number}</div>
                  <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Categories Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold text-gray-900 mb-4">
              Everything You Need for Your{' '}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Perfect Trip
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Your one-stop platform for accommodations, rentals, experiences, and local services in Wayanad
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Building2,
                title: 'Resorts',
                description: 'Premium luxury stays with world-class amenities and breathtaking views',
                link: '/resorts',
                gradient: 'from-emerald-500 to-teal-500',
                bgGradient: 'from-emerald-50 to-teal-50',
              },
              {
                icon: HomeIcon,
                title: 'Homestays',
                description: 'Authentic local experiences with verified host families and traditional hospitality',
                link: '/homestays',
                gradient: 'from-teal-500 to-cyan-500',
                bgGradient: 'from-teal-50 to-cyan-50',
              },
              {
                icon: Car,
                title: 'Rentals',
                description: 'Scooters, cars, and equipment rentals for your convenient exploration',
                link: '/rentals',
                gradient: 'from-cyan-500 to-blue-500',
                bgGradient: 'from-cyan-50 to-blue-50',
              },
              {
                icon: Compass,
                title: 'Destinations',
                description: 'Curated activities, attractions, and tour packages for unforgettable adventures',
                link: '/destinations',
                gradient: 'from-blue-500 to-indigo-500',
                bgGradient: 'from-blue-50 to-indigo-50',
              },
              {
                icon: Briefcase,
                title: 'Services',
                description: 'Local guides, photographers, taxis, and other essential travel services',
                link: '/services',
                gradient: 'from-indigo-500 to-purple-500',
                bgGradient: 'from-indigo-50 to-purple-50',
              },
            ].map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={category.link}>
                  <motion.div
                    whileHover={{ y: -8, scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                    className={`bg-gradient-to-br ${category.bgGradient} rounded-3xl p-8 h-full shadow-lg hover:shadow-2xl transition-all cursor-pointer border-2 border-transparent hover:border-white group relative overflow-hidden`}
                  >
                    {/* Decorative background */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/30 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>

                    <div className="relative">
                      <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${category.gradient} rounded-2xl mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <category.icon className="w-8 h-8 text-white" />
                      </div>

                      <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-emerald-600 group-hover:to-teal-600 transition-all">
                        {category.title}
                      </h3>

                      <p className="text-gray-600 leading-relaxed mb-4">
                        {category.description}
                      </p>

                      <div className="flex items-center text-emerald-600 font-semibold group-hover:translate-x-2 transition-transform">
                        Explore <ArrowRight className="w-5 h-5 ml-2" />
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Resorts */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex justify-between items-end mb-16"
          >
            <div>
              <h2 className="text-5xl font-bold text-gray-900 mb-4">
                Luxury <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Resorts</span>
              </h2>
              <p className="text-xl text-gray-600">Handpicked premium stays for unforgettable experiences</p>
            </div>
            <Link
              href="/resorts"
              className="hidden md:flex items-center space-x-2 px-6 py-3 bg-white hover:bg-gray-50 text-emerald-600 font-semibold rounded-xl border-2 border-emerald-200 hover:border-emerald-300 transition-all group"
            >
              <span>View All</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-300 h-96 rounded-3xl mb-6"></div>
                  <div className="bg-gray-300 h-6 rounded-lg mb-3 w-3/4"></div>
                  <div className="bg-gray-300 h-4 rounded-lg w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {resorts.map((resort, index) => (
                <motion.div
                  key={resort.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link href={`/resorts/${resort.slug}`} className="group block">
                    <motion.div
                      whileHover={{ y: -12 }}
                      transition={{ duration: 0.3 }}
                      className="relative overflow-hidden rounded-3xl bg-white shadow-xl hover:shadow-2xl transition-all"
                    >
                      <div className="relative h-96 overflow-hidden">
                        <motion.img
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.6 }}
                          src={resort.cover_image}
                          alt={resort.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="absolute top-4 right-4 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition group/btn"
                        >
                          <Heart className="w-6 h-6 text-gray-700 group-hover/btn:text-red-500 transition" />
                        </motion.button>

                        {resort.is_verified && (
                          <div className="absolute top-4 left-4 px-4 py-2 bg-emerald-500 text-white text-sm font-bold rounded-full flex items-center space-x-2 shadow-lg">
                            <Shield className="w-4 h-4" />
                            <span>Verified</span>
                          </div>
                        )}

                        <div className="absolute bottom-0 left-0 right-0 p-6">
                          <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-emerald-300 transition">
                            {resort.name}
                          </h3>
                          <div className="flex items-center text-white/90 mb-4">
                            <MapPin className="w-4 h-4 mr-2" />
                            <span className="text-sm">{resort.city}, {resort.state}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full">
                              <Star className="w-5 h-5 text-yellow-400 fill-current" />
                              <span className="font-bold text-white">{resort.star_rating}</span>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-white/80">Starting from</p>
                              <p className="text-2xl font-bold text-white">₹{Number(resort.price_range_min).toLocaleString()}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Homestays */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex justify-between items-end mb-16"
          >
            <div>
              <h2 className="text-5xl font-bold text-gray-900 mb-4">
                Authentic <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">Homestays</span>
              </h2>
              <p className="text-xl text-gray-600">Experience local culture with verified host families</p>
            </div>
            <Link
              href="/homestays"
              className="hidden md:flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-teal-50 to-cyan-50 hover:from-teal-100 hover:to-cyan-100 text-teal-600 font-semibold rounded-xl border-2 border-teal-200 hover:border-teal-300 transition-all group"
            >
              <span>View All</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-300 h-96 rounded-3xl mb-6"></div>
                  <div className="bg-gray-300 h-6 rounded-lg mb-3 w-3/4"></div>
                  <div className="bg-gray-300 h-4 rounded-lg w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {homestays.map((homestay, index) => (
                <motion.div
                  key={homestay.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link href={`/homestays/${homestay.slug}`} className="group block">
                    <motion.div
                      whileHover={{ y: -12 }}
                      transition={{ duration: 0.3 }}
                      className="relative overflow-hidden rounded-3xl bg-white shadow-xl hover:shadow-2xl transition-all"
                    >
                      <div className="relative h-96 overflow-hidden">
                        <motion.img
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.6 }}
                          src={homestay.cover_image}
                          alt={homestay.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="absolute top-4 right-4 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition group/btn"
                        >
                          <Heart className="w-6 h-6 text-gray-700 group-hover/btn:text-red-500 transition" />
                        </motion.button>

                        {homestay.is_verified && (
                          <div className="absolute top-4 left-4 px-4 py-2 bg-teal-500 text-white text-sm font-bold rounded-full flex items-center space-x-2 shadow-lg">
                            <Shield className="w-4 h-4" />
                            <span>Verified</span>
                          </div>
                        )}

                        <div className="absolute bottom-0 left-0 right-0 p-6">
                          <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-teal-300 transition">
                            {homestay.name}
                          </h3>
                          <div className="flex items-center text-white/90 mb-4">
                            <MapPin className="w-4 h-4 mr-2" />
                            <span className="text-sm">{homestay.city}, {homestay.state}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-white/80 text-sm">Per night</p>
                            <p className="text-2xl font-bold text-white">₹{Number(homestay.price_per_night).toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative max-w-4xl mx-auto text-center"
        >
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-white/90 mb-12">
            Book your perfect stay in Wayanad today and create memories that last a lifetime
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white text-emerald-600 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all"
              suppressHydrationWarning
            >
              Explore Properties
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 rounded-xl font-bold text-lg hover:bg-white/20 transition-all flex items-center justify-center space-x-2"
              suppressHydrationWarning
            >
              <Phone className="w-5 h-5" />
              <span>Contact Us</span>
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center space-y-6">
            <div className="flex items-center space-x-3">
              <Image
                src="/logo.png"
                alt="WayanTrails Logo"
                width={48}
                height={48}
                className="object-contain"
              />
              <div>
                <h3 className="text-2xl font-bold">WayanTrails</h3>
                <p className="text-sm text-gray-400">Discover Wayanad's Best</p>
              </div>
            </div>
            <p className="text-gray-400 text-center max-w-2xl">
              Your trusted platform for discovering the finest resorts, homestays, and experiences in Wayanad
            </p>
            <div className="flex space-x-6 text-sm text-gray-400">
              <Link href="/about" className="hover:text-white transition">About</Link>
              <Link href="/privacy" className="hover:text-white transition">Privacy</Link>
              <Link href="/terms" className="hover:text-white transition">Terms</Link>
              <Link href="/contact" className="hover:text-white transition">Contact</Link>
            </div>
            <p className="text-sm text-gray-500">© 2024 WayanTrails. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(50px, 50px) scale(1.05); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
