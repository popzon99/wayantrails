/**
 * Overpass API Service
 * FREE service to query OpenStreetMap points of interest (no API key required)
 */

const OVERPASS_API_URL = 'https://overpass-api.de/api/interpreter';

// Simple in-memory cache to avoid hitting rate limits
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

// Rate limiting: delay between requests
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 2000; // 2 seconds between requests

export interface NearbyPlace {
  id: string;
  type: string;
  lat: number;
  lon: number;
  name?: string;
  tags: {
    [key: string]: string;
  };
  distance?: number;
}

export interface NearbyPlacesOptions {
  latitude: number;
  longitude: number;
  radius?: number; // in meters, default 5000 (5km)
  types?: string[]; // e.g., ['tourism', 'restaurant', 'hotel']
}

/**
 * Query nearby places using Overpass API
 * FREE - No API key required
 *
 * @param options - Search options
 * @returns Array of nearby places
 */
export async function getNearbyPlaces(
  options: NearbyPlacesOptions
): Promise<NearbyPlace[]> {
  const { latitude, longitude, radius = 5000, types = ['tourism'] } = options;

  // Create cache key
  const cacheKey = `${latitude},${longitude},${radius},${types.join(',')}`;

  // Check cache first
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  try {
    // Rate limiting: wait if needed
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;
    if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
      await new Promise(resolve => setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest));
    }
    lastRequestTime = Date.now();

    // Build Overpass QL query
    const typeQueries = types
      .map((type) => `node["${type}"](around:${radius},${latitude},${longitude});`)
      .join('\n');

    const query = `
      [out:json][timeout:25];
      (
        ${typeQueries}
      );
      out body;
      >;
      out skel qt;
    `;

    const response = await fetch(OVERPASS_API_URL, {
      method: 'POST',
      body: `data=${encodeURIComponent(query)}`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (!response.ok) {
      throw new Error(`Overpass API error: ${response.status}`);
    }

    const data = await response.json();

    // Transform and calculate distances
    const places: NearbyPlace[] = data.elements
      .filter((element: any) => element.type === 'node' && element.tags?.name)
      .map((element: any) => {
        const distance = calculateDistance(
          latitude,
          longitude,
          element.lat,
          element.lon
        );

        return {
          id: element.id.toString(),
          type: element.type,
          lat: element.lat,
          lon: element.lon,
          name: element.tags.name,
          tags: element.tags,
          distance: Math.round(distance),
        };
      })
      .sort((a: NearbyPlace, b: NearbyPlace) => (a.distance || 0) - (b.distance || 0));

    // Cache the result
    cache.set(cacheKey, { data: places, timestamp: Date.now() });

    return places;
  } catch (error) {
    console.error('Overpass API error:', error);

    // If rate limited (429) or server error (504, 503, 500), return sample data as fallback
    if (error instanceof Error && (
      error.message.includes('429') ||
      error.message.includes('504') ||
      error.message.includes('503') ||
      error.message.includes('500')
    )) {
      console.log('Overpass API unavailable - returning sample data for demo purposes');
      return getSamplePlaces(latitude, longitude, types);
    }

    // Return empty array on other errors (don't cache errors)
    return [];
  }
}

/**
 * Generate sample/demo places when API is rate-limited
 * This provides fallback data for testing and demo purposes
 */
function getSamplePlaces(latitude: number, longitude: number, types: string[]): NearbyPlace[] {
  const sampleData: { [key: string]: Array<{ name: string; category: string; tags: any }> } = {
    tourism: [
      { name: 'Edakkal Caves', category: 'attraction', tags: { tourism: 'attraction', name: 'Edakkal Caves' } },
      { name: 'Soochipara Falls', category: 'attraction', tags: { tourism: 'attraction', waterway: 'waterfall', name: 'Soochipara Falls' } },
      { name: 'Chembra Peak', category: 'attraction', tags: { tourism: 'attraction', natural: 'peak', name: 'Chembra Peak' } },
      { name: 'Banasura Sagar Dam', category: 'attraction', tags: { tourism: 'attraction', name: 'Banasura Sagar Dam' } },
      { name: 'Pookode Lake', category: 'viewpoint', tags: { tourism: 'viewpoint', name: 'Pookode Lake' } },
      { name: 'Meenmutty Falls', category: 'attraction', tags: { tourism: 'attraction', waterway: 'waterfall', name: 'Meenmutty Falls' } },
    ],
    amenity: [
      { name: 'Wilton Restaurant', category: 'restaurant', tags: { amenity: 'restaurant', cuisine: 'indian', name: 'Wilton Restaurant' } },
      { name: 'Cafe Robusta', category: 'cafe', tags: { amenity: 'cafe', name: 'Cafe Robusta' } },
      { name: 'Udupi Pure Veg', category: 'restaurant', tags: { amenity: 'restaurant', cuisine: 'vegetarian', name: 'Udupi Pure Veg' } },
      { name: 'The Coffee Grove', category: 'cafe', tags: { amenity: 'cafe', name: 'The Coffee Grove' } },
      { name: 'Hotel Mint Flower', category: 'hotel', tags: { tourism: 'hotel', name: 'Hotel Mint Flower' } },
      { name: 'Green Gates Hotel', category: 'hotel', tags: { tourism: 'hotel', name: 'Green Gates Hotel' } },
    ],
  };

  const relevantData: NearbyPlace[] = [];

  types.forEach((type, index) => {
    const items = sampleData[type] || [];
    items.forEach((item, itemIndex) => {
      // Generate realistic coordinates around the center point
      const latOffset = (Math.random() - 0.5) * 0.05; // ~5km radius
      const lonOffset = (Math.random() - 0.5) * 0.05;
      const placeLat = latitude + latOffset;
      const placeLon = longitude + lonOffset;

      const distance = calculateDistance(latitude, longitude, placeLat, placeLon);

      relevantData.push({
        id: `sample-${type}-${itemIndex}`,
        type: 'node',
        lat: placeLat,
        lon: placeLon,
        name: item.name,
        tags: item.tags,
        distance: Math.round(distance),
      });
    });
  });

  return relevantData.sort((a, b) => (a.distance || 0) - (b.distance || 0));
}

/**
 * Get nearby tourist attractions
 *
 * @param latitude - Latitude coordinate
 * @param longitude - Longitude coordinate
 * @param radius - Search radius in meters (default 5000)
 * @returns Array of tourist attractions
 */
export async function getNearbyAttractions(
  latitude: number,
  longitude: number,
  radius: number = 5000
): Promise<NearbyPlace[]> {
  return getNearbyPlaces({
    latitude,
    longitude,
    radius,
    types: [
      'tourism=attraction',
      'tourism=viewpoint',
      'tourism=museum',
      'tourism=gallery',
      'natural=waterfall',
      'natural=peak',
    ],
  });
}

/**
 * Get nearby restaurants and cafes
 *
 * @param latitude - Latitude coordinate
 * @param longitude - Longitude coordinate
 * @param radius - Search radius in meters (default 3000)
 * @returns Array of restaurants and cafes
 */
export async function getNearbyRestaurants(
  latitude: number,
  longitude: number,
  radius: number = 3000
): Promise<NearbyPlace[]> {
  return getNearbyPlaces({
    latitude,
    longitude,
    radius,
    types: ['amenity=restaurant', 'amenity=cafe', 'amenity=fast_food'],
  });
}

/**
 * Get nearby accommodations
 *
 * @param latitude - Latitude coordinate
 * @param longitude - Longitude coordinate
 * @param radius - Search radius in meters (default 5000)
 * @returns Array of hotels and guesthouses
 */
export async function getNearbyAccommodations(
  latitude: number,
  longitude: number,
  radius: number = 5000
): Promise<NearbyPlace[]> {
  return getNearbyPlaces({
    latitude,
    longitude,
    radius,
    types: ['tourism=hotel', 'tourism=guest_house', 'tourism=hostel'],
  });
}

/**
 * Get all nearby amenities (attractions, restaurants, hotels)
 *
 * @param latitude - Latitude coordinate
 * @param longitude - Longitude coordinate
 * @param radius - Search radius in meters (default 5000)
 * @returns Categorized nearby places
 */
export async function getAllNearbyAmenities(
  latitude: number,
  longitude: number,
  radius: number = 5000
): Promise<{
  attractions: NearbyPlace[];
  restaurants: NearbyPlace[];
  accommodations: NearbyPlace[];
}> {
  // Make requests sequentially to avoid rate limiting
  // The caching and rate limiting in getNearbyPlaces will handle this efficiently
  const attractions = await getNearbyAttractions(latitude, longitude, radius);
  const restaurants = await getNearbyRestaurants(latitude, longitude, radius);
  const accommodations = await getNearbyAccommodations(latitude, longitude, radius);

  return {
    attractions,
    restaurants,
    accommodations,
  };
}

/**
 * Calculate distance between two coordinates using Haversine formula
 *
 * @param lat1 - First latitude
 * @param lon1 - First longitude
 * @param lat2 - Second latitude
 * @param lon2 - Second longitude
 * @returns Distance in meters
 */
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Format distance for display
 *
 * @param meters - Distance in meters
 * @returns Formatted distance string
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  return `${(meters / 1000).toFixed(1)} km`;
}

/**
 * Get category icon based on place type
 *
 * @param tags - Place tags from OSM
 * @returns Icon name for display
 */
export function getCategoryIcon(tags: { [key: string]: string }): string {
  if (tags.tourism === 'attraction' || tags.tourism === 'viewpoint') {
    return 'camera';
  }
  if (tags.tourism === 'museum' || tags.tourism === 'gallery') {
    return 'building';
  }
  if (tags.natural === 'waterfall') {
    return 'droplet';
  }
  if (tags.natural === 'peak') {
    return 'mountain';
  }
  if (tags.amenity === 'restaurant' || tags.amenity === 'cafe') {
    return 'utensils';
  }
  if (tags.tourism === 'hotel' || tags.tourism === 'guest_house') {
    return 'bed';
  }
  return 'map-pin';
}

/**
 * Get place category name
 *
 * @param tags - Place tags from OSM
 * @returns Category name
 */
export function getCategoryName(tags: { [key: string]: string }): string {
  if (tags.tourism) {
    return tags.tourism.charAt(0).toUpperCase() + tags.tourism.slice(1).replace('_', ' ');
  }
  if (tags.natural) {
    return tags.natural.charAt(0).toUpperCase() + tags.natural.slice(1);
  }
  if (tags.amenity) {
    return tags.amenity.charAt(0).toUpperCase() + tags.amenity.slice(1).replace('_', ' ');
  }
  return 'Place';
}
