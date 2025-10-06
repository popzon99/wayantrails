"""
Booking models for WayanTrails platform.
Handles both hybrid (manual) and online (automated) booking systems.
"""
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.contrib.auth import get_user_model
from phonenumber_field.modelfields import PhoneNumberField
from core.models import TimeStampedModel
import uuid

User = get_user_model()


class Booking(TimeStampedModel):
    """Unified booking model for all services."""
    
    BOOKING_TYPES = [
        ('resort', 'Resort'),
        ('homestay', 'Homestay'),
        ('rental', 'Rental'),
        ('destination', 'Destination/Activity'),
        ('service', 'Local Service'),
    ]
    
    BOOKING_STATUS = [
        ('pending', 'Pending Confirmation'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
        ('completed', 'Completed'),
        ('refunded', 'Refunded'),
        ('no_show', 'No Show'),
    ]
    
    BOOKING_METHOD = [
        ('hybrid', 'Hybrid (Form → WhatsApp)'),
        ('online', 'Online (Instant)'),
    ]
    
    # Unique booking identifier
    booking_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    booking_number = models.CharField(max_length=20, unique=True)  # Human-friendly: WT-2024-001
    
    # User and contact info
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookings', null=True, blank=True)
    guest_name = models.CharField(max_length=100)
    guest_email = models.EmailField()
    guest_phone = PhoneNumberField()
    
    # Booking details
    booking_type = models.CharField(max_length=20, choices=BOOKING_TYPES)
    booking_method = models.CharField(max_length=10, choices=BOOKING_METHOD, default='hybrid')
    
    # Generic foreign key to the booked item
    content_type = models.CharField(max_length=20)  # 'resort', 'homestay', etc.
    object_id = models.PositiveIntegerField()
    
    # Dates and guests
    check_in_date = models.DateField(blank=True, null=True)
    check_out_date = models.DateField(blank=True, null=True)
    booking_date = models.DateField()  # For activities/services
    booking_time = models.TimeField(blank=True, null=True)
    
    adults = models.PositiveIntegerField(default=2)
    children = models.PositiveIntegerField(default=0)
    total_guests = models.PositiveIntegerField()
    
    # Pricing
    base_amount = models.DecimalField(max_digits=10, decimal_places=2)
    tax_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    commission_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    
    # Status and tracking
    status = models.CharField(max_length=20, choices=BOOKING_STATUS, default='pending')
    
    # Special requests and notes
    special_requests = models.TextField(blank=True)
    admin_notes = models.TextField(blank=True)
    
    # WhatsApp integration
    whatsapp_message_sent = models.BooleanField(default=False)
    whatsapp_message_text = models.TextField(blank=True)
    
    # Confirmation details
    confirmed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='confirmed_bookings')
    confirmed_at = models.DateTimeField(blank=True, null=True)
    
    # Cancellation
    cancelled_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='cancelled_bookings')
    cancelled_at = models.DateTimeField(blank=True, null=True)
    cancellation_reason = models.TextField(blank=True)
    
    class Meta:
        db_table = 'bookings'
        verbose_name = _('Booking')
        verbose_name_plural = _('Bookings')
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['booking_number']),
            models.Index(fields=['user', 'status']),
            models.Index(fields=['booking_type', 'status']),
            models.Index(fields=['booking_date', 'status']),
        ]
    
    def __str__(self):
        return f"Booking {self.booking_number} - {self.guest_name}"
    
    def save(self, *args, **kwargs):
        if not self.booking_number:
            self.booking_number = self.generate_booking_number()
        super().save(*args, **kwargs)
    
    def generate_booking_number(self):
        """Generate human-friendly booking number."""
        from django.utils import timezone
        year = timezone.now().year
        count = Booking.objects.filter(created_at__year=year).count() + 1
        return f"WT-{year}-{count:04d}"
    
    @property
    def duration_nights(self):
        """Calculate number of nights for accommodation bookings."""
        if self.check_in_date and self.check_out_date:
            return (self.check_out_date - self.check_in_date).days
        return 0
    
    @property
    def is_accommodation_booking(self):
        """Check if this is an accommodation booking."""
        return self.booking_type in ['resort', 'homestay']
    
    @property
    def is_activity_booking(self):
        """Check if this is an activity booking."""
        return self.booking_type == 'destination'

    def get_whatsapp_link(self):
        """Generate WhatsApp link with pre-filled booking details."""
        from urllib.parse import quote

        phone = "919876543210"  # WayanTrails support number

        # Get resort/homestay name
        service_name = "Service"
        if self.booking_type == 'resort':
            from resorts.models import Resort
            service = Resort.objects.filter(id=self.object_id).first()
            service_name = service.name if service else "Resort"
        elif self.booking_type == 'homestay':
            from homestays.models import Homestay
            service = Homestay.objects.filter(id=self.object_id).first()
            service_name = service.name if service else "Homestay"

        # Build message
        message_parts = [
            "Hi WayanTrails Team!",
            "",
            "I would like to book:",
            f"🏨 *{service_name}*",
            ""
        ]

        # Add dates for accommodation bookings
        if self.is_accommodation_booking and self.check_in_date and self.check_out_date:
            message_parts.extend([
                f"📅 Check-in: {self.check_in_date.strftime('%d %b %Y')}",
                f"📅 Check-out: {self.check_out_date.strftime('%d %b %Y')}",
                f"🌙 Duration: {self.duration_nights} nights",
                ""
            ])

        # Add booking date for activities/services
        if self.booking_date:
            message_parts.append(f"📅 Date: {self.booking_date.strftime('%d %b %Y')}")
            if self.booking_time:
                message_parts.append(f"🕐 Time: {self.booking_time.strftime('%I:%M %p')}")
            message_parts.append("")

        # Add guests
        guest_text = f"👥 Guests: {self.adults} Adults"
        if self.children > 0:
            guest_text += f", {self.children} Children"
        message_parts.append(guest_text)

        # Add pricing
        message_parts.extend([
            "",
            f"💰 Total Amount: ₹{self.total_amount}",
            "",
            f"📝 Booking Reference: #{self.booking_number}",
        ])

        # Add special requests if any
        if self.special_requests:
            message_parts.extend([
                "",
                f"Special Requests: {self.special_requests}"
            ])

        message_parts.extend([
            "",
            "Please confirm availability and send payment link.",
            "Thank you!"
        ])

        message = "\n".join(message_parts)
        encoded_message = quote(message)

        return f"https://wa.me/{phone}?text={encoded_message}"


class BookingItem(TimeStampedModel):
    """Individual items within a booking (e.g., different room types)."""
    
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE, related_name='items')
    
    # Item details
    item_name = models.CharField(max_length=200)  # "Deluxe Room", "Scooter Rental", etc.
    item_description = models.TextField(blank=True)
    
    # Quantity and pricing
    quantity = models.PositiveIntegerField(default=1)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    
    # Item-specific data
    item_data = models.JSONField(default=dict, blank=True)  # Store specific details
    
    class Meta:
        db_table = 'booking_items'
        verbose_name = _('Booking Item')
        verbose_name_plural = _('Booking Items')
    
    def __str__(self):
        return f"{self.booking.booking_number} - {self.item_name}"


class Payment(TimeStampedModel):
    """Payment tracking for bookings with support for multiple payment methods."""

    PAYMENT_STATUS = [
        ('created', 'Created'),
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('authorized', 'Authorized'),
        ('captured', 'Captured'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('cancelled', 'Cancelled'),
        ('refunded', 'Refunded'),
        ('partially_refunded', 'Partially Refunded'),
    ]

    PAYMENT_GATEWAY = [
        ('razorpay', 'Razorpay'),
        ('phonepe', 'PhonePe'),
        ('paytm', 'Paytm'),
        ('googlepay', 'Google Pay'),
        ('stripe', 'Stripe'),
        ('cash', 'Cash'),
        ('bank_transfer', 'Bank Transfer'),
    ]

    PAYMENT_METHOD_TYPE = [
        ('upi', 'UPI'),
        ('card', 'Debit/Credit Card'),
        ('netbanking', 'Net Banking'),
        ('wallet', 'Digital Wallet'),
        ('emi', 'EMI'),
        ('cash', 'Cash'),
        ('bank_transfer', 'Bank Transfer'),
    ]

    booking = models.ForeignKey(Booking, on_delete=models.CASCADE, related_name='payments')

    # Payment identification
    payment_id = models.CharField(max_length=100, unique=True)  # Our internal payment ID
    order_id = models.CharField(max_length=100, blank=True)  # Gateway order ID
    gateway_payment_id = models.CharField(max_length=200, blank=True)  # Gateway's payment ID

    # Payment link (for payment links)
    payment_link = models.URLField(blank=True, null=True)
    payment_link_id = models.CharField(max_length=100, blank=True)

    # Amount details
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='INR')

    # Gateway and method information
    payment_gateway = models.CharField(max_length=20, choices=PAYMENT_GATEWAY, default='razorpay')
    payment_method_type = models.CharField(max_length=20, choices=PAYMENT_METHOD_TYPE, blank=True)

    # Specific payment method details (for UPI, card, etc.)
    upi_id = models.CharField(max_length=100, blank=True)  # For UPI payments
    card_last_4 = models.CharField(max_length=4, blank=True)  # Last 4 digits of card
    card_network = models.CharField(max_length=20, blank=True)  # Visa, Mastercard, etc.
    wallet_name = models.CharField(max_length=50, blank=True)  # PhonePe, Paytm, etc.

    # Status tracking
    status = models.CharField(max_length=20, choices=PAYMENT_STATUS, default='created')

    # Error handling
    error_code = models.CharField(max_length=50, blank=True)
    error_description = models.TextField(blank=True)

    # Timestamps
    paid_at = models.DateTimeField(null=True, blank=True)
    authorized_at = models.DateTimeField(null=True, blank=True)

    # Gateway response (stores complete response)
    gateway_response = models.JSONField(default=dict, blank=True)

    # Payment link expiry
    expires_at = models.DateTimeField(null=True, blank=True)

    # Refund details
    refund_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    refund_id = models.CharField(max_length=100, blank=True)
    refund_reason = models.TextField(blank=True)
    refunded_at = models.DateTimeField(blank=True, null=True)

    # Payment verification
    signature = models.CharField(max_length=500, blank=True)  # For payment verification
    is_verified = models.BooleanField(default=False)
    
    class Meta:
        db_table = 'payments'
        verbose_name = _('Payment')
        verbose_name_plural = _('Payments')
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['booking', 'status']),
            models.Index(fields=['payment_method_type', 'status']),
        ]
    
    def __str__(self):
        return f"Payment {self.payment_id} - ₹{self.amount}"


class BookingStatusHistory(TimeStampedModel):
    """Track status changes for bookings."""
    
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE, related_name='status_history')
    
    old_status = models.CharField(max_length=20)
    new_status = models.CharField(max_length=20)
    
    changed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    reason = models.TextField(blank=True)
    
    class Meta:
        db_table = 'booking_status_history'
        verbose_name = _('Booking Status History')
        verbose_name_plural = _('Booking Status Histories')
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.booking.booking_number}: {self.old_status} → {self.new_status}"


class WhatsAppMessage(TimeStampedModel):
    """Track WhatsApp messages sent for bookings."""
    
    MESSAGE_TYPES = [
        ('booking_inquiry', 'Booking Inquiry'),
        ('confirmation', 'Booking Confirmation'),
        ('reminder', 'Reminder'),
        ('cancellation', 'Cancellation'),
        ('payment_link', 'Payment Link'),
    ]
    
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE, related_name='whatsapp_messages')
    
    message_type = models.CharField(max_length=20, choices=MESSAGE_TYPES)
    phone_number = PhoneNumberField()
    message_text = models.TextField()
    
    # Status
    is_sent = models.BooleanField(default=False)
    sent_at = models.DateTimeField(blank=True, null=True)
    
    # Response tracking
    response_received = models.BooleanField(default=False)
    response_text = models.TextField(blank=True)
    response_at = models.DateTimeField(blank=True, null=True)
    
    class Meta:
        db_table = 'whatsapp_messages'
        verbose_name = _('WhatsApp Message')
        verbose_name_plural = _('WhatsApp Messages')
        ordering = ['-created_at']
    
    def __str__(self):
        return f"WhatsApp {self.message_type} for {self.booking.booking_number}"


class BookingAvailability(TimeStampedModel):
    """Track availability for bookable items."""
    
    # Generic reference to any bookable item
    content_type = models.CharField(max_length=20)  # 'resort', 'activity', etc.
    object_id = models.PositiveIntegerField()
    
    date = models.DateField()
    available_slots = models.PositiveIntegerField(default=1)
    booked_slots = models.PositiveIntegerField(default=0)
    
    # Pricing override for specific dates
    price_override = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    
    # Block booking (maintenance, holidays, etc.)
    is_blocked = models.BooleanField(default=False)
    block_reason = models.CharField(max_length=200, blank=True)
    
    class Meta:
        db_table = 'booking_availability'
        verbose_name = _('Booking Availability')
        verbose_name_plural = _('Booking Availability')
        unique_together = ['content_type', 'object_id', 'date']
        indexes = [
            models.Index(fields=['content_type', 'object_id', 'date']),
            models.Index(fields=['date', 'available_slots']),
        ]
    
    def __str__(self):
        return f"Availability for {self.content_type}#{self.object_id} on {self.date}"
    
    @property
    def remaining_slots(self):
        """Calculate remaining available slots."""
        return max(0, self.available_slots - self.booked_slots)