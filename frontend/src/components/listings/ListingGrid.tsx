'use client';

import { ListingCard } from './ListingCard';
import type { Resort, Homestay } from '@/lib/api/types';
import type { Rental, Destination, Service } from '@/lib/api';

type ListingType = Resort | Homestay | Rental | Destination | Service;

interface ListingGridProps {
  listings: ListingType[];
  type: 'resort' | 'homestay' | 'rental' | 'destination' | 'service';
  isLoading?: boolean;
  emptyMessage?: string;
}

export function ListingGrid({
  listings,
  type,
  isLoading = false,
  emptyMessage = 'No listings found',
}: ListingGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 h-56 rounded-t-xl"></div>
            <div className="p-4 space-y-3">
              <div className="h-5 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!listings || listings.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-2">
          <svg
            className="w-24 h-24 mx-auto"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
        </div>
        <p className="text-lg text-gray-600">{emptyMessage}</p>
        <p className="text-sm text-gray-500 mt-2">
          Try adjusting your filters or search criteria
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {listings.map((listing) => {
        const commonProps = {
          id: listing.id,
          name: listing.name,
          slug: listing.slug,
          type,
          image: listing.cover_image,
          location: `${listing.city}, ${listing.state}`,
          rating: listing.average_rating,
          totalReviews: listing.total_reviews,
          shortDescription: listing.short_description,
          isVerified: listing.is_verified,
          isFeatured: listing.is_featured,
        };

        // Type-specific props
        if (type === 'resort') {
          const resort = listing as Resort;
          return (
            <ListingCard
              key={listing.id}
              {...commonProps}
              price={resort.price_range_min}
              priceLabel="from / night"
              badges={[
                resort.resort_type,
                `${resort.star_rating}★`,
                `${resort.total_rooms} rooms`,
              ]}
              maxGuests={undefined}
            />
          );
        }

        if (type === 'homestay') {
          const homestay = listing as Homestay;
          return (
            <ListingCard
              key={listing.id}
              {...commonProps}
              price={homestay.price_per_night}
              priceLabel="per night"
              badges={[
                homestay.homestay_type,
                homestay.provides_meals ? 'Meals' : '',
                homestay.pet_friendly ? 'Pet Friendly' : '',
              ].filter(Boolean)}
              maxGuests={homestay.max_guests}
            />
          );
        }

        if (type === 'rental') {
          const rental = listing as Rental;
          return (
            <ListingCard
              key={listing.id}
              {...commonProps}
              price={rental.daily_rate}
              priceLabel="per day"
              badges={[
                rental.vehicle_type,
                rental.transmission,
                rental.fuel_type,
                rental.ac_available ? 'AC' : '',
              ].filter(Boolean)}
              maxGuests={rental.seating_capacity}
            />
          );
        }

        if (type === 'destination') {
          const destination = listing as Destination;
          return (
            <ListingCard
              key={listing.id}
              {...commonProps}
              price={destination.price_per_person}
              priceLabel="per person"
              badges={[
                destination.destination_type,
                destination.difficulty_level || '',
                `${destination.duration_hours}h`,
                destination.instant_booking ? 'Instant Booking' : '',
              ].filter(Boolean)}
              maxGuests={destination.maximum_participants}
            />
          );
        }

        if (type === 'service') {
          const service = listing as Service;
          return (
            <ListingCard
              key={listing.id}
              {...commonProps}
              price={service.daily_rate || service.hourly_rate || service.fixed_price || '0'}
              priceLabel={service.daily_rate ? 'per day' : service.hourly_rate ? 'per hour' : ''}
              badges={[
                service.service_type,
                `${service.experience_years}y exp`,
                ...service.specializations.slice(0, 2),
              ]}
            />
          );
        }

        return null;
      })}
    </div>
  );
}
