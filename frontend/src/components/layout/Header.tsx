'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { cn } from '@/lib/utils/cn'

interface HeaderProps {
  className?: string
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const navigation = [
    { name: 'Resorts', href: '/resorts' },
    { name: 'Homestays', href: '/homestays' },
    { name: 'Destinations', href: '/destinations' },
    { name: 'Experiences', href: '/experiences' },
    { name: 'About', href: '/about' },
  ]

  return (
    <header className={cn('bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50', className)}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative w-8 h-8 lg:w-10 lg:h-10">
              <div className="w-full h-full bg-sand-tan rounded-lg flex items-center justify-center group-hover:bg-sand-tan-dark transition-colors">
                <span className="text-white font-bold text-sm lg:text-base">W</span>
              </div>
            </div>
            <div className="hidden sm:block">
              <span className="heading-4 text-night-blue">WayanTrails</span>
              <span className="block text-xs text-text-muted leading-none">Explore Wayanad</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-night-blue hover:text-sand-tan font-medium transition-colors relative group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-sand-tan transition-all group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* Search & Actions */}
          <div className="flex items-center space-x-4">
            {/* Search Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSearchOpen(true)}
              leftIcon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              }
              className="hidden sm:flex"
            >
              Search
            </Button>

            {/* Mobile Search Icon */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="sm:hidden p-2 text-night-blue hover:text-sand-tan transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
              <Button variant="primary" size="sm">
                Sign Up
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-night-blue hover:text-sand-tan transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-gray-100 py-4"
            >
              <div className="flex flex-col space-y-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-night-blue hover:text-sand-tan font-medium py-2 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="pt-4 border-t border-gray-100 flex flex-col space-y-2 md:hidden">
                  <Button variant="ghost" size="sm" fullWidth>
                    Sign In
                  </Button>
                  <Button variant="primary" size="sm" fullWidth>
                    Sign Up
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={() => setIsSearchOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white mx-4 mt-4 rounded-xl shadow-premium-lg p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="heading-4 text-night-blue">Search WayanTrails</h3>
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="p-1 text-gray-400 hover:text-night-blue transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <Input
                placeholder="Search resorts, homestays, destinations..."
                leftIcon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                }
                className="mb-4"
              />
              <div className="flex flex-wrap gap-2">
                {['Luxury Resorts', 'Tree House', 'Farm Stay', 'Chembra Peak', 'Wayanad Wildlife'].map((tag) => (
                  <button
                    key={tag}
                    className="px-3 py-1 text-sm bg-gray-100 text-night-blue rounded-full hover:bg-sand-tan-light transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Header