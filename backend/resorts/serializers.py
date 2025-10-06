"""
Resort serializers for WayanTrails API.
"""
from rest_framework import serializers
from .models import Resort, RoomType, ResortAmenity, ResortAmenityMapping, SeasonalPricing


class ResortAmenitySerializer(serializers.ModelSerializer):
    """Serializer for resort amenities."""

    category_display = serializers.CharField(source='get_category_display', read_only=True)

    class Meta:
        model = ResortAmenity
        fields = ['id', 'name', 'category', 'category_display', 'amenity_type', 'icon', 'description', 'is_premium', 'display_priority']


class ResortAmenityMappingSerializer(serializers.ModelSerializer):
    """Serializer for resort amenity mappings with full details."""

    amenity = ResortAmenitySerializer(read_only=True)
    amenity_id = serializers.IntegerField(write_only=True, required=False)

    class Meta:
        model = ResortAmenityMapping
        fields = ['amenity', 'amenity_id', 'is_featured', 'is_available', 'value', 'additional_info']


class RoomTypeSerializer(serializers.ModelSerializer):
    """Serializer for room types."""

    class Meta:
        model = RoomType
        fields = [
            'id', 'name', 'slug', 'room_type', 'description', 'size', 'max_occupancy',
            'base_price', 'weekend_price', 'peak_season_price', 'total_rooms',
            'bed_type', 'has_ac', 'has_wifi', 'has_tv', 'has_balcony', 'has_bathtub',
            'images', 'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'slug', 'created_at', 'updated_at']


class SeasonalPricingSerializer(serializers.ModelSerializer):
    """Serializer for seasonal pricing."""

    class Meta:
        model = SeasonalPricing
        fields = [
            'id', 'season_name', 'season_type', 'start_date', 'end_date',
            'price_multiplier', 'fixed_price', 'is_active'
        ]


class ResortListSerializer(serializers.ModelSerializer):
    """Serializer for resort list view (minimal data for performance)."""

    average_rating = serializers.ReadOnlyField()
    total_reviews = serializers.ReadOnlyField()
    cover_image = serializers.SerializerMethodField()

    class Meta:
        model = Resort
        fields = [
            'id', 'name', 'slug', 'resort_type', 'star_rating',
            'short_description', 'city', 'state',
            'price_range_min', 'price_range_max',
            'cover_image', 'average_rating', 'total_reviews',
            'is_featured', 'is_verified'
        ]

    def get_cover_image(self, obj):
        """Return full URL for cover image."""
        if obj.cover_image:
            # If it's already a full URL (http/https), return as is
            if str(obj.cover_image).startswith(('http://', 'https://')):
                return str(obj.cover_image)
            # Otherwise, build the full URL
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.cover_image.url)
            return obj.cover_image.url
        return None


class ResortDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer for resort detail view."""

    room_types = RoomTypeSerializer(many=True, read_only=True)
    amenity_mappings = ResortAmenityMappingSerializer(many=True, read_only=True)
    amenities_by_category = serializers.SerializerMethodField()
    seasonal_pricing = SeasonalPricingSerializer(many=True, read_only=True)
    average_rating = serializers.ReadOnlyField()
    total_reviews = serializers.ReadOnlyField()
    full_address = serializers.ReadOnlyField()

    class Meta:
        model = Resort
        fields = [
            'id', 'name', 'slug', 'description', 'short_description',
            'resort_type', 'star_rating', 'phone', 'email', 'website',
            'total_rooms', 'property_size', 'year_established',
            'price_range_min', 'price_range_max',
            'check_in_time', 'check_out_time', 'cancellation_policy',
            'address_line_1', 'address_line_2', 'city', 'state', 'postal_code', 'country',
            'latitude', 'longitude', 'full_address',
            'cover_image', 'gallery_images',
            'is_active', 'is_featured', 'is_verified', 'commission_rate',
            'meta_title', 'meta_description', 'meta_keywords',
            'room_types', 'amenity_mappings', 'amenities_by_category', 'seasonal_pricing',
            'average_rating', 'total_reviews',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'slug', 'average_rating', 'total_reviews', 'full_address',
            'created_at', 'updated_at'
        ]

    def get_amenities_by_category(self, obj):
        """Group amenities by category for better UI organization."""
        from collections import defaultdict
        amenities_dict = defaultdict(list)

        for mapping in obj.amenity_mappings.select_related('amenity').all():
            if mapping.is_available:
                category = mapping.amenity.get_category_display()
                amenities_dict[category].append({
                    'id': mapping.amenity.id,
                    'name': mapping.amenity.name,
                    'icon': mapping.amenity.icon,
                    'amenity_type': mapping.amenity.amenity_type,
                    'is_premium': mapping.amenity.is_premium,
                    'is_featured': mapping.is_featured,
                    'value': mapping.value,
                    'additional_info': mapping.additional_info
                })

        return dict(amenities_dict)


class ResortCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for creating and updating resorts."""

    amenities = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True,
        required=False,
        help_text="List of amenity IDs"
    )

    class Meta:
        model = Resort
        fields = [
            'name', 'description', 'short_description', 'resort_type', 'star_rating',
            'phone', 'email', 'website', 'total_rooms', 'property_size', 'year_established',
            'price_range_min', 'price_range_max', 'check_in_time', 'check_out_time',
            'cancellation_policy', 'address_line_1', 'address_line_2', 'city', 'state',
            'postal_code', 'country', 'latitude', 'longitude', 'cover_image',
            'gallery_images', 'is_active', 'is_featured', 'meta_title',
            'meta_description', 'meta_keywords', 'amenities'
        ]

    def create(self, validated_data):
        amenities_data = validated_data.pop('amenities', [])
        resort = Resort.objects.create(**validated_data)

        # Create amenity mappings
        for amenity_id in amenities_data:
            ResortAmenityMapping.objects.create(
                resort=resort,
                amenity_id=amenity_id
            )

        return resort

    def update(self, instance, validated_data):
        amenities_data = validated_data.pop('amenities', None)

        # Update resort fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Update amenity mappings if provided
        if amenities_data is not None:
            instance.amenity_mappings.all().delete()
            for amenity_id in amenities_data:
                ResortAmenityMapping.objects.create(
                    resort=instance,
                    amenity_id=amenity_id
                )

        return instance