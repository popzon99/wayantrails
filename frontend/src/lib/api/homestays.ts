import apiClient from './client';
import type {
  Homestay,
  PaginatedResponse,
  HomestayFilterParams,
  HomestayRoom,
  MealPlan,
  Experience,
  HomestayAmenity
} from './types';

export const homestaysApi = {
  /**
   * Get all homestays with optional filters
   */
  getAll: async (params?: HomestayFilterParams): Promise<PaginatedResponse<Homestay>> => {
    return apiClient.get('homestays/homestays/', { params });
  },

  /**
   * Get single homestay by slug
   */
  getBySlug: async (slug: string): Promise<Homestay> => {
    return apiClient.get(`homestays/homestays/${slug}/`);
  },

  /**
   * Get featured homestays
   */
  getFeatured: async (): Promise<Homestay[]> => {
    return apiClient.get('homestays/homestays/featured/');
  },

  /**
   * Get homestay rooms with optional filters
   */
  getRooms: async (params?: {
    homestay?: number;
    room_type?: string;
    is_active?: boolean;
    page?: number
  }): Promise<PaginatedResponse<HomestayRoom>> => {
    return apiClient.get('homestays/rooms/', { params });
  },

  /**
   * Get single room by ID
   */
  getRoomById: async (id: number): Promise<HomestayRoom> => {
    return apiClient.get(`homestays/rooms/${id}/`);
  },

  /**
   * Get meal plans with optional filters
   */
  getMealPlans: async (params?: {
    homestay?: number;
    meal_type?: string;
    is_active?: boolean;
    page?: number
  }): Promise<PaginatedResponse<MealPlan>> => {
    return apiClient.get('homestays/meal-plans/', { params });
  },

  /**
   * Get single meal plan by ID
   */
  getMealPlanById: async (id: number): Promise<MealPlan> => {
    return apiClient.get(`homestays/meal-plans/${id}/`);
  },

  /**
   * Get experiences with optional filters
   */
  getExperiences: async (params?: {
    homestay?: number;
    experience_type?: string;
    is_active?: boolean;
    page?: number
  }): Promise<PaginatedResponse<Experience>> => {
    return apiClient.get('homestays/experiences/', { params });
  },

  /**
   * Get single experience by slug
   */
  getExperienceBySlug: async (slug: string): Promise<Experience> => {
    return apiClient.get(`homestays/experiences/${slug}/`);
  },

  /**
   * Get amenities with optional filters
   */
  getAmenities: async (params?: {
    category?: string;
    search?: string;
    page?: number
  }): Promise<PaginatedResponse<HomestayAmenity>> => {
    return apiClient.get('homestays/amenities/', { params });
  },

  /**
   * Get single amenity by ID
   */
  getAmenityById: async (id: number): Promise<HomestayAmenity> => {
    return apiClient.get(`homestays/amenities/${id}/`);
  },
};
