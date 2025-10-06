"""
Serializers for Destinations app.
"""
from rest_framework import serializers
from .models import Destination, Activity


class DestinationSerializer(serializers.ModelSerializer):
    """Serializer for Destination model."""

    google_reviews_count = serializers.SerializerMethodField()
    google_reviews = serializers.SerializerMethodField()
    google_photos = serializers.SerializerMethodField()
    google_opening_hours = serializers.SerializerMethodField()

    class Meta:
        model = Destination
        fields = [
            'id',
            'name',
            'slug',
            'destination_type',
            'description',
            'short_description',
            'address',
            'city',
            'state',
            'country',
            'latitude',
            'longitude',
            'entry_fee',
            'is_free_entry',
            'opening_time',
            'closing_time',
            'cover_image',
            'gallery_images',
            'is_featured',
            'is_active',
            # Google Places fields
            'google_place_id',
            'google_rating',
            'google_total_ratings',
            'google_maps_url',
            'google_phone',
            'google_website',
            'google_last_synced',
            'google_reviews_count',
            'google_reviews',
            'google_photos',
            'google_opening_hours',
            # SEO
            'meta_title',
            'meta_description',
        ]

    def get_google_reviews_count(self, obj):
        """Get count of Google reviews from google_data."""
        if obj.google_data and 'reviews' in obj.google_data:
            return len(obj.google_data['reviews'])
        return 0

    def get_google_reviews(self, obj):
        """Get Google reviews from google_data."""
        if obj.google_data and 'reviews' in obj.google_data:
            return obj.google_data['reviews']
        return []

    def get_google_photos(self, obj):
        """Get Google photos from google_data."""
        if obj.google_data and 'photos' in obj.google_data:
            return obj.google_data['photos']
        return []

    def get_google_opening_hours(self, obj):
        """Get Google opening hours from google_data."""
        if obj.google_data and 'opening_hours' in obj.google_data:
            return obj.google_data['opening_hours']
        return None


class DestinationListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for Destination list view."""

    class Meta:
        model = Destination
        fields = [
            'id',
            'name',
            'slug',
            'destination_type',
            'short_description',
            'city',
            'state',
            'entry_fee',
            'is_free_entry',
            'cover_image',
            'is_featured',
            'google_rating',
            'google_total_ratings',
        ]


class ActivitySerializer(serializers.ModelSerializer):
    """Serializer for Activity model."""

    destination_name = serializers.CharField(source='destination.name', read_only=True)
    destination_slug = serializers.CharField(source='destination.slug', read_only=True)

    class Meta:
        model = Activity
        fields = [
            'id',
            'name',
            'slug',
            'destination',
            'destination_name',
            'destination_slug',
            'activity_type',
            'description',
            'duration_hours',
            'price_per_person',
            'child_price',
            'max_participants',
            'advance_booking_hours',
            'is_featured',
            'is_active',
        ]
