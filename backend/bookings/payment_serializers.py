"""
Payment serializers for WayanTrails booking system.
"""
from rest_framework import serializers
from .models import Payment, Booking


class PaymentSerializer(serializers.ModelSerializer):
    """Serializer for Payment model."""

    payment_method_display = serializers.CharField(source='get_payment_method_type_display', read_only=True)
    payment_gateway_display = serializers.CharField(source='get_payment_gateway_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Payment
        fields = [
            'id',
            'payment_id',
            'order_id',
            'gateway_payment_id',
            'booking',
            'amount',
            'currency',
            'payment_gateway',
            'payment_gateway_display',
            'payment_method_type',
            'payment_method_display',
            'status',
            'status_display',
            'upi_id',
            'card_last_4',
            'card_network',
            'wallet_name',
            'payment_link',
            'created_at',
            'paid_at',
            'expires_at',
            'is_verified',
        ]
        read_only_fields = [
            'id',
            'payment_id',
            'order_id',
            'gateway_payment_id',
            'created_at',
            'paid_at',
            'is_verified',
        ]


class PaymentCreateSerializer(serializers.Serializer):
    """Serializer for creating payment order."""

    booking_id = serializers.UUIDField(help_text="Booking UUID")
    payment_type = serializers.ChoiceField(
        choices=['order', 'payment_link'],
        default='order',
        help_text="Type of payment: 'order' for checkout, 'payment_link' for link"
    )

    def validate_booking_id(self, value):
        """Validate booking exists and is in valid state."""
        try:
            booking = Booking.objects.get(booking_id=value)

            # Check if booking is in valid state for payment
            if booking.status not in ['pending', 'confirmed']:
                raise serializers.ValidationError(
                    "Booking must be in pending or confirmed status for payment"
                )

            # Check if payment already completed
            completed_payment = booking.payments.filter(
                status__in=['completed', 'captured']
            ).exists()

            if completed_payment:
                raise serializers.ValidationError(
                    "Payment already completed for this booking"
                )

            return value

        except Booking.DoesNotExist:
            raise serializers.ValidationError("Booking not found")


class PaymentVerifySerializer(serializers.Serializer):
    """Serializer for verifying payment."""

    razorpay_order_id = serializers.CharField(required=True)
    razorpay_payment_id = serializers.CharField(required=True)
    razorpay_signature = serializers.CharField(required=True)


class PaymentCallbackSerializer(serializers.Serializer):
    """Serializer for payment callback/webhook."""

    event = serializers.CharField()
    payload = serializers.JSONField()


class RefundCreateSerializer(serializers.Serializer):
    """Serializer for creating refund."""

    payment_id = serializers.CharField(help_text="Our internal payment ID")
    amount = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        required=False,
        help_text="Amount to refund (full refund if not specified)"
    )
    reason = serializers.CharField(
        required=False,
        help_text="Reason for refund"
    )

    def validate_payment_id(self, value):
        """Validate payment exists and can be refunded."""
        try:
            payment = Payment.objects.get(payment_id=value)

            if payment.status not in ['completed', 'captured']:
                raise serializers.ValidationError(
                    "Only completed payments can be refunded"
                )

            if payment.status in ['refunded', 'partially_refunded']:
                raise serializers.ValidationError(
                    "Payment already refunded"
                )

            return value

        except Payment.DoesNotExist:
            raise serializers.ValidationError("Payment not found")


class PaymentLinkSerializer(serializers.Serializer):
    """Serializer for payment link details."""

    payment_link = serializers.URLField()
    payment_link_id = serializers.CharField()
    payment_id = serializers.CharField()
    expires_at = serializers.DateTimeField()
    amount = serializers.DecimalField(max_digits=10, decimal_places=2)
    booking_number = serializers.CharField()


class PaymentOrderSerializer(serializers.Serializer):
    """Serializer for payment order details (for frontend Razorpay integration)."""

    order_id = serializers.CharField()
    payment_id = serializers.CharField()
    amount = serializers.DecimalField(max_digits=10, decimal_places=2)
    currency = serializers.CharField()
    key = serializers.CharField()  # Razorpay public key
    name = serializers.CharField()
    description = serializers.CharField()
    prefill = serializers.DictField()
    notes = serializers.DictField()
    theme = serializers.DictField()


class PaymentMethodInfoSerializer(serializers.Serializer):
    """Serializer for payment method information."""

    method = serializers.CharField(help_text="Payment method type")
    display_name = serializers.CharField()
    icon = serializers.CharField(required=False)
    description = serializers.CharField(required=False)
    enabled = serializers.BooleanField(default=True)


class PaymentSummarySerializer(serializers.Serializer):
    """Serializer for payment summary in booking."""

    total_paid = serializers.DecimalField(max_digits=10, decimal_places=2)
    payment_status = serializers.CharField()
    payment_method = serializers.CharField()
    paid_at = serializers.DateTimeField()
    transaction_id = serializers.CharField()
