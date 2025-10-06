/**
 * Nominatim Geocoding Service
 * FREE geocoding service from OpenStreetMap (no API key required)
 */

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';

// User agent required by Nominatim usage policy
const USER_AGENT = 'WayanTrails/1.0';

interface NominatimResult {
  lat: string;
  lon: string;
  display_name: string;
  address: {
    road?: string;
    village?: string;
    town?: string;
    city?: string;
    state?: string;
    postcode?: string;
    country?: string;
  };
  place_id: string;
  osm_type: string;
  osm_id: string;
}

interface GeocodingResult {
  latitude: number;
  longitude: number;
  displayName: string;
  address: {
    road?: string;
    village?: string;
    town?: string;
    city?: string;
    state?: string;
    postcode?: string;
    country?: string;
  };
  placeId: string;
}

interface ReverseGeocodingResult {
  displayName: string;
  address: {
    road?: string;
    village?: string;
    town?: string;
    city?: string;
    state?: string;
    postcode?: string;
    country?: string;
  };
}

/**
 * Forward geocoding: Convert address to coordinates
 * FREE - No API key required
 *
 * @param query - Address string (e.g., "Edakkal Caves, Wayanad, Kerala")
 * @returns Geocoding result with coordinates
 */
export async function geocode(query: string): Promise<GeocodingResult | null> {
  try {
    const params = new URLSearchParams({
      q: query,
      format: 'json',
      addressdetails: '1',
      limit: '1',
    });

    const response = await fetch(`${NOMINATIM_BASE_URL}/search?${params}`, {
      headers: {
        'User-Agent': USER_AGENT,
      },
    });

    if (!response.ok) {
      throw new Error(`Nominatim API error: ${response.status}`);
    }

    const data: NominatimResult[] = await response.json();

    if (data.length === 0) {
      return null;
    }

    const result = data[0];

    return {
      latitude: parseFloat(result.lat),
      longitude: parseFloat(result.lon),
      displayName: result.display_name,
      address: result.address,
      placeId: result.place_id,
    };
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}

/**
 * Reverse geocoding: Convert coordinates to address
 * FREE - No API key required
 *
 * @param latitude - Latitude coordinate
 * @param longitude - Longitude coordinate
 * @returns Address information
 */
export async function reverseGeocode(
  latitude: number,
  longitude: number
): Promise<ReverseGeocodingResult | null> {
  try {
    const params = new URLSearchParams({
      lat: latitude.toString(),
      lon: longitude.toString(),
      format: 'json',
      addressdetails: '1',
    });

    const response = await fetch(`${NOMINATIM_BASE_URL}/reverse?${params}`, {
      headers: {
        'User-Agent': USER_AGENT,
      },
    });

    if (!response.ok) {
      throw new Error(`Nominatim API error: ${response.status}`);
    }

    const data: NominatimResult = await response.json();

    return {
      displayName: data.display_name,
      address: data.address,
    };
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return null;
  }
}

/**
 * Search for places by name and location
 * FREE - No API key required
 *
 * @param query - Search query
 * @param boundingBox - Optional bounding box [minLat, maxLat, minLon, maxLon]
 * @returns Array of geocoding results
 */
export async function searchPlaces(
  query: string,
  boundingBox?: [number, number, number, number]
): Promise<GeocodingResult[]> {
  try {
    const params = new URLSearchParams({
      q: query,
      format: 'json',
      addressdetails: '1',
      limit: '10',
    });

    if (boundingBox) {
      params.append('viewbox', boundingBox.join(','));
      params.append('bounded', '1');
    }

    const response = await fetch(`${NOMINATIM_BASE_URL}/search?${params}`, {
      headers: {
        'User-Agent': USER_AGENT,
      },
    });

    if (!response.ok) {
      throw new Error(`Nominatim API error: ${response.status}`);
    }

    const data: NominatimResult[] = await response.json();

    return data.map((result) => ({
      latitude: parseFloat(result.lat),
      longitude: parseFloat(result.lon),
      displayName: result.display_name,
      address: result.address,
      placeId: result.place_id,
    }));
  } catch (error) {
    console.error('Place search error:', error);
    return [];
  }
}

/**
 * Geocode with Wayanad bias (searches within Wayanad district first)
 *
 * @param query - Search query
 * @returns Geocoding result biased to Wayanad area
 */
export async function geocodeWayanad(query: string): Promise<GeocodingResult | null> {
  // Wayanad bounding box (approximate)
  const wayanadBounds: [number, number, number, number] = [
    11.6, // min latitude
    11.9, // max latitude
    75.9, // min longitude
    76.3, // max longitude
  ];

  const results = await searchPlaces(`${query}, Wayanad, Kerala`, wayanadBounds);

  return results.length > 0 ? results[0] : null;
}
