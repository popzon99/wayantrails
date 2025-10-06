"""
Core models for WayanTrails platform.
Base classes and shared utilities.
"""
from django.db import models
from django.utils.translation import gettext_lazy as _


class TimeStampedModel(models.Model):
    """Abstract base class with timestamps for all models."""

    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)

    class Meta:
        abstract = True


class AddressModel(models.Model):
    """Abstract base class for addresses."""

    address_line_1 = models.CharField(_('address line 1'), max_length=255)
    address_line_2 = models.CharField(_('address line 2'), max_length=255, blank=True)
    city = models.CharField(_('city'), max_length=100)
    state = models.CharField(_('state'), max_length=100, default='Kerala')
    postal_code = models.CharField(_('postal code'), max_length=10)
    country = models.CharField(_('country'), max_length=100, default='India')

    # Geographic coordinates
    latitude = models.DecimalField(_('latitude'), max_digits=10, decimal_places=7, blank=True, null=True)
    longitude = models.DecimalField(_('longitude'), max_digits=10, decimal_places=7, blank=True, null=True)

    class Meta:
        abstract = True

    @property
    def full_address(self):
        """Return formatted full address."""
        parts = [self.address_line_1]
        if self.address_line_2:
            parts.append(self.address_line_2)
        parts.extend([self.city, self.state, self.postal_code])
        return ', '.join(parts)


class SlugModel(models.Model):
    """Abstract base class for models with slugs."""

    name = models.CharField(_('name'), max_length=200)
    slug = models.SlugField(_('slug'), max_length=200, unique=True)

    class Meta:
        abstract = True

    def __str__(self):
        return self.name


class PublishableModel(models.Model):
    """Abstract base class for publishable content."""

    is_active = models.BooleanField(_('is active'), default=True)
    is_featured = models.BooleanField(_('is featured'), default=False)
    published_at = models.DateTimeField(_('published at'), blank=True, null=True)

    class Meta:
        abstract = True


class SEOModel(models.Model):
    """Abstract base class for SEO-friendly content."""

    meta_title = models.CharField(_('meta title'), max_length=160, blank=True)
    meta_description = models.TextField(_('meta description'), max_length=320, blank=True)
    meta_keywords = models.CharField(_('meta keywords'), max_length=255, blank=True)

    class Meta:
        abstract = True