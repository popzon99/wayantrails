import { useState, useEffect } from 'react';
import { destinationsApi, type Destination, type DestinationFilterParams } from '@/lib/api/destinations';
import type { PaginatedResponse } from '@/lib/api/types';

export function useDestinations(params?: DestinationFilterParams) {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        setIsLoading(true);
        setIsError(false);
        const response: PaginatedResponse<Destination> = await destinationsApi.getAll(params);
        setDestinations(response.results);
      } catch (err) {
        setIsError(true);
        setError(err as Error);
        console.error('Error fetching destinations:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDestinations();
  }, [params?.city, params?.destination_type, params?.search, params?.page]);

  return { destinations, isLoading, isError, error };
}

export function useDestination(slug: string) {
  const [destination, setDestination] = useState<Destination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!slug) return;

    const fetchDestination = async () => {
      try {
        setIsLoading(true);
        setIsError(false);
        const data = await destinationsApi.getBySlug(slug);
        setDestination(data);
      } catch (err) {
        setIsError(true);
        setError(err as Error);
        console.error('Error fetching destination:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDestination();
  }, [slug]);

  return { destination, isLoading, isError, error };
}

export function useFeaturedDestinations() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchFeaturedDestinations = async () => {
      try {
        setIsLoading(true);
        setIsError(false);
        const data = await destinationsApi.getFeatured();
        setDestinations(data);
      } catch (err) {
        setIsError(true);
        setError(err as Error);
        console.error('Error fetching featured destinations:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedDestinations();
  }, []);

  return { destinations, isLoading, isError, error };
}

/**
 * Hook to fetch nearby destinations based on location
 */
export function useNearbyDestinations(city?: string, limit: number = 4) {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchNearbyDestinations = async () => {
      try {
        setIsLoading(true);
        setIsError(false);
        const response: PaginatedResponse<Destination> = await destinationsApi.getAll({
          city,
          is_active: true,
          ordering: '-is_featured,-average_rating'
        });
        // Limit results to specified number
        setDestinations(response.results.slice(0, limit));
      } catch (err) {
        setIsError(true);
        setError(err as Error);
        console.error('Error fetching nearby destinations:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNearbyDestinations();
  }, [city, limit]);

  return { destinations, isLoading, isError, error };
}
