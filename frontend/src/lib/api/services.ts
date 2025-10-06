import apiClient from './client';
import type { PaginatedResponse } from './types';

export interface Service {
  id: number;
  name: string;
  slug: string;
  service_type: 'guide' | 'taxi' | 'photographer' | 'other';
  description: string;
  short_description: string;
  provider_name: string;
  provider_phone: string;
  provider_email?: string;
  experience_years: number;
  languages_spoken: string[];
  specializations: string[];
  hourly_rate?: string;
  daily_rate?: string;
  fixed_price?: string;
  price_negotiable: boolean;
  availability_days: string[];
  advance_booking_hours: number;
  cancellation_policy?: string;
  portfolio_images: string[];
  certifications: string[];
  address_line_1: string;
  city: string;
  state: string;
  postal_code: string;
  cover_image: string;
  is_active: boolean;
  is_featured: boolean;
  is_verified: boolean;
  average_rating?: string;
  total_reviews?: string;
  created_at: string;
  updated_at: string;
}

export interface ServiceFilterParams {
  city?: string;
  service_type?: 'guide' | 'taxi' | 'photographer' | 'other';
  is_featured?: boolean;
  is_verified?: boolean;
  search?: string;
  ordering?: string;
  page?: number;
}

export const servicesApi = {
  /**
   * Get all services with optional filters
   */
  getAll: async (params?: ServiceFilterParams): Promise<PaginatedResponse<Service>> => {
    return apiClient.get('services/services/', { params });
  },

  /**
   * Get single service by slug
   */
  getBySlug: async (slug: string): Promise<Service> => {
    return apiClient.get(`services/services/${slug}/`);
  },

  /**
   * Get featured services
   */
  getFeatured: async (): Promise<Service[]> => {
    return apiClient.get('services/services/featured/');
  },

  /**
   * Get services by type
   */
  getByType: async (serviceType: 'guide' | 'taxi' | 'photographer' | 'other'): Promise<Service[]> => {
    return apiClient.get('services/services/', {
      params: { service_type: serviceType }
    });
  },

  /**
   * Check availability for specific date
   */
  checkAvailability: async (
    slug: string,
    date: string
  ): Promise<{ available: boolean; service: Service }> => {
    return apiClient.get(`services/services/${slug}/availability/`, {
      params: { date }
    });
  },
};
