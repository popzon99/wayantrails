"""
Homestay models for WayanTrails platform.
Authentic local experiences with family-run accommodations.
"""
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.contrib.auth import get_user_model
from core.models import TimeStampedModel, AddressModel, SlugModel, PublishableModel, SEOModel

User = get_user_model()


class Homestay(TimeStampedModel, AddressModel, SlugModel, PublishableModel, SEOModel):
    """Homestay listings for authentic local experiences."""

    HOMESTAY_TYPES = [
        ('traditional', 'Traditional Home'),
        ('farmstay', 'Farm Stay'),
        ('village', 'Village Home'),
        ('heritage', 'Heritage Home'),
        ('eco', 'Eco Home'),
    ]

    # Host information
    host_name = models.CharField(_('host name'), max_length=100)
    host_phone = models.CharField(_('host phone'), max_length=20)
    host_email = models.EmailField(_('host email'), blank=True)
    host_bio = models.TextField(_('host bio'), blank=True)
    host_languages = models.JSONField(_('languages spoken'), default=list, blank=True)  # ['English', 'Malayalam', 'Hindi']

    # Basic information
    description = models.TextField(_('description'))
    short_description = models.CharField(_('short description'), max_length=500)

    # Homestay type and category
    homestay_type = models.CharField(_('homestay type'), max_length=20, choices=HOMESTAY_TYPES)

    # Property details
    total_rooms = models.PositiveIntegerField(_('total guest rooms'))
    total_bathrooms = models.PositiveIntegerField(_('total bathrooms'), default=1)
    house_age = models.PositiveIntegerField(_('house age in years'), blank=True, null=True)
    family_size = models.PositiveIntegerField(_('family size'), default=4)

    # Capacity
    max_guests = models.PositiveIntegerField(_('maximum guests'), default=4)

    # Pricing
    price_per_night = models.DecimalField(_('price per night'), max_digits=8, decimal_places=2)
    extra_person_charge = models.DecimalField(_('extra person charge'), max_digits=6, decimal_places=2, default=0)

    # Meals and services
    provides_meals = models.BooleanField(_('provides meals'), default=True)
    meal_types = models.JSONField(_('meal types available'), default=list, blank=True)  # ['breakfast', 'lunch', 'dinner']
    cooking_experience = models.BooleanField(_('cooking experience available'), default=False)
    local_guide_service = models.BooleanField(_('local guide service'), default=False)

    # Policies
    check_in_time = models.TimeField(_('check-in time'), default='14:00')
    check_out_time = models.TimeField(_('check-out time'), default='11:00')
    house_rules = models.TextField(_('house rules'), blank=True)
    cancellation_policy = models.TextField(_('cancellation policy'))

    # Special features
    pet_friendly = models.BooleanField(_('pet friendly'), default=False)
    children_friendly = models.BooleanField(_('children friendly'), default=True)
    elderly_friendly = models.BooleanField(_('elderly friendly'), default=True)

    # Local experiences
    cultural_activities = models.JSONField(_('cultural activities'), default=list, blank=True)
    farm_activities = models.JSONField(_('farm activities'), default=list, blank=True)
    nearby_attractions = models.JSONField(_('nearby attractions'), default=list, blank=True)

    # Images
    cover_image = models.ImageField(_('cover image'), upload_to='homestays/covers/')
    gallery_images = models.JSONField(_('gallery images'), default=list, blank=True)

    # Status and verification
    is_verified = models.BooleanField(_('is verified'), default=False)
    commission_rate = models.DecimalField(_('commission rate'), max_digits=5, decimal_places=2, default=15.00)

    class Meta:
        db_table = 'homestays'
        verbose_name = _('Homestay')
        verbose_name_plural = _('Homestays')
        ordering = ['-is_featured', '-created_at']

    def __str__(self):
        return f"{self.name} - {self.host_name}"

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


class HomestayRoom(TimeStampedModel):
    """Individual rooms in a homestay."""

    ROOM_TYPES = [
        ('single', 'Single Room'),
        ('double', 'Double Room'),
        ('family', 'Family Room'),
        ('shared', 'Shared Room'),
        ('dormitory', 'Dormitory'),
    ]

    homestay = models.ForeignKey(Homestay, on_delete=models.CASCADE, related_name='rooms')

    # Room details
    room_name = models.CharField(_('room name'), max_length=100)
    room_type = models.CharField(_('room type'), max_length=20, choices=ROOM_TYPES)
    description = models.TextField(_('description'), blank=True)

    # Capacity
    max_occupancy = models.PositiveIntegerField(_('maximum occupancy'), default=2)
    bed_configuration = models.CharField(_('bed configuration'), max_length=200)  # "1 Double bed + 1 Single bed"

    # Features
    has_ac = models.BooleanField(_('air conditioning'), default=False)
    has_fan = models.BooleanField(_('ceiling fan'), default=True)
    has_wifi = models.BooleanField(_('wifi'), default=True)
    has_attached_bathroom = models.BooleanField(_('attached bathroom'), default=False)
    has_balcony = models.BooleanField(_('balcony'), default=False)
    has_study_table = models.BooleanField(_('study table'), default=False)

    # Pricing
    base_price = models.DecimalField(_('base price per night'), max_digits=8, decimal_places=2)

    # Images
    images = models.JSONField(_('room images'), default=list, blank=True)

    # Status
    is_active = models.BooleanField(_('is active'), default=True)

    class Meta:
        db_table = 'homestay_rooms'
        verbose_name = _('Homestay Room')
        verbose_name_plural = _('Homestay Rooms')

    def __str__(self):
        return f"{self.homestay.name} - {self.room_name}"


class HomestayAmenity(TimeStampedModel):
    """Amenities available at homestays."""

    AMENITY_CATEGORIES = [
        ('property', 'Property Features'),
        ('room', 'Room Features'),
        ('services', 'Services'),
        ('dining', 'Dining'),
        ('activities', 'Activities'),
        ('safety', 'Safety & Security'),
        ('outdoor', 'Outdoor Areas'),
        ('entertainment', 'Entertainment'),
        ('kitchen', 'Kitchen & Dining'),
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
        db_table = 'homestay_amenities'
        verbose_name = _('Homestay Amenity')
        verbose_name_plural = _('Homestay Amenities')
        ordering = ['category', '-display_priority', 'name']

    def __str__(self):
        return self.name


class HomestayAmenityMapping(models.Model):
    """Many-to-many relationship between homestays and amenities."""

    homestay = models.ForeignKey(Homestay, on_delete=models.CASCADE, related_name='amenity_mappings')
    amenity = models.ForeignKey(HomestayAmenity, on_delete=models.CASCADE)
    is_featured = models.BooleanField(_('featured amenity'), default=False)
    is_available = models.BooleanField(_('currently available'), default=True)
    value = models.JSONField(_('amenity value'), default=dict, blank=True)  # For count/text/list types
    additional_info = models.TextField(_('additional information'), blank=True)

    class Meta:
        db_table = 'homestay_amenity_mappings'
        unique_together = ['homestay', 'amenity']
        verbose_name = _('Homestay Amenity Mapping')
        verbose_name_plural = _('Homestay Amenity Mappings')

    def __str__(self):
        return f"{self.homestay.name} - {self.amenity.name}"


class MealPlan(TimeStampedModel):
    """Meal plans offered by homestays."""

    MEAL_TYPES = [
        ('breakfast', 'Breakfast Only'),
        ('half_board', 'Half Board (Breakfast + Dinner)'),
        ('full_board', 'Full Board (All Meals)'),
        ('custom', 'Custom Plan'),
    ]

    homestay = models.ForeignKey(Homestay, on_delete=models.CASCADE, related_name='meal_plans')

    plan_name = models.CharField(_('plan name'), max_length=100)
    meal_type = models.CharField(_('meal type'), max_length=20, choices=MEAL_TYPES)
    description = models.TextField(_('description'))

    # Pricing
    price_per_person = models.DecimalField(_('price per person per day'), max_digits=6, decimal_places=2)
    child_price = models.DecimalField(_('child price (under 12)'), max_digits=6, decimal_places=2, blank=True, null=True)

    # Details
    cuisine_type = models.CharField(_('cuisine type'), max_length=100, default='Traditional Kerala')
    dietary_options = models.JSONField(_('dietary options'), default=list, blank=True)  # ['vegetarian', 'vegan', 'jain']
    special_dishes = models.JSONField(_('special dishes'), default=list, blank=True)

    # Availability
    is_active = models.BooleanField(_('is active'), default=True)
    advance_notice_hours = models.PositiveIntegerField(_('advance notice required (hours)'), default=2)

    class Meta:
        db_table = 'homestay_meal_plans'
        verbose_name = _('Meal Plan')
        verbose_name_plural = _('Meal Plans')

    def __str__(self):
        return f"{self.homestay.name} - {self.plan_name}"


class Experience(TimeStampedModel, SlugModel):
    """Local experiences offered by homestays."""

    EXPERIENCE_TYPES = [
        ('cultural', 'Cultural Experience'),
        ('cooking', 'Cooking Class'),
        ('farming', 'Farm Activity'),
        ('craft', 'Traditional Craft'),
        ('nature', 'Nature Walk'),
        ('spiritual', 'Spiritual Experience'),
    ]

    homestay = models.ForeignKey(Homestay, on_delete=models.CASCADE, related_name='experiences')

    experience_type = models.CharField(_('experience type'), max_length=20, choices=EXPERIENCE_TYPES)
    description = models.TextField(_('description'))
    duration_hours = models.DecimalField(_('duration in hours'), max_digits=4, decimal_places=2)

    # Pricing
    price_per_person = models.DecimalField(_('price per person'), max_digits=6, decimal_places=2)
    minimum_participants = models.PositiveIntegerField(_('minimum participants'), default=1)
    maximum_participants = models.PositiveIntegerField(_('maximum participants'), default=10)

    # Requirements
    age_restriction = models.CharField(_('age restriction'), max_length=100, blank=True)
    fitness_level = models.CharField(_('fitness level required'), max_length=100, blank=True)
    equipment_provided = models.BooleanField(_('equipment provided'), default=True)
    equipment_list = models.JSONField(_('equipment list'), default=list, blank=True)

    # Scheduling
    available_times = models.JSONField(_('available times'), default=list, blank=True)  # ['morning', 'afternoon', 'evening']
    advance_booking_days = models.PositiveIntegerField(_('advance booking required (days)'), default=1)

    # Images
    images = models.JSONField(_('experience images'), default=list, blank=True)

    # Status
    is_active = models.BooleanField(_('is active'), default=True)

    class Meta:
        db_table = 'homestay_experiences'
        verbose_name = _('Experience')
        verbose_name_plural = _('Experiences')
        unique_together = ['homestay', 'slug']

    def __str__(self):
        return f"{self.homestay.name} - {self.name}"
