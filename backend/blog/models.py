"""
Blog and content models for WayanTrails platform.
"""
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.contrib.auth import get_user_model
from core.models import TimeStampedModel, SlugModel, PublishableModel, SEOModel

User = get_user_model()


class BlogPost(TimeStampedModel, SlugModel, PublishableModel, SEOModel):
    """Blog posts for content marketing."""

    CATEGORIES = [
        ('travel_guide', 'Travel Guide'),
        ('local_culture', 'Local Culture'),
        ('adventure', 'Adventure'),
        ('food', 'Food & Cuisine'),
        ('events', 'Events & Festivals'),
    ]

    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='blog_posts')
    category = models.CharField(_('category'), max_length=20, choices=CATEGORIES)

    content = models.TextField(_('content'))
    excerpt = models.TextField(_('excerpt'), max_length=500)

    # Images
    featured_image = models.ImageField(_('featured image'), upload_to='blog/featured/')

    # SEO and social
    reading_time = models.PositiveIntegerField(_('reading time in minutes'), default=5)

    class Meta:
        db_table = 'blog_posts'
        verbose_name = _('Blog Post')
        verbose_name_plural = _('Blog Posts')
        ordering = ['-published_at', '-created_at']

    def __str__(self):
        return self.name
