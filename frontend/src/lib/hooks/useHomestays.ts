import useSWR from 'swr';
import { homestaysApi } from '@/lib/api';
import type {
  Homestay,
  PaginatedResponse,
  HomestayFilterParams,
  HomestayRoom,
  MealPlan,
  Experience,
  HomestayAmenity
} from '@/lib/api/types';

/**
 * Hook to fetch all homestays with optional filters
 */
export function useHomestays(params?: HomestayFilterParams) {
  const { data, error, isLoading, mutate } = useSWR<PaginatedResponse<Homestay>>(
    params ? ['/api/homestays/homestays/', params] : '/api/homestays/homestays/',
    () => homestaysApi.getAll(params),
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
    }
  );

  return {
    homestays: data?.results,
    count: data?.count,
    next: data?.next,
    previous: data?.previous,
    isLoading,
    isError: error,
    mutate,
  };
}

/**
 * Hook to fetch a single homestay by slug
 */
export function useHomestay(slug: string | null) {
  const { data, error, isLoading, mutate } = useSWR<Homestay>(
    slug ? `/api/homestays/homestays/${slug}/` : null,
    () => homestaysApi.getBySlug(slug!),
    {
      revalidateOnFocus: false,
    }
  );

  return {
    homestay: data,
    isLoading,
    isError: error,
    mutate,
  };
}

/**
 * Hook to fetch featured homestays
 */
export function useFeaturedHomestays() {
  const { data, error, isLoading, mutate } = useSWR<Homestay[]>(
    '/api/homestays/homestays/featured/',
    () => homestaysApi.getFeatured(),
    {
      revalidateOnFocus: false,
      dedupingInterval: 10000,
    }
  );

  return {
    homestays: data,
    isLoading,
    isError: error,
    mutate,
  };
}

/**
 * Hook to fetch homestay rooms
 */
export function useHomestayRooms(params?: {
  homestay?: number;
  room_type?: string;
  is_active?: boolean;
  page?: number;
}) {
  const { data, error, isLoading, mutate } = useSWR<PaginatedResponse<HomestayRoom>>(
    params ? ['/api/homestays/rooms/', params] : '/api/homestays/rooms/',
    () => homestaysApi.getRooms(params),
    {
      revalidateOnFocus: false,
    }
  );

  return {
    rooms: data?.results,
    count: data?.count,
    isLoading,
    isError: error,
    mutate,
  };
}

/**
 * Hook to fetch meal plans
 */
export function useMealPlans(params?: {
  homestay?: number;
  meal_type?: string;
  is_active?: boolean;
  page?: number;
}) {
  const { data, error, isLoading, mutate } = useSWR<PaginatedResponse<MealPlan>>(
    params ? ['/api/homestays/meal-plans/', params] : '/api/homestays/meal-plans/',
    () => homestaysApi.getMealPlans(params),
    {
      revalidateOnFocus: false,
    }
  );

  return {
    mealPlans: data?.results,
    count: data?.count,
    isLoading,
    isError: error,
    mutate,
  };
}

/**
 * Hook to fetch experiences
 */
export function useExperiences(params?: {
  homestay?: number;
  experience_type?: string;
  is_active?: boolean;
  page?: number;
}) {
  const { data, error, isLoading, mutate } = useSWR<PaginatedResponse<Experience>>(
    params ? ['/api/homestays/experiences/', params] : '/api/homestays/experiences/',
    () => homestaysApi.getExperiences(params),
    {
      revalidateOnFocus: false,
    }
  );

  return {
    experiences: data?.results,
    count: data?.count,
    isLoading,
    isError: error,
    mutate,
  };
}

/**
 * Hook to fetch a single experience by slug
 */
export function useExperience(slug: string | null) {
  const { data, error, isLoading, mutate } = useSWR<Experience>(
    slug ? `/api/homestays/experiences/${slug}/` : null,
    () => homestaysApi.getExperienceBySlug(slug!),
    {
      revalidateOnFocus: false,
    }
  );

  return {
    experience: data,
    isLoading,
    isError: error,
    mutate,
  };
}

/**
 * Hook to fetch homestay amenities
 */
export function useHomestayAmenities(params?: {
  category?: string;
  search?: string;
  page?: number;
}) {
  const { data, error, isLoading, mutate } = useSWR<PaginatedResponse<HomestayAmenity>>(
    params ? ['/api/homestays/amenities/', params] : '/api/homestays/amenities/',
    () => homestaysApi.getAmenities(params),
    {
      revalidateOnFocus: false,
      dedupingInterval: 30000,
    }
  );

  return {
    amenities: data?.results,
    count: data?.count,
    isLoading,
    isError: error,
    mutate,
  };
}
