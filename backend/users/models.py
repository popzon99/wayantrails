"""
User models for WayanTrails platform.
"""
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _
from phonenumber_field.modelfields import PhoneNumberField


class User(AbstractUser):
    """Custom User model with phone authentication."""
    
    email = models.EmailField(_('email address'), blank=True)
    phone = PhoneNumberField(_('phone number'), unique=True, null=True, blank=True)
    first_name = models.CharField(_('first name'), max_length=50, blank=True)
    last_name = models.CharField(_('last name'), max_length=50, blank=True)
    
    # Profile fields
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    date_of_birth = models.DateField(blank=True, null=True)
    nationality = models.CharField(max_length=100, blank=True)
    
    # Preferences
    preferred_language = models.CharField(
        max_length=10,
        choices=[('en', 'English'), ('ml', 'Malayalam')],
        default='en'
    )
    marketing_emails = models.BooleanField(default=True)
    whatsapp_notifications = models.BooleanField(default=True)
    
    # Metadata
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    USERNAME_FIELD = 'phone'
    REQUIRED_FIELDS = ['username']
    
    class Meta:
        db_table = 'users'
        verbose_name = _('User')
        verbose_name_plural = _('Users')
    
    def __str__(self):
        return f"{self.get_full_name() or self.username}"
    
    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}".strip()
    
    def get_full_name(self):
        return self.full_name or self.username


class UserProfile(models.Model):
    """Extended user profile information."""
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    
    # Travel preferences
    budget_range = models.CharField(
        max_length=20,
        choices=[
            ('budget', 'Budget (₹1000-3000)'),
            ('mid', 'Mid-range (₹3000-8000)'),
            ('luxury', 'Luxury (₹8000+)'),
        ],
        blank=True
    )
    
    travel_style = models.CharField(
        max_length=20,
        choices=[
            ('solo', 'Solo Travel'),
            ('couple', 'Couple'),
            ('family', 'Family'),
            ('group', 'Group'),
        ],
        blank=True
    )
    
    interests = models.JSONField(default=list, blank=True)  # ['nature', 'adventure', 'culture']
    
    # Emergency contact
    emergency_name = models.CharField(max_length=100, blank=True)
    emergency_phone = PhoneNumberField(blank=True, null=True)
    
    # Booking statistics
    total_bookings = models.PositiveIntegerField(default=0)
    total_spent = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'user_profiles'
        verbose_name = _('User Profile')
        verbose_name_plural = _('User Profiles')
    
    def __str__(self):
        return f"Profile of {self.user.get_full_name()}"


class OTPVerification(models.Model):
    """OTP verification for phone numbers."""
    
    phone = PhoneNumberField(_('phone number'))
    otp = models.CharField(max_length=6)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    
    class Meta:
        db_table = 'otp_verifications'
        verbose_name = _('OTP Verification')
        verbose_name_plural = _('OTP Verifications')
        ordering = ['-created_at']
    
    def __str__(self):
        return f"OTP for {self.phone}"
    
    @property
    def is_expired(self):
        from django.utils import timezone
        return timezone.now() > self.expires_at


class Wishlist(models.Model):
    """User wishlist for saved items."""
    
    CONTENT_TYPES = [
        ('resort', 'Resort'),
        ('homestay', 'Homestay'),
        ('rental', 'Rental'),
        ('destination', 'Destination'),
        ('service', 'Service'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='wishlist')
    content_type = models.CharField(max_length=20, choices=CONTENT_TYPES)
    object_id = models.PositiveIntegerField()
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'wishlists'
        unique_together = ['user', 'content_type', 'object_id']
        verbose_name = _('Wishlist Item')
        verbose_name_plural = _('Wishlist Items')
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.get_full_name()}'s wishlist item"