"""
Vehicle rental models for WayanTrails platform.
Bikes, cars, and buses for exploring Wayanad.
"""
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.contrib.auth import get_user_model
from core.models import TimeStampedModel, AddressModel, SlugModel, PublishableModel, SEOModel

User = get_user_model()


class RentalProvider(TimeStampedModel, AddressModel, SlugModel):
    """Rental service providers."""

    # Contact information
    contact_person = models.CharField(_('contact person'), max_length=100)
    phone = models.CharField(_('phone'), max_length=20)
    email = models.EmailField(_('email'), blank=True)

    # Business details
    license_number = models.CharField(_('license number'), max_length=50)
    established_year = models.PositiveIntegerField(_('established year'), blank=True, null=True)

    # Status
    is_verified = models.BooleanField(_('is verified'), default=False)
    commission_rate = models.DecimalField(_('commission rate'), max_digits=5, decimal_places=2, default=10.00)

    class Meta:
        db_table = 'rental_providers'
        verbose_name = _('Rental Provider')
        verbose_name_plural = _('Rental Providers')

    def __str__(self):
        return self.name


class Vehicle(TimeStampedModel, SlugModel, PublishableModel, SEOModel):
    """Vehicle listings for rental."""

    VEHICLE_TYPES = [
        ('bike', 'Motorcycle/Scooter'),
        ('car', 'Car'),
        ('suv', 'SUV'),
        ('bus', 'Bus/Tempo Traveller'),
        ('auto', 'Auto Rickshaw'),
    ]

    FUEL_TYPES = [
        ('petrol', 'Petrol'),
        ('diesel', 'Diesel'),
        ('electric', 'Electric'),
        ('hybrid', 'Hybrid'),
    ]

    TRANSMISSION_TYPES = [
        ('manual', 'Manual'),
        ('automatic', 'Automatic'),
        ('cvt', 'CVT'),
    ]

    provider = models.ForeignKey(RentalProvider, on_delete=models.CASCADE, related_name='vehicles')

    # Vehicle details
    vehicle_type = models.CharField(_('vehicle type'), max_length=20, choices=VEHICLE_TYPES)
    brand = models.CharField(_('brand'), max_length=100)
    model = models.CharField(_('model'), max_length=100)
    year = models.PositiveIntegerField(_('year of manufacture'))
    color = models.CharField(_('color'), max_length=50)

    # Technical specifications
    fuel_type = models.CharField(_('fuel type'), max_length=20, choices=FUEL_TYPES)
    transmission = models.CharField(_('transmission'), max_length=20, choices=TRANSMISSION_TYPES)
    seating_capacity = models.PositiveIntegerField(_('seating capacity'))
    mileage = models.CharField(_('mileage'), max_length=50, blank=True)  # "25 kmpl"

    # Registration details
    registration_number = models.CharField(_('registration number'), max_length=20, unique=True)
    insurance_valid_till = models.DateField(_('insurance validity'))
    pollution_certificate_valid_till = models.DateField(_('pollution certificate validity'))

    # Pricing
    price_per_day = models.DecimalField(_('price per day'), max_digits=8, decimal_places=2)
    price_per_hour = models.DecimalField(_('price per hour'), max_digits=6, decimal_places=2, blank=True, null=True)
    weekly_discount = models.DecimalField(_('weekly discount %'), max_digits=5, decimal_places=2, default=0)
    monthly_discount = models.DecimalField(_('monthly discount %'), max_digits=5, decimal_places=2, default=0)

    # Security deposit
    security_deposit = models.DecimalField(_('security deposit'), max_digits=8, decimal_places=2)

    # Features
    has_ac = models.BooleanField(_('air conditioning'), default=False)
    has_music_system = models.BooleanField(_('music system'), default=False)
    has_gps = models.BooleanField(_('GPS navigation'), default=False)
    has_toolkit = models.BooleanField(_('basic toolkit'), default=True)

    # Policies
    minimum_age = models.PositiveIntegerField(_('minimum driver age'), default=18)
    license_required = models.BooleanField(_('driving license required'), default=True)
    advance_booking_hours = models.PositiveIntegerField(_('advance booking hours'), default=2)

    # Images
    cover_image = models.ImageField(_('cover image'), upload_to='vehicles/covers/')
    gallery_images = models.JSONField(_('gallery images'), default=list, blank=True)

    # Status
    is_available = models.BooleanField(_('currently available'), default=True)

    class Meta:
        db_table = 'rental_vehicles'
        verbose_name = _('Vehicle')
        verbose_name_plural = _('Vehicles')
        ordering = ['-is_featured', 'vehicle_type', 'price_per_day']

    def __str__(self):
        return f"{self.brand} {self.model} ({self.year})"

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
