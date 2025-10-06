"""
Payment API views for WayanTrails booking system.
Handles payment creation, verification, and webhooks.
"""
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.shortcuts import get_object_or_404
from django.conf import settings
from django.utils import timezone
import json
import hmac
import hashlib

from .models import Payment, Booking
from .payment_serializers import (
    PaymentSerializer,
    PaymentCreateSerializer,
    PaymentVerifySerializer,
    PaymentCallbackSerializer,
    RefundCreateSerializer,
    PaymentLinkSerializer,
    PaymentOrderSerializer,
    PaymentMethodInfoSerializer,
)

# Import both real and mock gateways
from .payment_gateway import razorpay_gateway
from .mock_payment_gateway import mock_payment_gateway

# Use mock gateway if USE_MOCK_PAYMENT is True
def get_payment_gateway():
    """Get appropriate payment gateway based on settings."""
    use_mock = getattr(settings, 'USE_MOCK_PAYMENT', True)  # Default to mock for testing
    return mock_payment_gateway if use_mock else razorpay_gateway

# Use this throughout the file
payment_gateway = get_payment_gateway()


class PaymentViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for viewing payments."""

    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Return payments for current user's bookings."""
        if self.request.user.is_staff:
            return Payment.objects.all().select_related('booking')

        return Payment.objects.filter(
            booking__user=self.request.user
        ).select_related('booking')


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_payment_order(request):
    """
    Create a Razorpay order for payment.
    Supports all payment methods: UPI, Cards, Net Banking, Wallets.

    POST /api/payments/create-order/
    Body: {
        "booking_id": "uuid",
        "payment_type": "order"  # or "payment_link"
    }
    """
    serializer = PaymentCreateSerializer(data=request.data)

    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    booking_id = serializer.validated_data['booking_id']
    payment_type = serializer.validated_data['payment_type']

    try:
        booking = Booking.objects.get(booking_id=booking_id)

        # Check if user owns the booking
        if booking.user != request.user and not request.user.is_staff:
            return Response(
                {'error': 'You do not have permission to pay for this booking'},
                status=status.HTTP_403_FORBIDDEN
            )

        if payment_type == 'payment_link':
            # Create payment link
            result = payment_gateway.create_payment_link(booking)
            return Response({
                'type': 'payment_link',
                'data': result,
                'booking_number': booking.booking_number
            })
        else:
            # Create order for Razorpay checkout
            order_data = payment_gateway.create_order(booking)
            return Response({
                'type': 'order',
                'data': order_data,
                'booking_number': booking.booking_number
            })

    except Booking.DoesNotExist:
        return Response(
            {'error': 'Booking not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def verify_payment(request):
    """
    Verify payment after successful transaction.

    POST /api/payments/verify/
    Body: {
        "razorpay_order_id": "order_xxx",
        "razorpay_payment_id": "pay_xxx",
        "razorpay_signature": "signature_xxx"
    }
    """
    serializer = PaymentVerifySerializer(data=request.data)

    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    try:
        result = payment_gateway.process_payment_success(
            razorpay_payment_id=serializer.validated_data['razorpay_payment_id'],
            razorpay_order_id=serializer.validated_data['razorpay_order_id'],
            razorpay_signature=serializer.validated_data['razorpay_signature']
        )

        payment = result['payment']
        booking = result['booking']

        return Response({
            'status': 'success',
            'message': 'Payment verified successfully',
            'payment': PaymentSerializer(payment).data,
            'booking': {
                'booking_number': booking.booking_number,
                'status': booking.status,
                'total_amount': str(booking.total_amount)
            }
        })

    except ValueError as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        return Response(
            {'error': 'Payment verification failed'},
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['POST'])
@csrf_exempt
@permission_classes([AllowAny])
def payment_webhook(request):
    """
    Razorpay webhook endpoint for payment notifications.
    This receives real-time updates about payment status.

    POST /api/payments/webhook/
    """
    try:
        # Verify webhook signature
        webhook_signature = request.headers.get('X-Razorpay-Signature')
        webhook_secret = settings.RAZORPAY_WEBHOOK_SECRET

        if webhook_secret:
            # Verify signature
            expected_signature = hmac.new(
                webhook_secret.encode('utf-8'),
                request.body,
                hashlib.sha256
            ).hexdigest()

            if not hmac.compare_digest(webhook_signature, expected_signature):
                return Response(
                    {'error': 'Invalid signature'},
                    status=status.HTTP_400_BAD_REQUEST
                )

        # Parse webhook data
        webhook_data = json.loads(request.body)
        event = webhook_data.get('event')
        payload = webhook_data.get('payload', {})

        # Handle different events
        if event == 'payment.captured':
            payment_entity = payload.get('payment', {}).get('entity', {})
            payment_id = payment_entity.get('id')
            order_id = payment_entity.get('order_id')

            # Find payment record
            payment = Payment.objects.filter(order_id=order_id).first()

            if payment:
                payment.gateway_payment_id = payment_id
                payment.status = 'completed'
                payment.paid_at = timezone.now()
                payment.gateway_response = payment_entity
                payment.is_verified = True

                # Extract payment method details
                method = payment_entity.get('method', '')
                payment.payment_method_type = payment_gateway._map_payment_method(method)

                if method == 'upi':
                    payment.upi_id = payment_entity.get('vpa', '')
                elif method == 'card':
                    card = payment_entity.get('card', {})
                    payment.card_last_4 = card.get('last4', '')
                    payment.card_network = card.get('network', '')
                elif method == 'wallet':
                    payment.wallet_name = payment_entity.get('wallet', '')

                payment.save()

                # Update booking
                booking = payment.booking
                booking.status = 'confirmed'
                booking.confirmed_at = timezone.now()
                booking.save()

        elif event == 'payment.failed':
            payment_entity = payload.get('payment', {}).get('entity', {})
            order_id = payment_entity.get('order_id')

            payment = Payment.objects.filter(order_id=order_id).first()
            if payment:
                payment.status = 'failed'
                payment.error_code = payment_entity.get('error_code', '')
                payment.error_description = payment_entity.get('error_description', '')
                payment.gateway_response = payment_entity
                payment.save()

        return Response({'status': 'ok'})

    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_refund(request):
    """
    Create a refund for a payment.
    Only staff can create refunds.

    POST /api/payments/refund/
    Body: {
        "payment_id": "PAY_xxx",
        "amount": 1000.00,  # optional, full refund if not specified
        "reason": "Customer requested"
    }
    """
    if not request.user.is_staff:
        return Response(
            {'error': 'Only staff can create refunds'},
            status=status.HTTP_403_FORBIDDEN
        )

    serializer = RefundCreateSerializer(data=request.data)

    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    try:
        payment = Payment.objects.get(
            payment_id=serializer.validated_data['payment_id']
        )

        amount = serializer.validated_data.get('amount')
        reason = serializer.validated_data.get('reason')

        # Create refund
        refund = payment_gateway.create_refund(
            payment_id=payment.gateway_payment_id,
            amount=int(float(amount) * 100) if amount else None,
            reason=reason
        )

        return Response({
            'status': 'success',
            'message': 'Refund created successfully',
            'refund': {
                'refund_id': refund['id'],
                'amount': refund['amount'] / 100,
                'status': refund['status']
            },
            'payment': PaymentSerializer(payment).data
        })

    except Payment.DoesNotExist:
        return Response(
            {'error': 'Payment not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['GET'])
@permission_classes([AllowAny])
def get_payment_methods(request):
    """
    Get list of available payment methods.

    GET /api/payments/methods/
    """
    payment_methods = [
        {
            'method': 'upi',
            'display_name': 'UPI',
            'icon': 'upi-icon',
            'description': 'Pay using any UPI app (PhonePe, Google Pay, Paytm, etc.)',
            'enabled': True
        },
        {
            'method': 'card',
            'display_name': 'Debit/Credit Card',
            'icon': 'card-icon',
            'description': 'Visa, Mastercard, RuPay, Amex',
            'enabled': True
        },
        {
            'method': 'netbanking',
            'display_name': 'Net Banking',
            'icon': 'bank-icon',
            'description': 'All major banks supported',
            'enabled': True
        },
        {
            'method': 'wallet',
            'display_name': 'Wallets',
            'icon': 'wallet-icon',
            'description': 'Paytm, PhonePe, Amazon Pay, etc.',
            'enabled': True
        },
        {
            'method': 'emi',
            'display_name': 'EMI',
            'icon': 'emi-icon',
            'description': 'No cost EMI available',
            'enabled': True
        }
    ]

    return Response({
        'payment_methods': payment_methods,
        'gateway': 'razorpay',
        'gateway_key': settings.RAZORPAY_KEY_ID
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_payment_status(request, booking_number):
    """
    Get payment status for a booking.

    GET /api/payments/status/{booking_number}/
    """
    try:
        booking = Booking.objects.get(booking_number=booking_number)

        # Check permissions
        if booking.user != request.user and not request.user.is_staff:
            return Response(
                {'error': 'Permission denied'},
                status=status.HTTP_403_FORBIDDEN
            )

        # Get latest payment
        payment = booking.payments.order_by('-created_at').first()

        if not payment:
            return Response({
                'status': 'no_payment',
                'message': 'No payment found for this booking'
            })

        return Response({
            'status': payment.status,
            'payment': PaymentSerializer(payment).data,
            'booking_status': booking.status
        })

    except Booking.DoesNotExist:
        return Response(
            {'error': 'Booking not found'},
            status=status.HTTP_404_NOT_FOUND
        )
