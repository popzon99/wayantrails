'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { cn } from '@/lib/utils/cn'

interface FooterProps {
  className?: string
}

const Footer: React.FC<FooterProps> = ({ className }) => {
  const footerLinks = {
    explore: [
      { name: 'Luxury Resorts', href: '/resorts?type=luxury' },
      { name: 'Eco Homestays', href: '/homestays?type=eco' },
      { name: 'Adventure Tours', href: '/experiences?type=adventure' },
      { name: 'Cultural Experiences', href: '/experiences?type=cultural' },
      { name: 'Wayanad Destinations', href: '/destinations' },
    ],
    support: [
      { name: 'Help Center', href: '/help' },
      { name: 'Contact Us', href: '/contact' },
      { name: 'Booking Support', href: '/support' },
      { name: 'Cancellation Policy', href: '/cancellation-policy' },
      { name: 'Terms & Conditions', href: '/terms' },
    ],
    company: [
      { name: 'About WayanTrails', href: '/about' },
      { name: 'Our Mission', href: '/mission' },
      { name: 'Local Partners', href: '/partners' },
      { name: 'Careers', href: '/careers' },
      { name: 'Press & Media', href: '/press' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Cookie Policy', href: '/cookies' },
      { name: 'Accessibility', href: '/accessibility' },
      { name: 'Sitemap', href: '/sitemap' },
    ],
  }

  const socialLinks = [
    {
      name: 'Instagram',
      href: 'https://instagram.com/wayantrails',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.618 5.367 11.986 11.988 11.986s11.987-5.368 11.987-11.986C24.004 5.367 18.635.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.326-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.326C5.901 8.244 7.052 7.754 8.349 7.754s2.448.49 3.326 1.297c.877.877 1.367 2.028 1.367 3.325s-.49 2.448-1.367 3.326c-.878.807-2.029 1.297-3.326 1.297z" />
        </svg>
      ),
    },
    {
      name: 'Facebook',
      href: 'https://facebook.com/wayantrails',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
    {
      name: 'Twitter',
      href: 'https://twitter.com/wayantrails',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
        </svg>
      ),
    },
    {
      name: 'YouTube',
      href: 'https://youtube.com/wayantrails',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
    },
  ]

  return (
    <footer className={cn('bg-night-blue text-white', className)}>
      {/* Newsletter Section */}
      <div className="border-b border-night-blue-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="heading-3 mb-4">Stay Connected with Wayanad</h3>
            <p className="body-large text-white/80 mb-8">
              Get the latest updates on new resorts, exclusive deals, and hidden gems in Wayanad.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                placeholder="Enter your email"
                className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/60"
              />
              <Button variant="primary" className="bg-sand-tan hover:bg-sand-tan-dark">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-sand-tan rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">W</span>
              </div>
              <div>
                <span className="heading-4 text-white">WayanTrails</span>
                <span className="block text-sm text-white/80">Explore Wayanad</span>
              </div>
            </Link>
            <p className="body-normal text-white/80 mb-6 max-w-sm">
              Your gateway to authentic Wayanad experiences. Discover luxury resorts,
              traditional homestays, and unforgettable adventures in Kerala's hill station paradise.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-white/10 rounded-lg hover:bg-sand-tan transition-colors group"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Explore Links */}
          <div>
            <h4 className="heading-5 text-white mb-4">Explore</h4>
            <ul className="space-y-3">
              {footerLinks.explore.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="body-normal text-white/80 hover:text-sand-tan transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="heading-5 text-white mb-4">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="body-normal text-white/80 hover:text-sand-tan transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="heading-5 text-white mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="body-normal text-white/80 hover:text-sand-tan transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-12 pt-8 border-t border-night-blue-light">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-sand-tan rounded-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h5 className="font-medium text-white mb-1">Visit Our Office</h5>
                <p className="text-sm text-white/80">Kalpetta, Wayanad<br />Kerala, India 673121</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="p-2 bg-sand-tan rounded-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <h5 className="font-medium text-white mb-1">Call Us</h5>
                <p className="text-sm text-white/80">+91 9876543210<br />+91 8765432109</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="p-2 bg-sand-tan rounded-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h5 className="font-medium text-white mb-1">Email Us</h5>
                <p className="text-sm text-white/80">hello@wayantrails.com<br />support@wayantrails.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-night-blue-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <p className="text-sm text-white/60">
                © 2024 WayanTrails. All rights reserved.
              </p>
              <div className="flex space-x-4">
                {footerLinks.legal.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-sm text-white/60 hover:text-sand-tan transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-white/60">Powered by</span>
              <span className="text-sm font-medium text-sand-tan">Kerala Tourism</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer