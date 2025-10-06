"""
Booking API views for WayanTrails platform.
"""
from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q, Count, Sum
from django.utils import timezone
from datetime import datetime, timedelta
import uuid

from .models import (
    Booking, BookingItem, Payment, BookingAvailability,
    WhatsAppMessage
)
from .serializers import (
    BookingListSerializer, BookingDetailSerializer, BookingCreateSerializer,
    BookingUpdateSerializer, AvailabilityCheckSerializer,
    BookingAvailabilitySerializer, WhatsAppMessageSerializer,
    BookingReportSerializer
)


class BookingViewSet(viewsets.ModelViewSet):
    """ViewSet for booking operations."""

    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['booking_type', 'status', 'booking_method']
    search_fields = ['booking_number', 'guest_name', 'guest_email', 'guest_phone']
    ordering_fields = ['created_at', 'booking_date', 'total_amount']
    ordering = ['-created_at']

    def get_queryset(self):
        """Filter bookings based on user permissions."""
        if self.request.user.is_staff:
            return Booking.objects.all().prefetch_related('items', 'payments')
        elif self.request.user.is_authenticated:
            return Booking.objects.filter(
                Q(user=self.request.user) | Q(guest_email=self.request.user.email)
            ).prefetch_related('items', 'payments')
        return Booking.objects.none()

    def get_serializer_class(self):
        """Return appropriate serializer based on action."""
        if self.action == 'list':
            return BookingListSerializer
        elif self.action == 'create':
            return BookingCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return BookingUpdateSerializer
        return BookingDetailSerializer

    def create(self, request, *args, **kwargs):
        """Create a new booking with hybrid/online flow."""
        from .emails import send_booking_pending_email

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        booking = serializer.save()

        # Send WhatsApp message for hybrid bookings
        if booking.booking_method == 'hybrid':
            self._send_whatsapp_inquiry(booking)

            # Send pending confirmation email
            try:
                send_booking_pending_email(booking)
            except Exception as e:
                print(f"Error sending pending email: {e}")

        # For online bookings, mark as confirmed (in real implementation, after payment)
        elif booking.booking_method == 'online':
            booking.status = 'confirmed'
            booking.confirmed_at = timezone.now()
            booking.save()

        response_serializer = BookingDetailSerializer(booking, context={'request': request})

        # Include WhatsApp link in response for hybrid bookings
        response_data = response_serializer.data
        if booking.booking_method == 'hybrid':
            response_data['whatsapp_link'] = booking.get_whatsapp_link()

        return Response(response_data, status=status.HTTP_201_CREATED)

    def _send_whatsapp_inquiry(self, booking):
        """Send WhatsApp inquiry message."""
        message_text = self._generate_whatsapp_message(booking)

        WhatsAppMessage.objects.create(
            booking=booking,
            message_type='booking_inquiry',
            phone_number=booking.guest_phone,
            message_text=message_text
        )

        booking.whatsapp_message_sent = True
        booking.whatsapp_message_text = message_text
        booking.save()

        # TODO: Integrate with actual WhatsApp API
        # For now, just mark as sent

    def _generate_whatsapp_message(self, booking):
        """Generate WhatsApp message text for booking inquiry."""
        message = f"""
🌴 *WayanTrails Booking Inquiry*

📋 *Booking Details:*
• Booking ID: {booking.booking_number}
• Guest: {booking.guest_name}
• Type: {booking.get_booking_type_display()}
• Guests: {booking.total_guests} ({booking.adults} adults, {booking.children} children)

📅 *Dates:*
"""
        if booking.is_accommodation_booking:
            message += f"• Check-in: {booking.check_in_date.strftime('%d %b %Y')}\n"
            message += f"• Check-out: {booking.check_out_date.strftime('%d %b %Y')}\n"
            message += f"• Nights: {booking.duration_nights}\n"
        else:
            message += f"• Date: {booking.booking_date.strftime('%d %b %Y')}\n"
            if booking.booking_time:
                message += f"• Time: {booking.booking_time.strftime('%I:%M %p')}\n"

        message += f"""
💰 *Amount: ₹{booking.total_amount:,.0f}*

📱 *Contact:*
• Phone: {booking.guest_phone}
• Email: {booking.guest_email}

📝 *Special Requests:*
{booking.special_requests or 'None'}

Please confirm availability and send payment details.
"""
        return message.strip()

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def confirm(self, request, pk=None):
        """Confirm a booking (staff only)."""
        if not request.user.is_staff:
            return Response(
                {'detail': 'Only staff can confirm bookings'},
                status=status.HTTP_403_FORBIDDEN
            )

        booking = self.get_object()
        if booking.status != 'pending':
            return Response(
                {'detail': 'Only pending bookings can be confirmed'},
                status=status.HTTP_400_BAD_REQUEST
            )

        booking.status = 'confirmed'
        booking.confirmed_by = request.user
        booking.confirmed_at = timezone.now()
        booking.save()

        serializer = BookingDetailSerializer(booking, context={'request': request})
        return Response(serializer.data)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def cancel(self, request, pk=None):
        """Cancel a booking with refund calculation."""
        from .utils import calculate_refund
        from .emails import send_cancellation_email

        booking = self.get_object()

        # Check permissions
        if not (request.user.is_staff or booking.user == request.user):
            return Response(
                {'detail': 'You can only cancel your own bookings'},
                status=status.HTTP_403_FORBIDDEN
            )

        if booking.status not in ['pending', 'confirmed']:
            return Response(
                {'detail': 'Only pending or confirmed bookings can be cancelled'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check if booking is in the past
        check_date = booking.check_in_date if booking.is_accommodation_booking else booking.booking_date
        if check_date and check_date < timezone.now().date():
            return Response(
                {'detail': 'Cannot cancel past bookings'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Calculate refund
        refund_amount, refund_percentage = calculate_refund(booking)

        # Update booking
        reason = request.data.get('reason', '')
        booking.status = 'cancelled'
        booking.cancelled_by = request.user
        booking.cancelled_at = timezone.now()
        booking.cancellation_reason = reason
        booking.save()

        # Send cancellation email
        try:
            send_cancellation_email(booking, refund_amount, refund_percentage)
        except Exception as e:
            # Log error but don't fail the cancellation
            print(f"Error sending cancellation email: {e}")

        serializer = BookingDetailSerializer(booking, context={'request': request})
        return Response({
            'booking': serializer.data,
            'refund_amount': str(refund_amount),
            'refund_percentage': refund_percentage,
            'message': 'Booking cancelled successfully'
        })

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def generate_payment_link(self, request, pk=None):
        """Generate payment link for a confirmed booking (staff only)."""
        from .utils import generate_payment_link
        from .emails import send_payment_link_email

        booking = self.get_object()

        if booking.status not in ['pending', 'confirmed']:
            return Response(
                {'detail': 'Only pending or confirmed bookings can get payment links'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            payment_link = generate_payment_link(booking)

            # Update booking status to confirmed
            if booking.status == 'pending':
                booking.status = 'confirmed'
                booking.confirmed_by = request.user
                booking.confirmed_at = timezone.now()
                booking.save()

            # Send payment link email
            try:
                send_payment_link_email(booking, payment_link)
            except Exception as e:
                print(f"Error sending payment link email: {e}")

            return Response({
                'payment_link': payment_link,
                'message': 'Payment link generated successfully'
            })

        except Exception as e:
            return Response(
                {'detail': f'Error generating payment link: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=True, methods=['get'])
    def whatsapp_link(self, request, pk=None):
        """Get WhatsApp link for booking inquiry."""
        booking = self.get_object()

        # Check permissions
        if not (request.user.is_staff or booking.user == request.user):
            return Response(
                {'detail': 'You can only view your own booking links'},
                status=status.HTTP_403_FORBIDDEN
            )

        whatsapp_link = booking.get_whatsapp_link()

        return Response({
            'whatsapp_link': whatsapp_link,
            'booking_number': booking.booking_number
        })

    @action(detail=False, methods=['post'])
    def check_availability(self, request):
        """Check availability for a specific item and date."""
        serializer = AvailabilityCheckSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        data = serializer.validated_data
        content_type = data['content_type']
        object_id = data['object_id']
        date = data['date']
        guests = data['guests']

        # Get or create availability record
        availability, created = BookingAvailability.objects.get_or_create(
            content_type=content_type,
            object_id=object_id,
            date=date,
            defaults={
                'available_slots': self._get_default_slots(content_type, object_id),
                'booked_slots': 0
            }
        )

        is_available = (
            not availability.is_blocked and
            availability.remaining_slots >= guests
        )

        return Response({
            'available': is_available,
            'remaining_slots': availability.remaining_slots,
            'is_blocked': availability.is_blocked,
            'block_reason': availability.block_reason,
            'price_override': availability.price_override,
        })

    def _get_default_slots(self, content_type, object_id):
        """Get default available slots for an item."""
        # TODO: Get actual capacity from the related model
        if content_type in ['resort', 'homestay']:
            return 10  # Default room capacity
        elif content_type == 'destination':
            return 20  # Default activity capacity
        return 5  # Default for services/rentals
