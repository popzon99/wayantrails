import apiClient from './client';
import type {
  Resort,
  PaginatedResponse,
  ResortFilterParams,
  RoomType,
  ResortAmenity
} from './types';

export const resortsApi = {
  /**
   * Get all resorts with optional filters
   */
  getAll: async (params?: ResortFilterParams): Promise<PaginatedResponse<Resort>> => {
    return apiClient.get('resorts/resorts/', { params });
  },

  /**
   * Get single resort by slug
   */
  getBySlug: async (slug: string): Promise<Resort> => {
    return apiClient.get(`resorts/resorts/${slug}/`);
  },

  /**
   * Get featured resorts
   */
  getFeatured: async (): Promise<Resort[]> => {
    return apiClient.get('resorts/resorts/featured/');
  },

  /**
   * Check availability for specific dates
   */
  checkAvailability: async (
    slug: string,
    checkIn: string,
    checkOut: string
  ): Promise<Resort> => {
    return apiClient.get(`resorts/resorts/${slug}/availability/`, {
      params: { check_in: checkIn, check_out: checkOut }
    });
  },

  /**
   * Get all amenities with optional filters
   */
  getAmenities: async (params?: {
    category?: string;
    search?: string;
    page?: number
  }): Promise<PaginatedResponse<ResortAmenity>> => {
    return apiClient.get('resorts/amenities/', { params });
  },

  /**
   * Get single amenity by ID
   */
  getAmenityById: async (id: number): Promise<ResortAmenity> => {
    return apiClient.get(`resorts/amenities/${id}/`);
  },

  /**
   * Get room types with optional filters
   */
  getRoomTypes: async (params?: {
    resort?: number;
    room_type?: string;
    is_active?: boolean;
    page?: number
  }): Promise<PaginatedResponse<RoomType>> => {
    return apiClient.get('resorts/room-types/', { params });
  },

  /**
   * Get single room type by ID
   */
  getRoomTypeById: async (id: number): Promise<RoomType> => {
    return apiClient.get(`resorts/room-types/${id}/`);
  },
};
