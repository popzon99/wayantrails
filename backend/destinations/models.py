"""
Destination and activity models for WayanTrails platform.
Tourist attractions, trekking, adventure activities.
"""
from django.db import models
from django.utils.translation import gettext_lazy as _
from core.models import TimeStampedModel, AddressModel, SlugModel, PublishableModel, SEOModel


class Destination(TimeStampedModel, AddressModel, SlugModel, PublishableModel, SEOModel):
    """Tourist destinations and attractions."""

    DESTINATION_TYPES = [
        ('waterfall', 'Waterfall'),
        ('trek', 'Trekking Trail'),
        ('wildlife', 'Wildlife Sanctuary'),
        ('adventure', 'Adventure Activity'),
        ('cultural', 'Cultural Site'),
        ('viewpoint', 'Scenic Viewpoint'),
    ]

    destination_type = models.CharField(_('destination type'), max_length=20, choices=DESTINATION_TYPES)
    description = models.TextField(_('description'))
    short_description = models.CharField(_('short description'), max_length=500)

    # Entry details
    entry_fee = models.DecimalField(_('entry fee'), max_digits=6, decimal_places=2, default=0)
    is_free_entry = models.BooleanField(_('free entry'), default=False)

    # Timing
    opening_time = models.TimeField(_('opening time'), blank=True, null=True)
    closing_time = models.TimeField(_('closing time'), blank=True, null=True)

    # Images
    cover_image = models.ImageField(_('cover image'), upload_to='destinations/covers/')
    gallery_images = models.JSONField(_('gallery images'), default=list, blank=True)

    # Google Places Integration
    google_place_id = models.CharField(_('Google Place ID'), max_length=200, blank=True, null=True, unique=True)
    google_rating = models.DecimalField(_('Google rating'), max_digits=3, decimal_places=2, blank=True, null=True)
    google_total_ratings = models.PositiveIntegerField(_('total Google ratings'), blank=True, null=True)
    google_maps_url = models.URLField(_('Google Maps URL'), blank=True, null=True)
    google_phone = models.CharField(_('phone from Google'), max_length=50, blank=True, null=True)
    google_website = models.URLField(_('website from Google'), blank=True, null=True)
    google_data = models.JSONField(_('Google Places data'), default=dict, blank=True)
    google_last_synced = models.DateTimeField(_('last synced with Google'), blank=True, null=True)

    class Meta:
        db_table = 'destinations'
        verbose_name = _('Destination')
        verbose_name_plural = _('Destinations')
        ordering = ['-is_featured', '-created_at']

    def __str__(self):
        return self.name

    def sync_with_google_places(self):
        """Sync destination data with Google Places API."""
        from core.services import google_places_service
        from django.utils import timezone

        # Search query: "destination name + location"
        search_query = f"{self.name} {self.city or ''} {self.state or ''} Wayanad".strip()

        # Use coordinates if available for better results
        location = None
        if hasattr(self, 'latitude') and hasattr(self, 'longitude'):
            if self.latitude and self.longitude:
                location = (self.latitude, self.longitude)

        # Fetch from Google Places
        place_data = google_places_service.search_place(search_query, location=location)

        if not place_data:
            return False

        # Update fields
        self.google_place_id = place_data.get('google_place_id')
        self.google_rating = place_data.get('rating')
        self.google_total_ratings = place_data.get('total_ratings')
        self.google_maps_url = place_data.get('google_maps_url')
        self.google_phone = place_data.get('phone')
        self.google_website = place_data.get('website')
        self.google_data = place_data
        self.google_last_synced = timezone.now()

        # Update coordinates if available and not set
        if place_data.get('latitude') and place_data.get('longitude'):
            if hasattr(self, 'latitude') and not self.latitude:
                self.latitude = place_data['latitude']
            if hasattr(self, 'longitude') and not self.longitude:
                self.longitude = place_data['longitude']

        # Update address if not set
        if place_data.get('address') and not self.address:
            self.address = place_data['address']

        # Update opening hours if available
        opening_hours = place_data.get('opening_hours')
        if opening_hours and opening_hours.get('weekday_text'):
            if not hasattr(self.google_data, 'opening_hours'):
                self.google_data['opening_hours'] = opening_hours

        self.save()
        return True


class Activity(TimeStampedModel, SlugModel, PublishableModel):
    """Bookable activities at destinations."""

    ACTIVITY_TYPES = [
        ('trekking', 'Trekking'),
        ('boating', 'Boating'),
        ('zip_line', 'Zip Lining'),
        ('camping', 'Camping'),
        ('safari', 'Wildlife Safari'),
    ]

    destination = models.ForeignKey(Destination, on_delete=models.CASCADE, related_name='activities')

    activity_type = models.CharField(_('activity type'), max_length=20, choices=ACTIVITY_TYPES)
    description = models.TextField(_('description'))
    duration_hours = models.DecimalField(_('duration in hours'), max_digits=4, decimal_places=2)

    # Pricing
    price_per_person = models.DecimalField(_('price per person'), max_digits=6, decimal_places=2)
    child_price = models.DecimalField(_('child price'), max_digits=6, decimal_places=2, blank=True, null=True)

    # Capacity
    max_participants = models.PositiveIntegerField(_('max participants per slot'), default=20)

    # Booking
    advance_booking_hours = models.PositiveIntegerField(_('advance booking hours'), default=2)

    class Meta:
        db_table = 'destination_activities'
        verbose_name = _('Activity')
        verbose_name_plural = _('Activities')

    def __str__(self):
        return f"{self.destination.name} - {self.name}"
