import apiClient from './client';
import type { PaginatedResponse } from './types';

export interface Rental {
  id: number;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  vehicle_type: 'car' | 'bike' | 'scooter' | 'bicycle' | 'tempo' | 'bus';
  brand: string;
  model: string;
  year: number;
  transmission: 'manual' | 'automatic';
  fuel_type: 'petrol' | 'diesel' | 'electric' | 'hybrid';
  seating_capacity: number;
  ac_available: boolean;
  hourly_rate?: string;
  daily_rate: string;
  weekly_rate?: string;
  monthly_rate?: string;
  security_deposit: string;
  fuel_policy: 'full_to_full' | 'same_to_same' | 'included';
  mileage_limit?: number;
  extra_km_charge?: string;
  insurance_included: boolean;
  driver_available: boolean;
  driver_charge_per_day?: string;
  minimum_rental_hours?: number;
  phone: string;
  email?: string;
  pickup_locations: string[];
  dropoff_locations: string[];
  address_line_1: string;
  city: string;
  state: string;
  postal_code: string;
  latitude?: string;
  longitude?: string;
  cover_image: string;
  gallery_images: string[];
  is_active: boolean;
  is_featured: boolean;
  is_verified: boolean;
  average_rating?: string;
  total_reviews?: string;
  created_at: string;
  updated_at: string;
}

export interface RentalFilterParams {
  city?: string;
  vehicle_type?: 'car' | 'bike' | 'scooter' | 'bicycle' | 'tempo' | 'bus';
  transmission?: 'manual' | 'automatic';
  fuel_type?: 'petrol' | 'diesel' | 'electric' | 'hybrid';
  ac_available?: boolean;
  driver_available?: boolean;
  is_featured?: boolean;
  is_verified?: boolean;
  search?: string;
  ordering?: string;
  page?: number;
}

export const rentalsApi = {
  /**
   * Get all rentals with optional filters
   */
  getAll: async (params?: RentalFilterParams): Promise<PaginatedResponse<Rental>> => {
    return apiClient.get('rentals/rentals/', { params });
  },

  /**
   * Get single rental by slug
   */
  getBySlug: async (slug: string): Promise<Rental> => {
    return apiClient.get(`rentals/rentals/${slug}/`);
  },

  /**
   * Get featured rentals
   */
  getFeatured: async (): Promise<Rental[]> => {
    return apiClient.get('rentals/rentals/featured/');
  },

  /**
   * Check availability
   */
  checkAvailability: async (
    slug: string,
    pickupDate: string,
    dropoffDate: string
  ): Promise<{ available: boolean; rental: Rental }> => {
    return apiClient.get(`rentals/rentals/${slug}/availability/`, {
      params: { pickup_date: pickupDate, dropoff_date: dropoffDate }
    });
  },
};
