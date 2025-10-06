'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Resorts', href: '/resorts' },
    { name: 'Homestays', href: '/homestays' },
    { name: 'Rentals', href: '/rentals' },
    { name: 'Destinations', href: '/destinations' },
    { name: 'Services', href: '/services' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 w-full bg-white/95 backdrop-blur-lg z-50 border-b border-gray-100 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/">
            <motion.div
              className="flex items-center space-x-3 cursor-pointer"
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
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-emerald-600 font-medium transition-colors relative group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-5 py-2 text-gray-700 hover:text-emerald-600 font-medium transition"
            >
              List Property
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 text-white rounded-xl font-semibold shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 transition-all"
            >
              Sign In
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:hidden py-4 border-t border-gray-100"
          >
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-700 hover:text-emerald-600 font-medium transition-colors px-4 py-2"
                >
                  {item.name}
                </Link>
              ))}
              <div className="flex flex-col space-y-2 px-4 pt-4 border-t border-gray-100">
                <button className="px-5 py-2 text-gray-700 hover:text-emerald-600 font-medium transition text-left">
                  List Property
                </button>
                <button className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 text-white rounded-xl font-semibold shadow-lg">
                  Sign In
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}
