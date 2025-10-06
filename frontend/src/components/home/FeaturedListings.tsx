'use client';

import { useFeaturedResorts, useFeaturedHomestays } from '@/lib/hooks';
import { ListingCard } from '@/components/listings';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

export function FeaturedListings() {
  const { resorts, isLoading: resortsLoading } = useFeaturedResorts();
  const { homestays, isLoading: homestaysLoading } = useFeaturedHomestays();

  return (
    <section className="py-16 bg-[#f5f5f5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Featured Resorts */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-display font-bold text-[#2d545e] mb-2">
                Featured Resorts
              </h2>
              <p className="text-gray-600">
                Handpicked luxury stays for an unforgettable experience
              </p>
            </div>
            <Link
              href="/resorts"
              className="flex items-center gap-1 text-[#e1b382] hover:text-[#d4a571] font-medium group"
            >
              View All
              <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {resortsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 h-56 rounded-t-xl"></div>
                  <div className="bg-white p-4 rounded-b-xl space-y-3">
                    <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : resorts && resorts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resorts.slice(0, 3).map((resort) => (
                <ListingCard
                  key={resort.id}
                  id={resort.id}
                  name={resort.name}
                  slug={resort.slug}
                  type="resort"
                  image={resort.cover_image}
                  location={`${resort.city}, ${resort.state}`}
                  rating={resort.average_rating}
                  totalReviews={resort.total_reviews}
                  price={resort.price_range_min}
                  priceLabel="from / night"
                  shortDescription={resort.short_description}
                  badges={[
                    resort.resort_type,
                    `${resort.star_rating}★`,
                    `${resort.total_rooms} rooms`,
                  ]}
                  isVerified={resort.is_verified}
                  isFeatured={resort.is_featured}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              No featured resorts available
            </div>
          )}
        </div>

        {/* Featured Homestays */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-display font-bold text-[#2d545e] mb-2">
                Authentic Homestays
              </h2>
              <p className="text-gray-600">
                Experience local culture with verified host families
              </p>
            </div>
            <Link
              href="/homestays"
              className="flex items-center gap-1 text-[#e1b382] hover:text-[#d4a571] font-medium group"
            >
              View All
              <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {homestaysLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 h-56 rounded-t-xl"></div>
                  <div className="bg-white p-4 rounded-b-xl space-y-3">
                    <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : homestays && homestays.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {homestays.slice(0, 3).map((homestay) => (
                <ListingCard
                  key={homestay.id}
                  id={homestay.id}
                  name={homestay.name}
                  slug={homestay.slug}
                  type="homestay"
                  image={homestay.cover_image}
                  location={`${homestay.city}, ${homestay.state}`}
                  rating={homestay.average_rating}
                  totalReviews={homestay.total_reviews}
                  price={homestay.price_per_night}
                  priceLabel="per night"
                  shortDescription={homestay.short_description}
                  badges={[
                    homestay.homestay_type,
                    homestay.provides_meals ? 'Meals' : '',
                    homestay.pet_friendly ? 'Pet Friendly' : '',
                  ].filter(Boolean)}
                  isVerified={homestay.is_verified}
                  isFeatured={homestay.is_featured}
                  maxGuests={homestay.max_guests}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              No featured homestays available
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
