"""
Payment Gateway Integration for WayanTrails
Supports UPI, Debit/Credit Cards, Net Banking, and Digital Wallets
Primary Gateway: Razorpay (supports all major Indian payment methods)
"""
try:
    import razorpay
    RAZORPAY_AVAILABLE = True
except ImportError:
    RAZORPAY_AVAILABLE = False

import hmac
import hashlib
from decimal import Decimal
from django.conf import settings
from django.utils import timezone
from datetime import timedelta
import uuid


class RazorpayGateway:
    """
    Razorpay Payment Gateway Integration
    Supports: UPI, Cards, Net Banking, Wallets (PhonePe, Paytm, Google Pay)
    """

    def __init__(self):
        if not RAZORPAY_AVAILABLE:
            raise ImportError("razorpay module is not installed. Install it with: pip install razorpay")

        self.client = razorpay.Client(
            auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
        )
        self.client.set_app_details({
            "title": "WayanTrails",
            "version": "1.0.0"
        })

    def create_order(self, booking, notes=None):
        """
        Create a Razorpay order for a booking.
        This enables UPI, Cards, Net Banking, and all Wallets.

        Args:
            booking: Booking instance
            notes: Optional dict of additional notes

        Returns:
            dict: Order details including order_id
        """
        from .models import Payment

        # Calculate amount in paise (Razorpay requires smallest currency unit)
        amount_paise = int(float(booking.total_amount) * 100)

        # Prepare order data
        order_data = {
            "amount": amount_paise,
            "currency": "INR",
            "receipt": f"booking_{booking.booking_number}_{uuid.uuid4().hex[:8]}",
            "notes": {
                "booking_id": str(booking.booking_id),
                "booking_number": booking.booking_number,
                "guest_name": booking.guest_name,
                "guest_email": booking.guest_email,
                "guest_phone": str(booking.guest_phone),
                **(notes or {})
            }
        }

        # Create order on Razorpay
        razorpay_order = self.client.order.create(data=order_data)

        # Create payment record
        payment = Payment.objects.create(
            booking=booking,
            payment_id=f"PAY_{uuid.uuid4().hex[:12].upper()}",
            order_id=razorpay_order['id'],
            amount=booking.total_amount,
            currency='INR',
            payment_gateway='razorpay',
            status='created',
            gateway_response=razorpay_order,
            expires_at=timezone.now() + timedelta(hours=24)
        )

        return {
            'order_id': razorpay_order['id'],
            'payment_id': payment.payment_id,
            'amount': booking.total_amount,
            'currency': 'INR',
            'key': settings.RAZORPAY_KEY_ID,
            'name': 'WayanTrails',
            'description': f'Booking for {booking.booking_type}',
            'prefill': {
                'name': booking.guest_name,
                'email': booking.guest_email,
                'contact': str(booking.guest_phone)
            },
            'notes': order_data['notes'],
            'theme': {
                'color': '#059669'  # WayanTrails green
            }
        }

    def create_payment_link(self, booking, expire_by=None):
        """
        Create a payment link for booking.
        Automatically supports all payment methods including UPI, Cards, Wallets.

        Args:
            booking: Booking instance
            expire_by: Unix timestamp for expiry (optional)

        Returns:
            dict: Payment link details
        """
        from .models import Payment

        # Calculate amount in paise
        amount_paise = int(float(booking.total_amount) * 100)

        # Get service name
        service_name = self._get_service_name(booking)

        # Set expiry (24 hours from now if not specified)
        if not expire_by:
            expire_by = int((timezone.now() + timedelta(hours=24)).timestamp())

        # Create payment link data
        payment_link_data = {
            "amount": amount_paise,
            "currency": "INR",
            "accept_partial": False,
            "expire_by": expire_by,
            "reference_id": f"booking_{booking.booking_number}",
            "description": f"Payment for {service_name} - Booking #{booking.booking_number}",
            "customer": {
                "name": booking.guest_name,
                "email": booking.guest_email,
                "contact": str(booking.guest_phone).replace('+', '')
            },
            "notify": {
                "sms": True,
                "email": True
            },
            "reminder_enable": True,
            "notes": {
                "booking_id": str(booking.booking_id),
                "booking_number": booking.booking_number,
                "service_name": service_name
            },
            "callback_url": f"{settings.FRONTEND_URL}/bookings/{booking.booking_number}/payment-success",
            "callback_method": "get"
        }

        # Create payment link
        payment_link = self.client.payment_link.create(payment_link_data)

        # Create or update payment record
        payment, created = Payment.objects.get_or_create(
            booking=booking,
            status__in=['created', 'pending'],
            defaults={
                'payment_id': f"PAY_{uuid.uuid4().hex[:12].upper()}",
                'amount': booking.total_amount,
                'currency': 'INR',
                'payment_gateway': 'razorpay',
            }
        )

        payment.payment_link = payment_link['short_url']
        payment.payment_link_id = payment_link['id']
        payment.order_id = payment_link.get('order_id', '')
        payment.gateway_response = payment_link
        payment.status = 'pending'
        payment.expires_at = timezone.datetime.fromtimestamp(expire_by, tz=timezone.utc)
        payment.save()

        return {
            'payment_link': payment_link['short_url'],
            'payment_link_id': payment_link['id'],
            'payment_id': payment.payment_id,
            'expires_at': payment.expires_at
        }

    def verify_payment(self, razorpay_order_id, razorpay_payment_id, razorpay_signature):
        """
        Verify payment signature for security.

        Args:
            razorpay_order_id: Razorpay order ID
            razorpay_payment_id: Razorpay payment ID
            razorpay_signature: Signature from Razorpay

        Returns:
            bool: True if signature is valid
        """
        try:
            # Generate signature
            generated_signature = hmac.new(
                settings.RAZORPAY_KEY_SECRET.encode('utf-8'),
                f"{razorpay_order_id}|{razorpay_payment_id}".encode('utf-8'),
                hashlib.sha256
            ).hexdigest()

            return hmac.compare_digest(generated_signature, razorpay_signature)

        except Exception as e:
            print(f"Signature verification error: {e}")
            return False

    def capture_payment(self, payment_id, amount=None):
        """
        Capture an authorized payment.

        Args:
            payment_id: Razorpay payment ID
            amount: Amount to capture in paise (optional, captures full amount if not specified)

        Returns:
            dict: Captured payment details
        """
        from .models import Payment

        try:
            # Fetch payment from Razorpay
            razorpay_payment = self.client.payment.fetch(payment_id)

            # If amount not specified, capture full amount
            if not amount:
                amount = razorpay_payment['amount']

            # Capture payment
            captured_payment = self.client.payment.capture(payment_id, amount)

            # Update our payment record
            payment = Payment.objects.filter(
                gateway_payment_id=payment_id
            ).first()

            if payment:
                payment.status = 'captured'
                payment.paid_at = timezone.now()
                payment.gateway_response = captured_payment
                payment.is_verified = True
                payment.save()

            return captured_payment

        except Exception as e:
            print(f"Payment capture error: {e}")
            raise

    def fetch_payment(self, payment_id):
        """
        Fetch payment details from Razorpay.

        Args:
            payment_id: Razorpay payment ID

        Returns:
            dict: Payment details
        """
        try:
            payment_details = self.client.payment.fetch(payment_id)
            return payment_details
        except Exception as e:
            print(f"Fetch payment error: {e}")
            return None

    def process_payment_success(self, razorpay_payment_id, razorpay_order_id, razorpay_signature):
        """
        Process successful payment and update booking.

        Args:
            razorpay_payment_id: Payment ID from Razorpay
            razorpay_order_id: Order ID from Razorpay
            razorpay_signature: Signature for verification

        Returns:
            dict: Updated payment and booking details
        """
        from .models import Payment, Booking
        from .emails import send_payment_success_email

        # Verify signature
        if not self.verify_payment(razorpay_order_id, razorpay_payment_id, razorpay_signature):
            raise ValueError("Invalid payment signature")

        # Fetch payment details from Razorpay
        payment_details = self.fetch_payment(razorpay_payment_id)

        if not payment_details:
            raise ValueError("Payment not found")

        # Find payment record
        payment = Payment.objects.filter(order_id=razorpay_order_id).first()

        if not payment:
            raise ValueError("Payment record not found")

        # Extract payment method details
        payment_method = payment_details.get('method', '')
        payment.payment_method_type = self._map_payment_method(payment_method)
        payment.gateway_payment_id = razorpay_payment_id
        payment.signature = razorpay_signature
        payment.is_verified = True

        # Extract specific payment details
        if payment_method == 'upi':
            payment.upi_id = payment_details.get('vpa', '')
        elif payment_method == 'card':
            card_details = payment_details.get('card', {})
            payment.card_last_4 = card_details.get('last4', '')
            payment.card_network = card_details.get('network', '')
        elif payment_method == 'wallet':
            payment.wallet_name = payment_details.get('wallet', '')

        # Update payment status
        if payment_details['status'] == 'captured':
            payment.status = 'completed'
            payment.paid_at = timezone.now()
        elif payment_details['status'] == 'authorized':
            payment.status = 'authorized'
            payment.authorized_at = timezone.now()

        payment.gateway_response = payment_details
        payment.save()

        # Update booking status
        booking = payment.booking
        if payment.status == 'completed':
            booking.status = 'confirmed'
            booking.confirmed_at = timezone.now()
            booking.save()

            # Send success email
            try:
                send_payment_success_email(booking)
            except Exception as e:
                print(f"Error sending payment success email: {e}")

        return {
            'payment': payment,
            'booking': booking,
            'status': 'success'
        }

    def create_refund(self, payment_id, amount=None, reason=None):
        """
        Create a refund for a payment.

        Args:
            payment_id: Razorpay payment ID
            amount: Amount to refund in paise (optional, full refund if not specified)
            reason: Reason for refund

        Returns:
            dict: Refund details
        """
        from .models import Payment

        try:
            # Get payment record
            payment = Payment.objects.filter(gateway_payment_id=payment_id).first()

            if not payment:
                raise ValueError("Payment not found")

            # Calculate refund amount
            if not amount:
                amount = int(float(payment.amount) * 100)

            # Create refund
            refund_data = {
                "amount": amount,
                "speed": "normal",
                "notes": {
                    "reason": reason or "Customer requested refund",
                    "booking_number": payment.booking.booking_number
                }
            }

            refund = self.client.payment.refund(payment_id, refund_data)

            # Update payment record
            payment.refund_id = refund['id']
            payment.refund_amount = Decimal(amount) / 100
            payment.refund_reason = reason or "Customer requested refund"
            payment.status = 'refunded' if amount == int(float(payment.amount) * 100) else 'partially_refunded'
            payment.refunded_at = timezone.now()
            payment.save()

            # Update booking status
            payment.booking.status = 'refunded'
            payment.booking.save()

            return refund

        except Exception as e:
            print(f"Refund creation error: {e}")
            raise

    def _map_payment_method(self, razorpay_method):
        """Map Razorpay payment method to our payment method types."""
        mapping = {
            'upi': 'upi',
            'card': 'card',
            'netbanking': 'netbanking',
            'wallet': 'wallet',
            'emi': 'emi'
        }
        return mapping.get(razorpay_method, 'card')

    def _get_service_name(self, booking):
        """Get service name from booking."""
        service_name = "Service"
        if booking.booking_type == 'resort':
            from resorts.models import Resort
            service = Resort.objects.filter(id=booking.object_id).first()
            service_name = service.name if service else "Resort"
        elif booking.booking_type == 'homestay':
            from homestays.models import Homestay
            service = Homestay.objects.filter(id=booking.object_id).first()
            service_name = service.name if service else "Homestay"

        return service_name


# Singleton instance - only create if razorpay is available
razorpay_gateway = RazorpayGateway() if RAZORPAY_AVAILABLE else None
