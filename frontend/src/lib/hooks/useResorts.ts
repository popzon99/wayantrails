import useSWR from 'swr';
import { resortsApi } from '@/lib/api';
import type {
  Resort,
  PaginatedResponse,
  ResortFilterParams,
  RoomType,
  ResortAmenity
} from '@/lib/api/types';

/**
 * Hook to fetch all resorts with optional filters
 */
export function useResorts(params?: ResortFilterParams) {
  const { data, error, isLoading, mutate } = useSWR<PaginatedResponse<Resort>>(
    params ? ['/api/resorts/resorts/', params] : '/api/resorts/resorts/',
    () => resortsApi.getAll(params),
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
    }
  );

  return {
    resorts: data?.results,
    count: data?.count,
    next: data?.next,
    previous: data?.previous,
    isLoading,
    isError: error,
    mutate,
  };
}

/**
 * Hook to fetch a single resort by slug
 */
export function useResort(slug: string | null) {
  const { data, error, isLoading, mutate } = useSWR<Resort>(
    slug ? `/api/resorts/resorts/${slug}/` : null,
    () => resortsApi.getBySlug(slug!),
    {
      revalidateOnFocus: false,
    }
  );

  return {
    resort: data,
    isLoading,
    isError: error,
    mutate,
  };
}

/**
 * Hook to fetch featured resorts
 */
export function useFeaturedResorts() {
  const { data, error, isLoading, mutate } = useSWR<Resort[]>(
    '/api/resorts/resorts/featured/',
    () => resortsApi.getFeatured(),
    {
      revalidateOnFocus: false,
      dedupingInterval: 10000,
    }
  );

  return {
    resorts: data,
    isLoading,
    isError: error,
    mutate,
  };
}

/**
 * Hook to check resort availability
 */
export function useResortAvailability(
  slug: string | null,
  checkIn: string | null,
  checkOut: string | null
) {
  const shouldFetch = slug && checkIn && checkOut;

  const { data, error, isLoading, mutate } = useSWR<Resort>(
    shouldFetch
      ? `/api/resorts/resorts/${slug}/availability/?check_in=${checkIn}&check_out=${checkOut}`
      : null,
    () => resortsApi.checkAvailability(slug!, checkIn!, checkOut!),
    {
      revalidateOnFocus: false,
    }
  );

  return {
    availability: data,
    isLoading,
    isError: error,
    mutate,
  };
}

/**
 * Hook to fetch resort amenities
 */
export function useResortAmenities(params?: {
  category?: string;
  search?: string;
  page?: number;
}) {
  const { data, error, isLoading, mutate } = useSWR<PaginatedResponse<ResortAmenity>>(
    params ? ['/api/resorts/amenities/', params] : '/api/resorts/amenities/',
    () => resortsApi.getAmenities(params),
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

/**
 * Hook to fetch room types
 */
export function useRoomTypes(params?: {
  resort?: number;
  room_type?: string;
  is_active?: boolean;
  page?: number;
}) {
  const { data, error, isLoading, mutate } = useSWR<PaginatedResponse<RoomType>>(
    params ? ['/api/resorts/room-types/', params] : '/api/resorts/room-types/',
    () => resortsApi.getRoomTypes(params),
    {
      revalidateOnFocus: false,
    }
  );

  return {
    roomTypes: data?.results,
    count: data?.count,
    isLoading,
    isError: error,
    mutate,
  };
}

/**
 * Hook to fetch similar/nearby resorts based on location
 */
export function useSimilarResorts(city?: string, excludeSlug?: string, limit: number = 4) {
  const { data, error, isLoading, mutate } = useSWR<PaginatedResponse<Resort>>(
    city ? [`/api/resorts/similar/`, city, excludeSlug, limit] : null,
    () => resortsApi.getAll({
      city,
      is_active: true,
      ordering: '-is_featured,-average_rating'
    }),
    {
      revalidateOnFocus: false,
      dedupingInterval: 10000,
    }
  );

  // Filter out current resort and limit results
  const similarResorts = data?.results
    ?.filter(resort => resort.slug !== excludeSlug)
    ?.slice(0, limit);

  return {
    resorts: similarResorts || [],
    isLoading,
    isError: error,
    mutate,
  };
}
