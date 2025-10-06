"""
Review and rating models for WayanTrails platform.
"""
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.contrib.auth import get_user_model
from core.models import TimeStampedModel

User = get_user_model()


class Review(TimeStampedModel):
    """Reviews for all bookable items."""

    CONTENT_TYPES = [
        ('resort', 'Resort'),
        ('homestay', 'Homestay'),
        ('vehicle', 'Vehicle'),
        ('destination', 'Destination'),
        ('activity', 'Activity'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')

    # Generic foreign key fields
    content_type = models.CharField(_('content type'), max_length=20, choices=CONTENT_TYPES)
    object_id = models.PositiveIntegerField()

    # Review content
    rating = models.PositiveIntegerField(_('rating'), choices=[(i, i) for i in range(1, 6)])
    title = models.CharField(_('review title'), max_length=200)
    comment = models.TextField(_('comment'))

    # Review images
    images = models.JSONField(_('review images'), default=list, blank=True)

    # Moderation
    is_approved = models.BooleanField(_('is approved'), default=False)
    moderated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='moderated_reviews')
    moderated_at = models.DateTimeField(_('moderated at'), blank=True, null=True)

    # Helpful votes
    helpful_count = models.PositiveIntegerField(_('helpful count'), default=0)

    class Meta:
        db_table = 'reviews'
        verbose_name = _('Review')
        verbose_name_plural = _('Reviews')
        unique_together = ['user', 'content_type', 'object_id']
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.get_full_name()} - {self.title}"
