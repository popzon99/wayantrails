import apiClient from './client';
import type { PaginatedResponse } from './types';

export interface Destination {
  id: number;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  destination_type: 'waterfall' | 'trek' | 'wildlife' | 'adventure' | 'cultural' | 'viewpoint';
  entry_fee: string;
  is_free_entry: boolean;
  opening_time?: string;
  closing_time?: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  latitude?: string;
  longitude?: string;
  full_address?: string;
  cover_image: string;
  gallery_images: string[];
  is_active: boolean;
  is_featured: boolean;
  is_verified: boolean;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  average_rating?: string;
  total_reviews?: number;
  created_at: string;
  updated_at: string;
  // Virtual/calculated fields for display
  duration_hours?: string;
  price_per_person?: string;
  instant_booking?: boolean;
  activities?: Activity[];
}

export interface Activity {
  id: number;
  name: string;
  slug: string;
  destination: number;
  activity_type: 'trekking' | 'boating' | 'zip_line' | 'camping' | 'safari';
  description: string;
  duration_hours: string;
  price_per_person: string;
  child_price?: string;
  max_participants: number;
  advance_booking_hours: number;
  is_active: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface DestinationFilterParams {
  city?: string;
  destination_type?: 'waterfall' | 'trek' | 'wildlife' | 'adventure' | 'cultural' | 'viewpoint';
  is_free_entry?: boolean;
  is_featured?: boolean;
  is_verified?: boolean;
  is_active?: boolean;
  search?: string;
  ordering?: string;
  page?: number;
}

export const destinationsApi = {
  /**
   * Get all destinations with optional filters
   */
  getAll: async (params?: DestinationFilterParams): Promise<PaginatedResponse<Destination>> => {
    return apiClient.get('destinations/destinations/', { params });
  },

  /**
   * Get single destination by slug
   */
  getBySlug: async (slug: string): Promise<Destination> => {
    return apiClient.get(`destinations/destinations/${slug}/`);
  },

  /**
   * Get featured destinations
   */
  getFeatured: async (): Promise<Destination[]> => {
    return apiClient.get('destinations/destinations/featured/');
  },

  /**
   * Check availability for specific date and participants
   */
  checkAvailability: async (
    slug: string,
    date: string,
    participants: number
  ): Promise<{ available: boolean; destination: Destination }> => {
    return apiClient.get(`destinations/destinations/${slug}/availability/`, {
      params: { date, participants }
    });
  },
};
