"""
Booking serializers for WayanTrails platform.
"""
from rest_framework import serializers
from django.contrib.auth import get_user_model

from .models import (
    Booking, BookingItem, Payment, BookingStatusHistory,
    WhatsAppMessage, BookingAvailability
)

User = get_user_model()


class BookingItemSerializer(serializers.ModelSerializer):
    """Serializer for booking items."""

    class Meta:
        model = BookingItem
        fields = [
            'id', 'item_name', 'item_description', 'quantity',
            'unit_price', 'total_price', 'item_data'
        ]


class PaymentSerializer(serializers.ModelSerializer):
    """Serializer for payments."""

    class Meta:
        model = Payment
        fields = [
            'id', 'payment_id', 'amount', 'currency', 'payment_method',
            'status', 'refund_amount', 'created_at'
        ]
        read_only_fields = ['payment_id', 'status', 'created_at']


class BookingListSerializer(serializers.ModelSerializer):
    """Serializer for booking list view."""

    status_display = serializers.CharField(source='get_status_display', read_only=True)
    booking_type_display = serializers.CharField(source='get_booking_type_display', read_only=True)
    duration_nights = serializers.IntegerField(read_only=True)

    class Meta:
        model = Booking
        fields = [
            'id', 'booking_id', 'booking_number', 'guest_name',
            'booking_type', 'booking_type_display', 'status', 'status_display',
            'check_in_date', 'check_out_date', 'booking_date',
            'total_guests', 'total_amount', 'duration_nights', 'created_at'
        ]


class BookingDetailSerializer(serializers.ModelSerializer):
    """Serializer for booking detail view."""

    items = BookingItemSerializer(many=True, read_only=True)
    payments = PaymentSerializer(many=True, read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    booking_type_display = serializers.CharField(source='get_booking_type_display', read_only=True)
    booking_method_display = serializers.CharField(source='get_booking_method_display', read_only=True)
    duration_nights = serializers.IntegerField(read_only=True)

    class Meta:
        model = Booking
        fields = [
            'id', 'booking_id', 'booking_number', 'user', 'guest_name',
            'guest_email', 'guest_phone', 'booking_type', 'booking_type_display',
            'booking_method', 'booking_method_display', 'content_type', 'object_id',
            'check_in_date', 'check_out_date', 'booking_date', 'booking_time',
            'adults', 'children', 'total_guests', 'base_amount', 'tax_amount',
            'discount_amount', 'commission_amount', 'total_amount',
            'status', 'status_display', 'special_requests', 'admin_notes',
            'whatsapp_message_sent', 'confirmed_at', 'cancelled_at',
            'cancellation_reason', 'duration_nights', 'items', 'payments',
            'created_at', 'updated_at'
        ]


class BookingCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating bookings."""

    items = BookingItemSerializer(many=True, required=False)

    class Meta:
        model = Booking
        fields = [
            'guest_name', 'guest_email', 'guest_phone', 'booking_type',
            'booking_method', 'content_type', 'object_id', 'check_in_date',
            'check_out_date', 'booking_date', 'booking_time', 'adults',
            'children', 'total_guests', 'base_amount', 'tax_amount',
            'discount_amount', 'total_amount', 'special_requests', 'items'
        ]

    def validate(self, data):
        """Validate booking data."""
        # Ensure accommodation bookings have check-in/out dates
        if data['booking_type'] in ['resort', 'homestay']:
            if not data.get('check_in_date') or not data.get('check_out_date'):
                raise serializers.ValidationError(
                    "Check-in and check-out dates are required for accommodation bookings."
                )

            if data['check_in_date'] >= data['check_out_date']:
                raise serializers.ValidationError(
                    "Check-out date must be after check-in date."
                )

        # Ensure activity bookings have booking date
        elif data['booking_type'] in ['destination', 'service', 'rental']:
            if not data.get('booking_date'):
                raise serializers.ValidationError(
                    "Booking date is required for activity/service bookings."
                )

        return data

    def create(self, validated_data):
        """Create booking with items."""
        items_data = validated_data.pop('items', [])

        # Set user if authenticated
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            validated_data['user'] = request.user

        # Calculate commission (5% default)
        commission_rate = 0.05
        validated_data['commission_amount'] = validated_data['base_amount'] * commission_rate

        booking = Booking.objects.create(**validated_data)

        # Create booking items
        for item_data in items_data:
            BookingItem.objects.create(booking=booking, **item_data)

        return booking


class BookingUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating booking status."""

    class Meta:
        model = Booking
        fields = ['status', 'admin_notes', 'cancellation_reason']

    def update(self, instance, validated_data):
        """Update booking and track status changes."""
        old_status = instance.status
        new_status = validated_data.get('status', old_status)

        # Track status change
        if old_status != new_status:
            BookingStatusHistory.objects.create(
                booking=instance,
                old_status=old_status,
                new_status=new_status,
                changed_by=self.context['request'].user,
                reason=validated_data.get('admin_notes', '')
            )

        return super().update(instance, validated_data)


class AvailabilityCheckSerializer(serializers.Serializer):
    """Serializer for checking availability."""

    content_type = serializers.CharField()
    object_id = serializers.IntegerField()
    date = serializers.DateField()
    guests = serializers.IntegerField(default=1)

    def validate_content_type(self, value):
        """Validate content type."""
        valid_types = ['resort', 'homestay', 'destination', 'service', 'rental']
        if value not in valid_types:
            raise serializers.ValidationError(f"Invalid content type. Must be one of: {valid_types}")
        return value


class BookingAvailabilitySerializer(serializers.ModelSerializer):
    """Serializer for booking availability."""

    remaining_slots = serializers.IntegerField(read_only=True)

    class Meta:
        model = BookingAvailability
        fields = [
            'content_type', 'object_id', 'date', 'available_slots',
            'booked_slots', 'remaining_slots', 'price_override',
            'is_blocked', 'block_reason'
        ]


class WhatsAppMessageSerializer(serializers.ModelSerializer):
    """Serializer for WhatsApp messages."""

    message_type_display = serializers.CharField(source='get_message_type_display', read_only=True)

    class Meta:
        model = WhatsAppMessage
        fields = [
            'id', 'message_type', 'message_type_display', 'phone_number',
            'message_text', 'is_sent', 'sent_at', 'response_received',
            'response_text', 'response_at', 'created_at'
        ]
        read_only_fields = ['is_sent', 'sent_at', 'response_received', 'response_at']


class BookingReportSerializer(serializers.Serializer):
    """Serializer for booking reports and analytics."""

    start_date = serializers.DateField()
    end_date = serializers.DateField()
    booking_type = serializers.CharField(required=False)
    status = serializers.CharField(required=False)

    def validate(self, data):
        """Validate date range."""
        if data['start_date'] > data['end_date']:
            raise serializers.ValidationError("Start date must be before end date.")
        return data