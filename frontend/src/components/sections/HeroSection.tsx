'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils/cn'
import { ClientOnly } from '@/components/ui/ClientOnly'

interface HeroSectionProps {
  className?: string
}

const HeroSection: React.FC<HeroSectionProps> = ({ className }) => {
  const [searchQuery, setSearchQuery] = useState('')

  const categories = [
    { name: 'Luxury Resorts', icon: '🏨', count: '45+' },
    { name: 'Eco Homestays', icon: '🏡', count: '120+' },
    { name: 'Adventure Tours', icon: '🏔️', count: '80+' },
    { name: 'Cultural Experiences', icon: '🎭', count: '60+' },
  ]

  const stats = [
    { number: '250+', label: 'Premium Properties' },
    { number: '50K+', label: 'Happy Travelers' },
    { number: '4.8', label: 'Average Rating' },
    { number: '24/7', label: 'Support Available' },
  ]

  return (
    <section className={cn('relative overflow-hidden bg-gradient-to-br from-[#f0d4b3] via-white to-[#3d6470]', className)}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#e1b382] rounded-full blur-3xl" />
        <div className="absolute bottom-40 right-20 w-40 h-40 bg-[#4a7c59] rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-[#d97642] rounded-full blur-2xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            <div className="mb-6">
              <Badge variant="primary" className="mb-4 inline-flex">
                ✨ Kerala's Hidden Gem
              </Badge>
              <h1 className="heading-hero text-[#2d545e] mb-6">
                Discover the Magic of{' '}
                <span className="text-[#e1b382]">Wayanad</span>
              </h1>
              <p className="body-large text-[#4a5568] max-w-xl">
                From luxury resorts nestled in spice plantations to authentic homestays
                in tribal villages, experience Kerala's hill station paradise like never before.
              </p>
            </div>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8"
            >
              <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto lg:mx-0">
                <Input
                  id="hero-search"
                  placeholder="Search resorts, homestays, experiences..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  leftIcon={
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  }
                  className="flex-1"
                />
                <Button variant="primary" size="md">
                  Explore Now
                </Button>
              </div>
            </motion.div>

            {/* Quick Categories */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8"
            >
              {categories.map((category, index) => (
                <button
                  key={category.name}
                  className="group p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 hover:border-sand-tan hover:shadow-premium transition-all duration-300"
                >
                  <div className="text-2xl mb-2">{category.icon}</div>
                  <div className="text-sm font-medium text-night-blue group-hover:text-sand-tan transition-colors">
                    {category.name}
                  </div>
                  <div className="text-xs text-text-muted">{category.count}</div>
                </button>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Button variant="primary" size="lg" className="min-w-[160px]">
                Start Exploring
              </Button>
              <Button variant="outline" size="lg" className="min-w-[160px]">
                Watch Video
              </Button>
            </motion.div>
          </motion.div>

          {/* Hero Image/Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <div className="relative h-[500px] lg:h-[600px] rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(45,84,94,0.15)]">
              {/* Placeholder for hero image - you can replace with actual image */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#4a7c59] via-[#3a6249] to-[#2d545e]">
                <div className="absolute inset-0 opacity-50 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMiIgZmlsbD0iIzQ1NjY2MSIgZmlsbC1vcGFjaXR5PSIwLjEiLz4KPC9zdmc+')] bg-repeat" />
              </div>

              {/* Floating Elements */}
              <ClientOnly>
                <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-[0_10px_40px_rgba(45,84,94,0.1)]">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-sm font-medium text-[#2d545e]">Live Bookings</span>
                  </div>
                </div>

                <div className="absolute top-20 right-6 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-[0_10px_40px_rgba(45,84,94,0.1)]">
                  <div className="text-sm font-medium text-[#2d545e]">⭐ 4.8/5</div>
                  <div className="text-xs text-[#718096]">1,234 reviews</div>
                </div>

                <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-[0_10px_40px_rgba(45,84,94,0.1)]">
                  <div className="text-sm font-medium text-[#2d545e] mb-1">Today's Special</div>
                  <div className="text-lg font-bold text-[#e1b382]">₹2,999</div>
                  <div className="text-xs text-[#718096]">Tree House Stay</div>
                </div>
              </ClientOnly>

              {/* Content overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="text-6xl mb-4">🌿</div>
                  <h3 className="heading-3 mb-2">Wayanad Awaits</h3>
                  <p className="body-normal opacity-90">Experience Nature's Paradise</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 pt-8 border-t border-gray-200"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="heading-2 text-sand-tan mb-2">{stat.number}</div>
                <div className="body-small text-text-muted">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default HeroSection