"""
Booking admin interface for WayanTrails platform.
"""
from django.contrib import admin
from django.utils.html import format_html
from django.utils import timezone

from .models import (
    Booking, BookingItem, Payment, BookingStatusHistory,
    WhatsAppMessage, BookingAvailability
)


class BookingItemInline(admin.TabularInline):
    """Inline admin for booking items."""
    model = BookingItem
    extra = 1
    fields = ['item_name', 'item_description', 'quantity', 'unit_price', 'total_price']


class PaymentInline(admin.TabularInline):
    """Inline admin for payments."""
    model = Payment
    extra = 1
    fields = ['payment_method_type', 'amount', 'status', 'payment_id']
    readonly_fields = ['payment_id']


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    """Admin interface for bookings."""

    list_display = [
        'booking_number', 'guest_name', 'booking_type_display', 'status_display',
        'total_amount_display', 'booking_date_display', 'whatsapp_status', 'created_at'
    ]
    list_filter = [
        'booking_type', 'status', 'booking_method', 'whatsapp_message_sent',
        'created_at', 'booking_date'
    ]
    search_fields = [
        'booking_number', 'guest_name', 'guest_email', 'guest_phone',
        'special_requests'
    ]
    readonly_fields = [
        'booking_id', 'booking_number', 'created_at', 'updated_at',
        'confirmed_at', 'cancelled_at'
    ]

    fieldsets = (
        ('Booking Information', {
            'fields': (
                'booking_id', 'booking_number', 'booking_type', 'booking_method',
                'status', 'content_type', 'object_id'
            )
        }),
        ('Guest Details', {
            'fields': (
                'user', 'guest_name', 'guest_email', 'guest_phone'
            )
        }),
        ('Dates and Guests', {
            'fields': (
                'check_in_date', 'check_out_date', 'booking_date', 'booking_time',
                'adults', 'children', 'total_guests'
            )
        }),
        ('Pricing', {
            'fields': (
                'base_amount', 'tax_amount', 'discount_amount', 'commission_amount',
                'total_amount'
            )
        }),
        ('Additional Information', {
            'fields': (
                'special_requests', 'admin_notes'
            )
        }),
        ('Timestamps', {
            'fields': (
                'created_at', 'updated_at', 'confirmed_at', 'cancelled_at'
            ),
            'classes': ('collapse',)
        })
    )

    inlines = [BookingItemInline, PaymentInline]

    def booking_type_display(self, obj):
        """Display booking type with icon."""
        icons = {
            'resort': '🏨',
            'homestay': '🏠',
            'rental': '🚗',
            'destination': '🌄',
            'service': '🎯'
        }
        icon = icons.get(obj.booking_type, '📋')
        return f"{icon} {obj.get_booking_type_display()}"
    booking_type_display.short_description = 'Type'

    def status_display(self, obj):
        """Display status with color coding."""
        colors = {
            'pending': '#ff9800',
            'confirmed': '#4caf50',
            'cancelled': '#f44336',
            'completed': '#2196f3',
            'refunded': '#9c27b0',
            'no_show': '#607d8b'
        }
        color = colors.get(obj.status, '#000000')
        return format_html(
            '<span style="color: {}; font-weight: bold;">{}</span>',
            color,
            obj.get_status_display()
        )
    status_display.short_description = 'Status'

    def total_amount_display(self, obj):
        """Display total amount with currency symbol."""
        return f"₹{obj.total_amount:,.0f}"
    total_amount_display.short_description = 'Amount'

    def booking_date_display(self, obj):
        """Display relevant booking date."""
        if obj.is_accommodation_booking:
            return f"{obj.check_in_date} to {obj.check_out_date}"
        return obj.booking_date
    booking_date_display.short_description = 'Dates'

    def whatsapp_status(self, obj):
        """Display WhatsApp status."""
        if obj.whatsapp_message_sent:
            return format_html('<span style="color: green;">✓ Sent</span>')
        return format_html('<span style="color: red;">✗ Not Sent</span>')
    whatsapp_status.short_description = 'WhatsApp'


@admin.register(BookingItem)
class BookingItemAdmin(admin.ModelAdmin):
    """Admin interface for booking items."""

    list_display = ['booking', 'item_name', 'quantity', 'unit_price', 'total_price']
    list_filter = ['booking__booking_type']
    search_fields = ['item_name', 'booking__booking_number', 'booking__guest_name']


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    """Admin interface for payments."""

    list_display = [
        'payment_id', 'booking', 'amount', 'payment_method_type', 'status_display', 'created_at'
    ]
    list_filter = ['payment_method_type', 'status', 'created_at']
    search_fields = ['payment_id', 'booking__booking_number', 'booking__guest_name']
    readonly_fields = ['payment_id', 'gateway_payment_id', 'gateway_response', 'created_at']

    def status_display(self, obj):
        """Display payment status with color coding."""
        colors = {
            'pending': '#ff9800',
            'processing': '#2196f3',
            'completed': '#4caf50',
            'failed': '#f44336',
            'refunded': '#9c27b0',
            'partially_refunded': '#ff5722'
        }
        color = colors.get(obj.status, '#000000')
        return format_html(
            '<span style="color: {}; font-weight: bold;">{}</span>',
            color,
            obj.get_status_display()
        )
    status_display.short_description = 'Status'


@admin.register(BookingAvailability)
class BookingAvailabilityAdmin(admin.ModelAdmin):
    """Admin interface for booking availability."""

    list_display = [
        'content_type', 'object_id', 'date', 'available_slots',
        'booked_slots', 'remaining_slots', 'is_blocked'
    ]
    list_filter = ['content_type', 'is_blocked', 'date']
    search_fields = ['content_type', 'object_id', 'block_reason']

    def remaining_slots(self, obj):
        """Display remaining slots."""
        remaining = obj.remaining_slots
        if remaining <= 0:
            return format_html('<span style="color: red; font-weight: bold;">0</span>')
        elif remaining <= 2:
            return format_html('<span style="color: orange; font-weight: bold;">{}</span>', remaining)
        return remaining
    remaining_slots.short_description = 'Remaining'


@admin.register(WhatsAppMessage)
class WhatsAppMessageAdmin(admin.ModelAdmin):
    """Admin interface for WhatsApp messages."""

    list_display = [
        'booking', 'message_type', 'phone_number', 'is_sent',
        'sent_at', 'response_received'
    ]
    list_filter = ['message_type', 'is_sent', 'response_received', 'created_at']
    search_fields = ['booking__booking_number', 'phone_number', 'message_text']
    readonly_fields = ['sent_at', 'response_at', 'created_at']


@admin.register(BookingStatusHistory)
class BookingStatusHistoryAdmin(admin.ModelAdmin):
    """Admin interface for booking status history."""

    list_display = ['booking', 'old_status', 'new_status', 'changed_by', 'created_at']
    list_filter = ['old_status', 'new_status', 'created_at']
    search_fields = ['booking__booking_number', 'reason']
    readonly_fields = ['created_at']
