"""
Local service models for WayanTrails platform.
Guides, taxi services, photographers, etc.
"""
from django.db import models
from django.utils.translation import gettext_lazy as _
from core.models import TimeStampedModel, AddressModel, SlugModel, PublishableModel


class Service(TimeStampedModel, AddressModel, SlugModel, PublishableModel):
    """Local services like guides, taxis, photographers."""

    SERVICE_TYPES = [
        ('guide', 'Tour Guide'),
        ('taxi', 'Taxi Service'),
        ('photography', 'Photography'),
        ('catering', 'Catering'),
        ('event', 'Event Management'),
    ]

    service_type = models.CharField(_('service type'), max_length=20, choices=SERVICE_TYPES)
    description = models.TextField(_('description'))

    # Provider details
    provider_name = models.CharField(_('provider name'), max_length=100)
    phone = models.CharField(_('phone'), max_length=20)
    email = models.EmailField(_('email'), blank=True)

    # Pricing
    price_per_hour = models.DecimalField(_('price per hour'), max_digits=6, decimal_places=2, blank=True, null=True)
    price_per_day = models.DecimalField(_('price per day'), max_digits=8, decimal_places=2, blank=True, null=True)

    # Images
    cover_image = models.ImageField(_('cover image'), upload_to='services/covers/')

    class Meta:
        db_table = 'services'
        verbose_name = _('Service')
        verbose_name_plural = _('Services')

    def __str__(self):
        return self.name
