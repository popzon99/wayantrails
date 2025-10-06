"""
Mock Payment Gateway for Testing
Simulates Razorpay without requiring actual credentials.
Use this for development and testing!
"""
import uuid
import hmac
import hashlib
from decimal import Decimal
from django.utils import timezone
from datetime import timedelta


class MockPaymentGateway:
    """
    Mock payment gateway that simulates Razorpay behavior.
    Perfect for testing without real API keys!
    """

    def __init__(self):
        # Mock credentials
        self.key_id = "rzp_test_mock123456789"
        self.key_secret = "mock_secret_key_12345678"

    def create_order(self, booking, notes=None):
        """
        Create a mock Razorpay order.
        Simulates Razorpay order creation without API calls.
        """
        from .models import Payment

        # Generate mock order ID
        order_id = f"order_mock_{uuid.uuid4().hex[:16]}"
        receipt = f"booking_{booking.booking_number}_{uuid.uuid4().hex[:8]}"

        # Mock order response
        mock_order = {
            'id': order_id,
            'entity': 'order',
            'amount': int(float(booking.total_amount) * 100),
            'amount_paid': 0,
            'amount_due': int(float(booking.total_amount) * 100),
            'currency': 'INR',
            'receipt': receipt,
            'status': 'created',
            'attempts': 0,
            'notes': {
                'booking_id': str(booking.booking_id),
                'booking_number': booking.booking_number,
                'guest_name': booking.guest_name,
                **(notes or {})
            },
            'created_at': int(timezone.now().timestamp())
        }

        # Create payment record
        payment = Payment.objects.create(
            booking=booking,
            payment_id=f"PAY_MOCK_{uuid.uuid4().hex[:12].upper()}",
            order_id=order_id,
            amount=booking.total_amount,
            currency='INR',
            payment_gateway='razorpay',
            status='created',
            gateway_response=mock_order,
            expires_at=timezone.now() + timedelta(hours=24)
        )

        return {
            'order_id': order_id,
            'payment_id': payment.payment_id,
            'amount': booking.total_amount,
            'currency': 'INR',
            'key': self.key_id,
            'name': 'WayanTrails',
            'description': f'Booking for {booking.booking_type}',
            'prefill': {
                'name': booking.guest_name,
                'email': booking.guest_email,
                'contact': str(booking.guest_phone)
            },
            'notes': mock_order['notes'],
            'theme': {
                'color': '#059669'
            },
            'mock': True  # Flag to indicate this is mock data
        }

    def create_payment_link(self, booking, expire_by=None):
        """
        Create a mock payment link.
        Returns a fake link that can be used for testing.
        """
        from .models import Payment

        # Generate mock payment link ID
        link_id = f"plink_mock_{uuid.uuid4().hex[:16]}"

        # Set expiry
        if not expire_by:
            expire_by = int((timezone.now() + timedelta(hours=24)).timestamp())

        # Get service name
        service_name = self._get_service_name(booking)

        # Mock payment link response
        mock_link = {
            'id': link_id,
            'entity': 'payment_link',
            'amount': int(float(booking.total_amount) * 100),
            'amount_paid': 0,
            'currency': 'INR',
            'description': f'Payment for {service_name} - Booking #{booking.booking_number}',
            'customer': {
                'name': booking.guest_name,
                'email': booking.guest_email,
                'contact': str(booking.guest_phone).replace('+', '')
            },
            'status': 'created',
            'short_url': f'https://mock.razorpay.com/i/{link_id}',
            'reference_id': f'booking_{booking.booking_number}',
            'notes': {
                'booking_id': str(booking.booking_id),
                'booking_number': booking.booking_number,
                'service_name': service_name
            },
            'expire_by': expire_by,
            'created_at': int(timezone.now().timestamp())
        }

        # Create or update payment record
        payment, created = Payment.objects.get_or_create(
            booking=booking,
            status__in=['created', 'pending'],
            defaults={
                'payment_id': f"PAY_MOCK_{uuid.uuid4().hex[:12].upper()}",
                'amount': booking.total_amount,
                'currency': 'INR',
                'payment_gateway': 'razorpay',
            }
        )

        payment.payment_link = mock_link['short_url']
        payment.payment_link_id = link_id
        payment.order_id = f"order_mock_{uuid.uuid4().hex[:16]}"
        payment.gateway_response = mock_link
        payment.status = 'pending'
        from datetime import datetime, timezone as dt_timezone
        payment.expires_at = datetime.fromtimestamp(expire_by, tz=dt_timezone.utc)
        payment.save()

        return {
            'payment_link': mock_link['short_url'],
            'payment_link_id': link_id,
            'payment_id': payment.payment_id,
            'order_id': payment.order_id,
            'expires_at': payment.expires_at,
            'mock': True
        }

    def verify_payment(self, razorpay_order_id, razorpay_payment_id, razorpay_signature):
        """
        Mock payment verification.
        In mock mode, we accept specific test signatures.
        """
        # Generate mock signature
        mock_signature = hmac.new(
            self.key_secret.encode('utf-8'),
            f"{razorpay_order_id}|{razorpay_payment_id}".encode('utf-8'),
            hashlib.sha256
        ).hexdigest()

        # Accept mock signature or test signature "mock_signature_success"
        return (
            hmac.compare_digest(mock_signature, razorpay_signature) or
            razorpay_signature == "mock_signature_success"
        )

    def fetch_payment(self, payment_id):
        """
        Fetch mock payment details.
        Simulates successful payment.
        """
        # Generate mock payment details based on payment_id
        # Determine payment method from payment_id pattern
        if 'upi' in payment_id.lower():
            method = 'upi'
            method_details = {
                'vpa': 'success@mockupi',
                'provider': 'mock'
            }
        elif 'card' in payment_id.lower():
            method = 'card'
            method_details = {
                'last4': '1111',
                'network': 'Visa',
                'type': 'debit',
                'issuer': 'HDFC'
            }
        elif 'wallet' in payment_id.lower():
            method = 'wallet'
            method_details = {
                'wallet': 'paytm'
            }
        else:
            # Default to UPI
            method = 'upi'
            method_details = {
                'vpa': 'user@paytm',
                'provider': 'paytm'
            }

        mock_payment = {
            'id': payment_id,
            'entity': 'payment',
            'amount': 1000000,  # ₹10,000
            'currency': 'INR',
            'status': 'captured',
            'method': method,
            'description': 'Mock payment for testing',
            'captured': True,
            'email': 'test@wayantrails.com',
            'contact': '+919876543210',
            'created_at': int(timezone.now().timestamp()),
            **method_details
        }

        return mock_payment

    def process_payment_success(self, razorpay_payment_id, razorpay_order_id, razorpay_signature):
        """
        Process mock payment success.
        Simulates complete payment flow.
        """
        from .models import Payment, Booking
        from .emails import send_payment_success_email

        # Verify signature
        if not self.verify_payment(razorpay_order_id, razorpay_payment_id, razorpay_signature):
            raise ValueError("Invalid payment signature")

        # Find payment record
        payment = Payment.objects.filter(order_id=razorpay_order_id).first()

        if not payment:
            raise ValueError("Payment record not found")

        # Fetch mock payment details
        payment_details = self.fetch_payment(razorpay_payment_id)

        # Extract payment method details
        payment_method = payment_details.get('method', 'upi')
        payment.payment_method_type = self._map_payment_method(payment_method)
        payment.gateway_payment_id = razorpay_payment_id
        payment.signature = razorpay_signature
        payment.is_verified = True

        # Extract specific payment details
        if payment_method == 'upi':
            payment.upi_id = payment_details.get('vpa', '')
        elif payment_method == 'card':
            payment.card_last_4 = payment_details.get('last4', '')
            payment.card_network = payment_details.get('network', '')
        elif payment_method == 'wallet':
            payment.wallet_name = payment_details.get('wallet', '')

        # Update payment status
        payment.status = 'completed'
        payment.paid_at = timezone.now()
        payment.gateway_response = payment_details
        payment.save()

        # Update booking status
        booking = payment.booking
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
            'status': 'success',
            'mock': True
        }

    def create_refund(self, payment_id, amount=None, reason=None):
        """
        Create mock refund.
        Simulates refund without API calls.
        """
        from .models import Payment

        payment = Payment.objects.filter(gateway_payment_id=payment_id).first()

        if not payment:
            raise ValueError("Payment not found")

        # Calculate refund amount
        if not amount:
            amount = int(float(payment.amount) * 100)

        # Generate mock refund
        refund_id = f"rfnd_mock_{uuid.uuid4().hex[:16]}"

        mock_refund = {
            'id': refund_id,
            'entity': 'refund',
            'amount': amount,
            'currency': 'INR',
            'payment_id': payment_id,
            'status': 'processed',
            'speed_processed': 'normal',
            'created_at': int(timezone.now().timestamp())
        }

        # Update payment record
        payment.refund_id = refund_id
        payment.refund_amount = Decimal(amount) / 100
        payment.refund_reason = reason or "Customer requested refund"
        payment.status = 'refunded' if amount == int(float(payment.amount) * 100) else 'partially_refunded'
        payment.refunded_at = timezone.now()
        payment.save()

        # Update booking status
        payment.booking.status = 'refunded'
        payment.booking.save()

        return mock_refund

    def _map_payment_method(self, razorpay_method):
        """Map payment method to our types."""
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
        try:
            if booking.booking_type == 'resort':
                from resorts.models import Resort
                service = Resort.objects.filter(id=booking.object_id).first()
                service_name = service.name if service else "Resort"
            elif booking.booking_type == 'homestay':
                from homestays.models import Homestay
                service = Homestay.objects.filter(id=booking.object_id).first()
                service_name = service.name if service else "Homestay"
        except:
            pass

        return service_name


# Singleton instance for mock gateway
mock_payment_gateway = MockPaymentGateway()
