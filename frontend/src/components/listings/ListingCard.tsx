'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart, MapPin, Star, Users } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { cn } from '@/lib/utils/cn';
import { useState } from 'react';

interface ListingCardProps {
  id: number;
  name: string;
  slug: string;
  type: 'resort' | 'homestay' | 'rental' | 'destination' | 'service';
  image: string;
  location: string;
  rating?: string;
  totalReviews?: string;
  price: string;
  priceLabel?: string;
  shortDescription?: string;
  badges?: string[];
  isVerified?: boolean;
  isFeatured?: boolean;
  maxGuests?: number;
  className?: string;
}

export function ListingCard({
  id,
  name,
  slug,
  type,
  image,
  location,
  rating,
  totalReviews,
  price,
  priceLabel = 'per night',
  shortDescription,
  badges = [],
  isVerified = false,
  isFeatured = false,
  maxGuests,
  className,
}: ListingCardProps) {
  const [imageError, setImageError] = useState(false);

  const getTypeUrl = () => {
    const typeMap = {
      resort: '/resorts',
      homestay: '/homestays',
      rental: '/rentals',
      destination: '/destinations',
      service: '/services',
    };
    return `${typeMap[type]}/${slug}`;
  };

  const imageSrc = imageError || !image
    ? 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'
    : image;

  return (
    <Card
      className={cn(
        'group overflow-hidden hover:shadow-premium-lg transition-all duration-300',
        className
      )}
    >
      {/* Image Section */}
      <Link href={getTypeUrl()} className="relative block">
        <div className="relative w-full h-56 overflow-hidden bg-gray-200">
          <Image
            src={imageSrc}
            alt={name}
            fill
            style={{ objectFit: 'cover' }}
            className="transition-transform duration-300 group-hover:scale-110"
            onError={() => setImageError(true)}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={false}
          />

          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              // TODO: Add to wishlist logic
            }}
            className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-md"
          >
            <Heart className="w-5 h-5 text-gray-600 hover:text-red-500" />
          </button>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {isVerified && (
              <Badge variant="success" className="shadow-md">
                Verified
              </Badge>
            )}
            {isFeatured && (
              <Badge variant="primary" className="shadow-md">
                Featured
              </Badge>
            )}
          </div>
        </div>
      </Link>

      {/* Content Section */}
      <div className="p-4">
        {/* Title & Location */}
        <Link href={getTypeUrl()}>
          <h3 className="font-bold text-lg mb-1 line-clamp-1 hover:text-sand-tan transition-colors">
            {name}
          </h3>
        </Link>
        <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
          <MapPin className="w-4 h-4" />
          <span className="line-clamp-1">{location}</span>
        </div>

        {/* Description */}
        {shortDescription && (
          <p className="text-sm text-gray-700 line-clamp-2 mb-3">
            {shortDescription}
          </p>
        )}

        {/* Badges/Tags */}
        {badges.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {badges.slice(0, 3).map((badge, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {badge}
              </Badge>
            ))}
          </div>
        )}

        {/* Rating & Price */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            {rating && (
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold text-sm">{rating}</span>
                {totalReviews && (
                  <span className="text-xs text-gray-500">
                    ({totalReviews})
                  </span>
                )}
              </div>
            )}
            {maxGuests && (
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Users className="w-4 h-4" />
                <span>{maxGuests}</span>
              </div>
            )}
          </div>

          <div className="text-right">
            <div className="text-xs text-gray-500">{priceLabel}</div>
            <div className="font-bold text-lg text-night-blue">₹{price}</div>
          </div>
        </div>

        {/* CTA Button */}
        <Link href={getTypeUrl()}>
          <button className="w-full mt-3 bg-sand-tan hover:bg-sand-tan-dark text-white py-2 rounded-lg transition-colors font-medium">
            View Details
          </button>
        </Link>
      </div>
    </Card>
  );
}
