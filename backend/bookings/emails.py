"""
Email utilities for booking notifications.
"""
from django.core.mail import send_mail, EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings
from django.utils.html import strip_tags


def send_booking_pending_email(booking):
    """
    Send email when booking is created (pending status).

    Args:
        booking: Booking instance
    """
    subject = f"Booking Request Received - WayanTrails #{booking.booking_number}"

    # Get service name
    service_name = "Service"
    if booking.booking_type == 'resort':
        from resorts.models import Resort
        service = Resort.objects.filter(id=booking.object_id).first()
        service_name = service.name if service else "Resort"
    elif booking.booking_type == 'homestay':
        from homestays.models import Homestay
        service = Homestay.objects.filter(id=booking.object_id).first()
        service_name = service.name if service else "Homestay"

    context = {
        'booking': booking,
        'user_name': booking.guest_name,
        'service_name': service_name,
        'reference': booking.booking_number,
        'whatsapp_link': booking.get_whatsapp_link(),
    }

    # Try to render HTML template, fallback to plain text
    try:
        html_message = render_to_string('emails/booking_pending.html', context)
    except Exception:
        html_message = None

    # Plain text message
    plain_message = f"""
Dear {booking.guest_name},

Thank you for your booking request!

Booking Reference: #{booking.booking_number}
Service: {service_name}

We have received your booking request and will confirm availability within 2 hours.

Next Steps:
1. Our team will check availability
2. You'll receive a WhatsApp message with payment link
3. Complete payment to confirm your booking
4. Receive booking confirmation & e-voucher

You can also contact us directly on WhatsApp:
{booking.get_whatsapp_link()}

Best regards,
WayanTrails Team

---
Need help? Contact us at support@wayantrails.com
    """.strip()

    # Send email
    send_mail(
        subject=subject,
        message=plain_message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[booking.guest_email],
        html_message=html_message,
        fail_silently=True,
    )


def send_booking_confirmation_email(booking):
    """
    Send booking confirmation email to user.

    Args:
        booking: Booking instance
    """
    # Get service name
    service_name = "Service"
    if booking.booking_type == 'resort':
        from resorts.models import Resort
        service = Resort.objects.filter(id=booking.object_id).first()
        service_name = service.name if service else "Resort"
    elif booking.booking_type == 'homestay':
        from homestays.models import Homestay
        service = Homestay.objects.filter(id=booking.object_id).first()
        service_name = service.name if service else "Homestay"

    subject = f"Booking Confirmed - {service_name}"

    # Format dates
    check_in_str = booking.check_in_date.strftime('%d %B %Y') if booking.check_in_date else 'N/A'
    check_out_str = booking.check_out_date.strftime('%d %B %Y') if booking.check_out_date else 'N/A'
    booking_date_str = booking.booking_date.strftime('%d %B %Y') if booking.booking_date else 'N/A'

    # Guest info
    guests = f"{booking.adults} Adults"
    if booking.children > 0:
        guests += f", {booking.children} Children"

    context = {
        'booking': booking,
        'user_name': booking.guest_name,
        'service_name': service_name,
        'check_in': check_in_str,
        'check_out': check_out_str,
        'booking_date': booking_date_str,
        'nights': booking.duration_nights,
        'guests': guests,
        'total_amount': booking.total_amount,
        'reference': booking.booking_number,
    }

    # Try to render HTML template, fallback to plain text
    try:
        html_message = render_to_string('emails/booking_confirmation.html', context)
    except Exception:
        html_message = None

    # Plain text message
    message_parts = [
        f"Dear {booking.guest_name},",
        "",
        "Your booking has been confirmed! We're excited to host you.",
        "",
        "Booking Details:",
        f"Reference: #{booking.booking_number}",
        f"Service: {service_name}",
    ]

    if booking.is_accommodation_booking:
        message_parts.extend([
            f"Check-in: {check_in_str} (After 2:00 PM)",
            f"Check-out: {check_out_str} (Before 11:00 AM)",
            f"Duration: {booking.duration_nights} nights",
        ])
    elif booking.booking_date:
        message_parts.append(f"Date: {booking_date_str}")
        if booking.booking_time:
            message_parts.append(f"Time: {booking.booking_time.strftime('%I:%M %p')}")

    message_parts.extend([
        f"Guests: {guests}",
        f"Total Amount: ₹{booking.total_amount}",
        "",
        "Next Steps:",
        "- Complete payment to finalize your booking",
        "- You'll receive an e-voucher once payment is confirmed",
        "- Bring a valid ID proof at check-in",
        "",
        "Best regards,",
        "WayanTrails Team",
        "",
        "---",
        "Need help? Contact us at support@wayantrails.com",
    ])

    plain_message = "\n".join(message_parts)

    # Send email
    send_mail(
        subject=subject,
        message=plain_message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[booking.guest_email],
        html_message=html_message,
        fail_silently=True,
    )


def send_payment_link_email(booking, payment_link):
    """
    Send payment link to user.

    Args:
        booking: Booking instance
        payment_link: Payment link URL
    """
    # Get service name
    service_name = "Service"
    if booking.booking_type == 'resort':
        from resorts.models import Resort
        service = Resort.objects.filter(id=booking.object_id).first()
        service_name = service.name if service else "Resort"
    elif booking.booking_type == 'homestay':
        from homestays.models import Homestay
        service = Homestay.objects.filter(id=booking.object_id).first()
        service_name = service.name if service else "Homestay"

    subject = f"Payment Link - {service_name} Booking"

    context = {
        'booking': booking,
        'payment_link': payment_link,
        'user_name': booking.guest_name,
        'service_name': service_name,
    }

    # Try to render HTML template, fallback to plain text
    try:
        html_message = render_to_string('emails/payment_link.html', context)
    except Exception:
        html_message = None

    # Plain text message
    plain_message = f"""
Dear {booking.guest_name},

Your booking has been confirmed! Please complete the payment to finalize your reservation.

Booking Reference: #{booking.booking_number}
Service: {service_name}
Amount: ₹{booking.total_amount}

Payment Link:
{payment_link}

The payment link is valid for 24 hours. Please complete the payment at your earliest convenience.

Important:
- Use the secure payment link above
- You'll receive a booking confirmation once payment is successful
- Contact us if you face any issues

Best regards,
WayanTrails Team

---
Need help? Contact us at support@wayantrails.com
    """.strip()

    # Send email
    send_mail(
        subject=subject,
        message=plain_message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[booking.guest_email],
        html_message=html_message,
        fail_silently=True,
    )


def send_cancellation_email(booking, refund_amount, refund_percentage):
    """
    Send cancellation confirmation email.

    Args:
        booking: Booking instance
        refund_amount: Refund amount (Decimal)
        refund_percentage: Refund percentage (int)
    """
    # Get service name
    service_name = "Service"
    if booking.booking_type == 'resort':
        from resorts.models import Resort
        service = Resort.objects.filter(id=booking.object_id).first()
        service_name = service.name if service else "Resort"
    elif booking.booking_type == 'homestay':
        from homestays.models import Homestay
        service = Homestay.objects.filter(id=booking.object_id).first()
        service_name = service.name if service else "Homestay"

    subject = f"Booking Cancelled - {service_name}"

    context = {
        'booking': booking,
        'user_name': booking.guest_name,
        'service_name': service_name,
        'refund_amount': refund_amount,
        'refund_percentage': refund_percentage,
    }

    # Try to render HTML template, fallback to plain text
    try:
        html_message = render_to_string('emails/booking_cancellation.html', context)
    except Exception:
        html_message = None

    # Plain text message
    message_parts = [
        f"Dear {booking.guest_name},",
        "",
        "Your booking has been cancelled as requested.",
        "",
        f"Booking Reference: #{booking.booking_number}",
        f"Service: {service_name}",
        f"Total Amount: ₹{booking.total_amount}",
    ]

    if refund_percentage > 0:
        message_parts.extend([
            "",
            "Refund Details:",
            f"Refund Amount: ₹{refund_amount} ({refund_percentage}% of total)",
            "The refund will be processed within 5-7 business days.",
        ])
    else:
        message_parts.extend([
            "",
            "Unfortunately, no refund is applicable as per our cancellation policy.",
        ])

    message_parts.extend([
        "",
        "We're sorry to see you cancel. We hope to serve you in the future!",
        "",
        "Best regards,",
        "WayanTrails Team",
        "",
        "---",
        "Need help? Contact us at support@wayantrails.com",
    ])

    plain_message = "\n".join(message_parts)

    # Send email
    send_mail(
        subject=subject,
        message=plain_message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[booking.guest_email],
        html_message=html_message,
        fail_silently=True,
    )


def send_payment_success_email(booking):
    """
    Send payment success confirmation email.

    Args:
        booking: Booking instance
    """
    # Get service name
    service_name = "Service"
    if booking.booking_type == 'resort':
        from resorts.models import Resort
        service = Resort.objects.filter(id=booking.object_id).first()
        service_name = service.name if service else "Resort"
    elif booking.booking_type == 'homestay':
        from homestays.models import Homestay
        service = Homestay.objects.filter(id=booking.object_id).first()
        service_name = service.name if service else "Homestay"

    subject = f"Payment Successful - {service_name} Booking"

    # Format dates
    check_in_str = booking.check_in_date.strftime('%d %B %Y') if booking.check_in_date else 'N/A'
    check_out_str = booking.check_out_date.strftime('%d %B %Y') if booking.check_out_date else 'N/A'

    context = {
        'booking': booking,
        'user_name': booking.guest_name,
        'service_name': service_name,
        'check_in': check_in_str,
        'check_out': check_out_str,
    }

    # Try to render HTML template, fallback to plain text
    try:
        html_message = render_to_string('emails/payment_success.html', context)
    except Exception:
        html_message = None

    # Plain text message
    plain_message = f"""
Dear {booking.guest_name},

Your payment has been successfully received!

Booking Reference: #{booking.booking_number}
Service: {service_name}
Amount Paid: ₹{booking.total_amount}

Your booking is now confirmed. You can view your booking details in your dashboard.

What's Next:
- You'll receive your e-voucher shortly
- Bring a valid ID proof at check-in
- Check-in: {check_in_str} (After 2:00 PM)
- Check-out: {check_out_str} (Before 11:00 AM)

We look forward to hosting you!

Best regards,
WayanTrails Team

---
Need help? Contact us at support@wayantrails.com
    """.strip()

    # Send email
    send_mail(
        subject=subject,
        message=plain_message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[booking.guest_email],
        html_message=html_message,
        fail_silently=True,
    )
