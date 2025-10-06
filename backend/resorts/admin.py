"""
Resort admin interface for WayanTrails platform.
"""
from django.contrib import admin
from django.utils.html import format_html
from .models import Resort, RoomType, ResortAmenity, ResortAmenityMapping, SeasonalPricing


@admin.register(ResortAmenity)
class ResortAmenityAdmin(admin.ModelAdmin):
    """Admin interface for resort amenities."""

    list_display = ['name', 'category', 'icon']
    list_filter = ['category']
    search_fields = ['name', 'description']
    ordering = ['category', 'name']


class ResortAmenityMappingInline(admin.TabularInline):
    """Inline admin for resort amenity mappings."""

    model = ResortAmenityMapping
    extra = 1
    autocomplete_fields = ['amenity']


class RoomTypeInline(admin.TabularInline):
    """Inline admin for room types."""

    model = RoomType
    extra = 1
    fields = ['name', 'room_type', 'base_price', 'max_occupancy', 'total_rooms', 'is_active']


class SeasonalPricingInline(admin.TabularInline):
    """Inline admin for seasonal pricing."""

    model = SeasonalPricing
    extra = 1
    fields = ['season_name', 'season_type', 'start_date', 'end_date', 'price_multiplier', 'is_active']


@admin.register(Resort)
class ResortAdmin(admin.ModelAdmin):
    """Admin interface for resorts."""

    list_display = [
        'name', 'resort_type', 'city', 'star_rating', 'price_range_display',
        'total_rooms', 'is_verified', 'is_featured', 'is_active'
    ]
    list_filter = [
        'resort_type', 'star_rating', 'city', 'state',
        'is_verified', 'is_featured', 'is_active'
    ]
    search_fields = ['name', 'description', 'city', 'address_line_1']
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields = ['created_at', 'updated_at', 'average_rating', 'total_reviews']

    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'slug', 'description', 'short_description', 'resort_type', 'star_rating')
        }),
        ('Contact Information', {
            'fields': ('phone', 'email', 'website')
        }),
        ('Property Details', {
            'fields': ('total_rooms', 'property_size', 'year_established')
        }),
        ('Pricing', {
            'fields': ('price_range_min', 'price_range_max', 'commission_rate')
        }),
        ('Location', {
            'fields': ('address_line_1', 'address_line_2', 'city', 'state', 'postal_code', 'country', 'latitude', 'longitude')
        }),
        ('Policies', {
            'fields': ('check_in_time', 'check_out_time', 'cancellation_policy')
        }),
        ('Media', {
            'fields': ('cover_image', 'gallery_images')
        }),
        ('SEO', {
            'fields': ('meta_title', 'meta_description', 'meta_keywords'),
            'classes': ('collapse',)
        }),
        ('Status', {
            'fields': ('is_active', 'is_featured', 'is_verified', 'published_at')
        }),
        ('Statistics', {
            'fields': ('average_rating', 'total_reviews', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )

    inlines = [RoomTypeInline, ResortAmenityMappingInline, SeasonalPricingInline]

    def price_range_display(self, obj):
        """Display price range in a formatted way."""
        return f"₹{obj.price_range_min:,.0f} - ₹{obj.price_range_max:,.0f}"
    price_range_display.short_description = 'Price Range'

    def save_model(self, request, obj, form, change):
        """Auto-generate slug if not provided."""
        if not obj.slug:
            from django.utils.text import slugify
            obj.slug = slugify(obj.name)
        super().save_model(request, obj, form, change)


@admin.register(RoomType)
class RoomTypeAdmin(admin.ModelAdmin):
    """Admin interface for room types."""

    list_display = [
        'name', 'resort', 'room_type', 'base_price', 'max_occupancy', 'total_rooms', 'is_active'
    ]
    list_filter = ['room_type', 'resort__city', 'is_active']
    search_fields = ['name', 'resort__name']
    autocomplete_fields = ['resort']
    prepopulated_fields = {'slug': ('name',)}


@admin.register(SeasonalPricing)
class SeasonalPricingAdmin(admin.ModelAdmin):
    """Admin interface for seasonal pricing."""

    list_display = [
        'resort', 'season_name', 'season_type', 'start_date', 'end_date', 'price_multiplier', 'is_active'
    ]
    list_filter = ['season_type', 'is_active']
    search_fields = ['resort__name', 'season_name']
    autocomplete_fields = ['resort']
