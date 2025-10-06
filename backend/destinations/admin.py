"""
Admin configuration for Destinations app.
"""
from django.contrib import admin
from django.contrib import messages
from django.utils.html import format_html
from .models import Destination, Activity


@admin.action(description='Sync with Google Places')
def sync_with_google_places(modeladmin, request, queryset):
    """Admin action to sync destinations with Google Places API."""
    success_count = 0
    error_count = 0

    for destination in queryset:
        try:
            if destination.sync_with_google_places():
                success_count += 1
            else:
                error_count += 1
        except Exception as e:
            error_count += 1
            messages.error(request, f"Error syncing {destination.name}: {str(e)}")

    if success_count > 0:
        messages.success(request, f"Successfully synced {success_count} destination(s) with Google Places")
    if error_count > 0:
        messages.warning(request, f"Failed to sync {error_count} destination(s)")


@admin.register(Destination)
class DestinationAdmin(admin.ModelAdmin):
    """Admin interface for Destination model."""

    list_display = [
        'name',
        'destination_type',
        'city',
        'state',
        'google_rating_display',
        'is_featured',
        'is_active',
        'google_sync_status',
    ]
    list_filter = [
        'destination_type',
        'is_featured',
        'is_active',
        'state',
        'city',
    ]
    search_fields = ['name', 'description', 'city', 'state', 'google_place_id']
    readonly_fields = [
        'slug',
        'created_at',
        'updated_at',
        'google_rating',
        'google_total_ratings',
        'google_maps_url',
        'google_phone',
        'google_website',
        'google_last_synced',
        'google_data_display',
    ]
    actions = [sync_with_google_places]

    fieldsets = (
        ('Basic Information', {
            'fields': (
                'name',
                'slug',
                'destination_type',
                'description',
                'short_description',
            )
        }),
        ('Location', {
            'fields': (
                'address',
                'city',
                'state',
                'country',
                'postal_code',
                'latitude',
                'longitude',
            )
        }),
        ('Entry & Timing', {
            'fields': (
                'entry_fee',
                'is_free_entry',
                'opening_time',
                'closing_time',
            )
        }),
        ('Media', {
            'fields': (
                'cover_image',
                'gallery_images',
            )
        }),
        ('Google Places Data', {
            'fields': (
                'google_place_id',
                'google_rating',
                'google_total_ratings',
                'google_maps_url',
                'google_phone',
                'google_website',
                'google_last_synced',
                'google_data_display',
            ),
            'classes': ('collapse',),
        }),
        ('SEO', {
            'fields': (
                'meta_title',
                'meta_description',
                'meta_keywords',
            ),
            'classes': ('collapse',),
        }),
        ('Publication', {
            'fields': (
                'is_active',
                'published_at',
                'is_featured',
            )
        }),
        ('Timestamps', {
            'fields': (
                'created_at',
                'updated_at',
            ),
            'classes': ('collapse',),
        }),
    )

    def google_rating_display(self, obj):
        """Display Google rating with stars."""
        if obj.google_rating:
            stars = '⭐' * int(obj.google_rating)
            return format_html(
                '<span title="{} ratings">{} ({})</span>',
                obj.google_total_ratings or 0,
                stars,
                obj.google_rating
            )
        return '-'
    google_rating_display.short_description = 'Google Rating'

    def google_sync_status(self, obj):
        """Display Google sync status."""
        if obj.google_place_id:
            if obj.google_last_synced:
                return format_html(
                    '<span style="color: green;">✓ Synced</span><br/><small>{}</small>',
                    obj.google_last_synced.strftime('%Y-%m-%d %H:%M')
                )
            return format_html('<span style="color: orange;">⚠ Not synced</span>')
        return format_html('<span style="color: gray;">- No Place ID</span>')
    google_sync_status.short_description = 'Google Status'

    def google_data_display(self, obj):
        """Display formatted Google Places data."""
        if not obj.google_data:
            return '-'

        html = '<div style="max-height: 400px; overflow-y: auto;">'

        # Opening hours
        opening_hours = obj.google_data.get('opening_hours')
        if opening_hours:
            html += '<h4>Opening Hours:</h4><ul>'
            for day in opening_hours.get('weekday_text', []):
                html += f'<li>{day}</li>'
            html += '</ul>'

        # Reviews
        reviews = obj.google_data.get('reviews', [])
        if reviews:
            html += '<h4>Recent Reviews:</h4>'
            for review in reviews[:3]:
                html += f'<div style="border: 1px solid #ddd; padding: 10px; margin: 5px 0;">'
                html += f'<strong>{review.get("author")}</strong> - {"⭐" * int(review.get("rating", 0))}<br/>'
                html += f'<small>{review.get("text", "")[:200]}...</small>'
                html += '</div>'

        # Photos count
        photos = obj.google_data.get('photos', [])
        if photos:
            html += f'<p><strong>Photos available:</strong> {len(photos)}</p>'

        html += '</div>'
        return format_html(html)
    google_data_display.short_description = 'Google Places Details'


@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    """Admin interface for Activity model."""

    list_display = [
        'name',
        'destination',
        'activity_type',
        'duration_hours',
        'price_per_person',
        'max_participants',
        'is_active',
    ]
    list_filter = [
        'activity_type',
        'is_active',
        'destination',
    ]
    search_fields = ['name', 'description', 'destination__name']
    readonly_fields = ['slug', 'created_at', 'updated_at']

    fieldsets = (
        ('Basic Information', {
            'fields': (
                'destination',
                'name',
                'slug',
                'activity_type',
                'description',
                'duration_hours',
            )
        }),
        ('Pricing', {
            'fields': (
                'price_per_person',
                'child_price',
            )
        }),
        ('Capacity & Booking', {
            'fields': (
                'max_participants',
                'advance_booking_hours',
            )
        }),
        ('Publication', {
            'fields': (
                'is_active',
                'published_at',
                'is_featured',
            )
        }),
        ('Timestamps', {
            'fields': (
                'created_at',
                'updated_at',
            ),
            'classes': ('collapse',),
        }),
    )
