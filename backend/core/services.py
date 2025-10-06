"""
Core services for WayanTrails platform.
External API integrations and utilities.
"""
import logging
from typing import Optional, Dict, Any
from django.conf import settings
import googlemaps
from googlemaps.exceptions import ApiError, Timeout, TransportError

logger = logging.getLogger(__name__)


class GooglePlacesService:
    """Service for interacting with Google Places API."""

    def __init__(self):
        """Initialize Google Maps client."""
        api_key = getattr(settings, 'GOOGLE_PLACES_API_KEY', None)
        if not api_key:
            logger.warning("GOOGLE_PLACES_API_KEY not configured in settings")
            self.client = None
        else:
            self.client = googlemaps.Client(key=api_key)

    def search_place(self, query: str, location: Optional[tuple] = None) -> Optional[Dict[str, Any]]:
        """
        Search for a place by name and optional location.

        Args:
            query: Search query (e.g., "Edakkal Caves Wayanad")
            location: Optional tuple of (latitude, longitude) to bias search

        Returns:
            Dictionary with place details or None if not found
        """
        if not self.client:
            logger.error("Google Places client not initialized")
            return None

        try:
            # Search for the place
            if location:
                results = self.client.places(query=query, location=location)
            else:
                results = self.client.places(query=query)

            if not results.get('results'):
                logger.info(f"No results found for query: {query}")
                return None

            # Get the first result (most relevant)
            place = results['results'][0]
            place_id = place.get('place_id')

            if not place_id:
                return None

            # Get detailed information
            return self.get_place_details(place_id)

        except (ApiError, Timeout, TransportError) as e:
            logger.error(f"Google Places API error: {str(e)}")
            return None
        except Exception as e:
            logger.error(f"Unexpected error in search_place: {str(e)}")
            return None

    def get_place_details(self, place_id: str) -> Optional[Dict[str, Any]]:
        """
        Get detailed information about a place.

        Args:
            place_id: Google Places ID

        Returns:
            Dictionary with place details or None if error
        """
        if not self.client:
            logger.error("Google Places client not initialized")
            return None

        try:
            # Request specific fields to optimize API usage
            fields = [
                'name',
                'formatted_address',
                'geometry',
                'formatted_phone_number',
                'international_phone_number',
                'website',
                'opening_hours',
                'rating',
                'user_ratings_total',
                'reviews',
                'photos',
                'types',
                'url',
                'wheelchair_accessible_entrance',
                'business_status',
            ]

            result = self.client.place(place_id=place_id, fields=fields)

            if not result.get('result'):
                return None

            return self._format_place_data(result['result'])

        except (ApiError, Timeout, TransportError) as e:
            logger.error(f"Google Places API error: {str(e)}")
            return None
        except Exception as e:
            logger.error(f"Unexpected error in get_place_details: {str(e)}")
            return None

    def get_place_photos(self, place_id: str, max_photos: int = 10) -> list:
        """
        Get photo references for a place.

        Args:
            place_id: Google Places ID
            max_photos: Maximum number of photo references to return

        Returns:
            List of photo reference dictionaries
        """
        if not self.client:
            return []

        try:
            result = self.client.place(place_id=place_id, fields=['photos'])
            photos = result.get('result', {}).get('photos', [])

            photo_data = []
            for photo in photos[:max_photos]:
                photo_reference = photo.get('photo_reference')
                if photo_reference:
                    photo_data.append({
                        'photo_reference': photo_reference,
                        'height': photo.get('height'),
                        'width': photo.get('width'),
                        'attributions': photo.get('html_attributions', []),
                    })

            return photo_data

        except Exception as e:
            logger.error(f"Error fetching photos: {str(e)}")
            return []

    def download_photo(self, photo_reference: str, max_width: int = 1200) -> Optional[bytes]:
        """
        Download a photo from Google Places.

        Args:
            photo_reference: Photo reference from place details
            max_width: Maximum width of the photo

        Returns:
            Photo bytes or None if error
        """
        if not self.client:
            return None

        try:
            photo_data = self.client.places_photo(
                photo_reference=photo_reference,
                max_width=max_width
            )

            # Iterate over the photo data to get bytes
            photo_bytes = b''
            for chunk in photo_data:
                photo_bytes += chunk

            return photo_bytes

        except Exception as e:
            logger.error(f"Error downloading photo: {str(e)}")
            return None

    def _format_place_data(self, place: Dict[str, Any]) -> Dict[str, Any]:
        """
        Format Google Places API response to our internal structure.

        Args:
            place: Raw place data from Google Places API

        Returns:
            Formatted place data
        """
        geometry = place.get('geometry', {})
        location = geometry.get('location', {})
        opening_hours = place.get('opening_hours', {})

        formatted_data = {
            'google_place_id': place.get('place_id'),
            'name': place.get('name'),
            'address': place.get('formatted_address'),
            'latitude': location.get('lat'),
            'longitude': location.get('lng'),
            'phone': place.get('formatted_phone_number') or place.get('international_phone_number'),
            'website': place.get('website'),
            'google_maps_url': place.get('url'),
            'rating': place.get('rating'),
            'total_ratings': place.get('user_ratings_total'),
            'place_types': place.get('types', []),
            'business_status': place.get('business_status'),

            # Opening hours
            'opening_hours': {
                'open_now': opening_hours.get('open_now'),
                'weekday_text': opening_hours.get('weekday_text', []),
                'periods': opening_hours.get('periods', []),
            } if opening_hours else None,

            # Accessibility
            'wheelchair_accessible': place.get('wheelchair_accessible_entrance'),

            # Reviews (limit to top 5)
            'reviews': [
                {
                    'author': review.get('author_name'),
                    'rating': review.get('rating'),
                    'text': review.get('text'),
                    'time': review.get('time'),
                    'profile_photo': review.get('profile_photo_url'),
                }
                for review in place.get('reviews', [])[:5]
            ],

            # Photos
            'photos': [
                {
                    'photo_reference': photo.get('photo_reference'),
                    'height': photo.get('height'),
                    'width': photo.get('width'),
                    'attributions': photo.get('html_attributions', []),
                }
                for photo in place.get('photos', [])[:10]
            ],
        }

        return formatted_data


# Singleton instance
google_places_service = GooglePlacesService()
