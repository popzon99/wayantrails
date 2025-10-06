"""
Homestay serializers for WayanTrails API.
"""
from rest_framework import serializers
from .models import Homestay, HomestayRoom, HomestayAmenity, HomestayAmenityMapping, MealPlan, Experience


class HomestayAmenitySerializer(serializers.ModelSerializer):
    """Serializer for homestay amenities."""

    category_display = serializers.CharField(source='get_category_display', read_only=True)

    class Meta:
        model = HomestayAmenity
        fields = ['id', 'name', 'category', 'category_display', 'amenity_type', 'icon', 'description', 'is_premium', 'display_priority']


class HomestayAmenityMappingSerializer(serializers.ModelSerializer):
    """Serializer for homestay amenity mappings with full details."""

    amenity = HomestayAmenitySerializer(read_only=True)

    class Meta:
        model = HomestayAmenityMapping
        fields = ['amenity', 'is_featured', 'is_available', 'value', 'additional_info']


class HomestayRoomSerializer(serializers.ModelSerializer):
    """Serializer for homestay rooms."""

    class Meta:
        model = HomestayRoom
        fields = [
            'id', 'room_name', 'room_type', 'description', 'max_occupancy',
            'bed_configuration', 'has_ac', 'has_fan', 'has_wifi',
            'has_attached_bathroom', 'has_balcony', 'has_study_table',
            'base_price', 'images', 'is_active'
        ]


class MealPlanSerializer(serializers.ModelSerializer):
    """Serializer for meal plans."""

    class Meta:
        model = MealPlan
        fields = [
            'id', 'plan_name', 'meal_type', 'description',
            'price_per_person', 'child_price', 'cuisine_type',
            'dietary_options', 'special_dishes', 'is_active',
            'advance_notice_hours'
        ]


class ExperienceSerializer(serializers.ModelSerializer):
    """Serializer for homestay experiences."""

    class Meta:
        model = Experience
        fields = [
            'id', 'name', 'slug', 'experience_type', 'description',
            'duration_hours', 'price_per_person', 'minimum_participants',
            'maximum_participants', 'age_restriction', 'fitness_level',
            'equipment_provided', 'equipment_list', 'available_times',
            'advance_booking_days', 'images', 'is_active'
        ]


class HomestayListSerializer(serializers.ModelSerializer):
    """Serializer for homestay list view."""

    average_rating = serializers.ReadOnlyField()
    total_reviews = serializers.ReadOnlyField()
    cover_image = serializers.SerializerMethodField()

    class Meta:
        model = Homestay
        fields = [
            'id', 'name', 'slug', 'homestay_type', 'host_name',
            'short_description', 'city', 'state', 'price_per_night',
            'max_guests', 'provides_meals', 'cover_image',
            'average_rating', 'total_reviews', 'is_featured', 'is_verified'
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


class HomestayDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer for homestay detail view."""

    rooms = HomestayRoomSerializer(many=True, read_only=True)
    meal_plans = MealPlanSerializer(many=True, read_only=True)
    experiences = ExperienceSerializer(many=True, read_only=True)
    amenity_mappings = HomestayAmenityMappingSerializer(many=True, read_only=True)
    amenities_by_category = serializers.SerializerMethodField()
    average_rating = serializers.ReadOnlyField()
    total_reviews = serializers.ReadOnlyField()
    full_address = serializers.ReadOnlyField()

    class Meta:
        model = Homestay
        fields = [
            'id', 'name', 'slug', 'description', 'short_description',
            'homestay_type', 'host_name', 'host_phone', 'host_email',
            'host_bio', 'host_languages', 'total_rooms', 'total_bathrooms',
            'house_age', 'family_size', 'max_guests', 'price_per_night',
            'extra_person_charge', 'provides_meals', 'meal_types',
            'cooking_experience', 'local_guide_service', 'check_in_time',
            'check_out_time', 'house_rules', 'cancellation_policy',
            'pet_friendly', 'children_friendly', 'elderly_friendly',
            'cultural_activities', 'farm_activities', 'nearby_attractions',
            'address_line_1', 'address_line_2', 'city', 'state', 'postal_code',
            'country', 'latitude', 'longitude', 'full_address',
            'cover_image', 'gallery_images', 'is_active', 'is_featured',
            'is_verified', 'commission_rate', 'meta_title', 'meta_description',
            'meta_keywords', 'rooms', 'meal_plans', 'experiences', 'amenity_mappings',
            'amenities_by_category', 'average_rating', 'total_reviews', 'created_at', 'updated_at'
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


class HomestayCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for creating and updating homestays."""

    class Meta:
        model = Homestay
        fields = [
            'name', 'description', 'short_description', 'homestay_type',
            'host_name', 'host_phone', 'host_email', 'host_bio', 'host_languages',
            'total_rooms', 'total_bathrooms', 'house_age', 'family_size',
            'max_guests', 'price_per_night', 'extra_person_charge',
            'provides_meals', 'meal_types', 'cooking_experience',
            'local_guide_service', 'check_in_time', 'check_out_time',
            'house_rules', 'cancellation_policy', 'pet_friendly',
            'children_friendly', 'elderly_friendly', 'cultural_activities',
            'farm_activities', 'nearby_attractions', 'address_line_1',
            'address_line_2', 'city', 'state', 'postal_code', 'country',
            'latitude', 'longitude', 'cover_image', 'gallery_images',
            'is_active', 'is_featured', 'meta_title', 'meta_description',
            'meta_keywords'
        ]