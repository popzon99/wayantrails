"""
Resort models for WayanTrails platform.
Luxury accommodations with multiple room types and amenities.
"""
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.contrib.auth import get_user_model
from core.models import TimeStampedModel, AddressModel, SlugModel, PublishableModel, SEOModel

User = get_user_model()


class Resort(TimeStampedModel, AddressModel, SlugModel, PublishableModel, SEOModel):
    """Resort listings with detailed information."""

    RESORT_TYPES = [
        ('luxury', 'Luxury Resort'),
        ('boutique', 'Boutique Resort'),
        ('eco', 'Eco Resort'),
        ('family', 'Family Resort'),
        ('adventure', 'Adventure Resort'),
    ]

    # Basic information
    description = models.TextField(_('description'))
    short_description = models.CharField(_('short description'), max_length=500)

    # Resort type and category
    resort_type = models.CharField(_('resort type'), max_length=20, choices=RESORT_TYPES)
    star_rating = models.PositiveIntegerField(_('star rating'), default=3, choices=[(i, i) for i in range(1, 6)])

    # Contact information
    phone = models.CharField(_('phone'), max_length=20)
    email = models.EmailField(_('email'), blank=True)
    website = models.URLField(_('website'), blank=True)

    # Property details
    total_rooms = models.PositiveIntegerField(_('total rooms'))
    property_size = models.CharField(_('property size'), max_length=100, blank=True)  # "5 acres"
    year_established = models.PositiveIntegerField(_('year established'), blank=True, null=True)

    # Pricing
    price_range_min = models.DecimalField(_('minimum price'), max_digits=8, decimal_places=2)
    price_range_max = models.DecimalField(_('maximum price'), max_digits=8, decimal_places=2)

    # Policies
    check_in_time = models.TimeField(_('check-in time'), default='14:00')
    check_out_time = models.TimeField(_('check-out time'), default='11:00')
    cancellation_policy = models.TextField(_('cancellation policy'))

    # Images
    cover_image = models.ImageField(_('cover image'), upload_to='resorts/covers/')
    gallery_images = models.JSONField(_('gallery images'), default=list, blank=True)

    # Status
    is_verified = models.BooleanField(_('is verified'), default=False)
    commission_rate = models.DecimalField(_('commission rate'), max_digits=5, decimal_places=2, default=10.00)

    class Meta:
        db_table = 'resorts'
        verbose_name = _('Resort')
        verbose_name_plural = _('Resorts')
        ordering = ['-is_featured', '-created_at']

    def __str__(self):
        return self.name

    @property
    def average_rating(self):
        """Calculate average rating from reviews."""
        reviews = self.reviews.filter(is_approved=True)
        if reviews.exists():
            return reviews.aggregate(models.Avg('rating'))['rating__avg']
        return 0

    @property
    def total_reviews(self):
        """Get total number of approved reviews."""
        return self.reviews.filter(is_approved=True).count()


class RoomType(TimeStampedModel, SlugModel):
    """Different room types in a resort."""

    ROOM_TYPES = [
        ('standard', 'Standard Room'),
        ('deluxe', 'Deluxe Room'),
        ('suite', 'Suite'),
        ('villa', 'Villa'),
        ('cottage', 'Cottage'),
        ('treehouse', 'Treehouse'),
    ]

    resort = models.ForeignKey(Resort, on_delete=models.CASCADE, related_name='room_types')

    # Room details
    room_type = models.CharField(_('room type'), max_length=20, choices=ROOM_TYPES)
    description = models.TextField(_('description'))
    size = models.CharField(_('room size'), max_length=100, blank=True)  # "400 sq ft"
    max_occupancy = models.PositiveIntegerField(_('maximum occupancy'), default=2)

    # Pricing
    base_price = models.DecimalField(_('base price per night'), max_digits=8, decimal_places=2)
    weekend_price = models.DecimalField(_('weekend price per night'), max_digits=8, decimal_places=2, blank=True, null=True)
    peak_season_price = models.DecimalField(_('peak season price'), max_digits=8, decimal_places=2, blank=True, null=True)

    # Availability
    total_rooms = models.PositiveIntegerField(_('total rooms of this type'), default=1)

    # Room features
    bed_type = models.CharField(_('bed type'), max_length=100, blank=True)  # "King bed", "Twin beds"
    has_ac = models.BooleanField(_('air conditioning'), default=True)
    has_wifi = models.BooleanField(_('wifi'), default=True)
    has_tv = models.BooleanField(_('television'), default=True)
    has_balcony = models.BooleanField(_('balcony'), default=False)
    has_bathtub = models.BooleanField(_('bathtub'), default=False)

    # Images
    images = models.JSONField(_('room images'), default=list, blank=True)

    # Status
    is_active = models.BooleanField(_('is active'), default=True)

    class Meta:
        db_table = 'resort_room_types'
        verbose_name = _('Room Type')
        verbose_name_plural = _('Room Types')
        unique_together = ['resort', 'slug']

    def __str__(self):
        return f"{self.resort.name} - {self.name}"


class ResortAmenity(TimeStampedModel):
    """Amenities available at resorts."""

    AMENITY_CATEGORIES = [
        ('property', 'Property Features'),
        ('room', 'Room Features'),
        ('recreation', 'Recreation'),
        ('dining', 'Dining'),
        ('wellness', 'Wellness & Spa'),
        ('business', 'Business'),
        ('family', 'Family & Kids'),
        ('outdoor', 'Outdoor Activities'),
        ('transport', 'Transportation'),
        ('services', 'Services'),
        ('activities', 'Activities'),
        ('safety', 'Safety & Security'),
    ]

    AMENITY_TYPES = [
        ('boolean', 'Yes/No'),
        ('count', 'Count'),
        ('text', 'Text Description'),
        ('list', 'Multiple Options'),
    ]

    name = models.CharField(_('amenity name'), max_length=100, unique=True)
    category = models.CharField(_('category'), max_length=20, choices=AMENITY_CATEGORIES)
    amenity_type = models.CharField(_('amenity type'), max_length=20, choices=AMENITY_TYPES, default='boolean')
    icon = models.CharField(_('icon class'), max_length=100, blank=True)
    description = models.TextField(_('description'), blank=True)
    is_premium = models.BooleanField(_('premium amenity'), default=False)
    display_priority = models.PositiveIntegerField(_('display priority'), default=0)

    class Meta:
        db_table = 'resort_amenities'
        verbose_name = _('Resort Amenity')
        verbose_name_plural = _('Resort Amenities')
        ordering = ['category', '-display_priority', 'name']

    def __str__(self):
        return self.name


class ResortAmenityMapping(models.Model):
    """Many-to-many relationship between resorts and amenities."""

    resort = models.ForeignKey(Resort, on_delete=models.CASCADE, related_name='amenity_mappings')
    amenity = models.ForeignKey(ResortAmenity, on_delete=models.CASCADE)
    is_featured = models.BooleanField(_('featured amenity'), default=False)
    is_available = models.BooleanField(_('currently available'), default=True)
    value = models.JSONField(_('amenity value'), default=dict, blank=True)  # For count/text/list types
    additional_info = models.TextField(_('additional information'), blank=True)

    class Meta:
        db_table = 'resort_amenity_mappings'
        unique_together = ['resort', 'amenity']
        verbose_name = _('Resort Amenity Mapping')
        verbose_name_plural = _('Resort Amenity Mappings')

    def __str__(self):
        return f"{self.resort.name} - {self.amenity.name}"


class SeasonalPricing(TimeStampedModel):
    """Seasonal pricing for resorts and room types."""

    SEASON_TYPES = [
        ('peak', 'Peak Season'),
        ('high', 'High Season'),
        ('normal', 'Normal Season'),
        ('low', 'Low Season'),
    ]

    resort = models.ForeignKey(Resort, on_delete=models.CASCADE, related_name='seasonal_pricing')
    room_type = models.ForeignKey(RoomType, on_delete=models.CASCADE, related_name='seasonal_pricing', blank=True, null=True)

    season_name = models.CharField(_('season name'), max_length=100)
    season_type = models.CharField(_('season type'), max_length=10, choices=SEASON_TYPES)

    start_date = models.DateField(_('start date'))
    end_date = models.DateField(_('end date'))

    price_multiplier = models.DecimalField(_('price multiplier'), max_digits=4, decimal_places=2, default=1.00)
    fixed_price = models.DecimalField(_('fixed price'), max_digits=8, decimal_places=2, blank=True, null=True)

    is_active = models.BooleanField(_('is active'), default=True)

    class Meta:
        db_table = 'resort_seasonal_pricing'
        verbose_name = _('Seasonal Pricing')
        verbose_name_plural = _('Seasonal Pricing')
        ordering = ['start_date']

    def __str__(self):
        return f"{self.resort.name} - {self.season_name} ({self.start_date} to {self.end_date})"
