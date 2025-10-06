'use client';

import Link from 'next/link';
import { Hotel, Home, Car, MapPin, Briefcase } from 'lucide-react';
import { Card } from '@/components/ui';

const categories = [
  {
    id: 1,
    title: 'Resorts',
    description: 'Luxury stays with premium amenities',
    icon: Hotel,
    href: '/resorts',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    id: 2,
    title: 'Homestays',
    description: 'Authentic local experiences',
    icon: Home,
    href: '/homestays',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  {
    id: 3,
    title: 'Rentals',
    description: 'Vehicles for your journey',
    icon: Car,
    href: '/rentals',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
  {
    id: 4,
    title: 'Destinations',
    description: 'Explore activities & tours',
    icon: MapPin,
    href: '/destinations',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
  },
  {
    id: 5,
    title: 'Services',
    description: 'Guides, taxis & more',
    icon: Briefcase,
    href: '/services',
    color: 'text-teal-600',
    bgColor: 'bg-teal-50',
  },
];

export function CategoryCards() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-night-blue mb-4">
            Explore Wayanad
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need for the perfect Wayanad getaway
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link key={category.id} href={category.href}>
                <Card className="group p-6 text-center hover:shadow-premium-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full">
                  <div
                    className={`w-16 h-16 ${category.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <Icon className={`w-8 h-8 ${category.color}`} />
                  </div>
                  <h3 className="font-bold text-lg text-night-blue mb-2">
                    {category.title}
                  </h3>
                  <p className="text-sm text-gray-600">{category.description}</p>
                  <div className="mt-4 text-sand-tan font-medium text-sm group-hover:text-sand-tan-dark">
                    Explore →
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
