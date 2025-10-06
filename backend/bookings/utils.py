"""
Utility functions for booking system.
Includes payment link generation, availability checking, and refund calculations.
"""
from datetime import datetime, timedelta
from decimal import Decimal
from django.conf import settings
from django.db.models import Q, Count


def generate_payment_link(booking):
    """
    Generate Razorpay payment link for booking.

    Args:
        booking: Booking instance

    Returns:
        str: Payment link URL
    """
    try:
        import razorpay
    except ImportError:
        raise ImportError("Please install razorpay: pip install razorpay")

    client = razorpay.Client(
        auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
    )

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

    payment_link = client.payment_link.create({
        "amount": int(float(booking.total_amount) * 100),  # Amount in paise
        "currency": "INR",
        "description": f"Booking for {service_name}",
        "customer": {
            "name": booking.guest_name,
            "email": booking.guest_email,
            "contact": str(booking.guest_phone)
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
        "callback_url": f"{settings.FRONTEND_URL}/bookings/{booking.booking_number}/payment-callback",
        "callback_method": "get"
    })

    # Create payment record
    from bookings.models import Payment
    Payment.objects.create(
        booking=booking,
        payment_id=payment_link['id'],
        gateway_payment_id=payment_link['id'],
        amount=booking.total_amount,
        currency='INR',
        payment_method='razorpay',
        status='pending',
        gateway_response=payment_link
    )

    return payment_link['short_url']


def check_room_availability(resort_or_homestay, room_type, check_in, check_out):
    """
    Check if a specific room type is available for given dates.

    Args:
        resort_or_homestay: Resort or Homestay instance
        room_type: RoomType instance
        check_in: date object
        check_out: date object

    Returns:
        tuple: (is_available: bool, available_count: int)
    """
    from bookings.models import Booking

    # Determine booking type
    booking_type = 'resort' if hasattr(resort_or_homestay, 'resort_amenities') else 'homestay'

    # Get all bookings that overlap with the requested dates
    overlapping_bookings = Booking.objects.filter(
        booking_type=booking_type,
        object_id=resort_or_homestay.id,
        status__in=['confirmed', 'completed'],  # Only consider confirmed bookings
        check_in_date__lt=check_out,
        check_out_date__gt=check_in
    )

    # Count bookings for this specific room type
    booked_count = 0
    for booking in overlapping_bookings:
        # Check if any booking items match this room type
        for item in booking.items.all():
            if room_type.name in item.item_name:
                booked_count += item.quantity

    # Calculate available rooms
    total_rooms = room_type.quantity if hasattr(room_type, 'quantity') else 1
    available_count = max(0, total_rooms - booked_count)

    return available_count > 0, available_count


def get_available_room_types(resort_or_homestay, check_in, check_out):
    """
    Get all available room types for a resort/homestay on given dates.

    Args:
        resort_or_homestay: Resort or Homestay instance
        check_in: date object
        check_out: date object

    Returns:
        list: List of room types with availability info
    """
    # Get all room types
    if hasattr(resort_or_homestay, 'resort_rooms'):
        room_types = resort_or_homestay.resort_rooms.all()
    elif hasattr(resort_or_homestay, 'homestay_rooms'):
        room_types = resort_or_homestay.homestay_rooms.all()
    else:
        return []

    available_rooms = []

    for room_type in room_types:
        is_available, count = check_room_availability(
            resort_or_homestay, room_type, check_in, check_out
        )

        if is_available:
            available_rooms.append({
                'id': room_type.id,
                'name': room_type.name,
                'price': room_type.price_per_night,
                'max_guests': room_type.max_guests,
                'available_count': count,
                'description': room_type.description if hasattr(room_type, 'description') else ''
            })

    return available_rooms


def calculate_refund(booking):
    """
    Calculate refund amount based on cancellation policy.

    Cancellation Policy:
    - More than 7 days before check-in: 100% refund
    - 3-7 days before check-in: 50% refund
    - Less than 3 days before check-in: No refund

    Args:
        booking: Booking instance

    Returns:
        tuple: (refund_amount: Decimal, refund_percentage: int)
    """
    if booking.status not in ['confirmed', 'completed']:
        return Decimal('0.00'), 0

    today = datetime.now().date()

    # Get check-in date
    check_in = booking.check_in_date if booking.is_accommodation_booking else booking.booking_date

    if not check_in:
        return Decimal('0.00'), 0

    days_until_checkin = (check_in - today).days

    if days_until_checkin > 7:
        # Full refund
        refund_percentage = 100
        refund_amount = booking.total_amount
    elif days_until_checkin >= 3:
        # 50% refund
        refund_percentage = 50
        refund_amount = booking.total_amount * Decimal('0.5')
    else:
        # No refund
        refund_percentage = 0
        refund_amount = Decimal('0.00')

    return refund_amount, refund_percentage


def calculate_booking_price(base_amount, tax_rate=0.12, discount_amount=0):
    """
    Calculate total booking price including taxes.

    Args:
        base_amount: Base price (Decimal or float)
        tax_rate: Tax rate as decimal (default 0.12 for 12% GST)
        discount_amount: Discount amount (Decimal or float)

    Returns:
        dict: Price breakdown
    """
    base_amount = Decimal(str(base_amount))
    discount_amount = Decimal(str(discount_amount))

    # Calculate discounted base
    discounted_base = base_amount - discount_amount

    # Calculate tax
    tax_amount = discounted_base * Decimal(str(tax_rate))

    # Calculate total
    total = discounted_base + tax_amount

    return {
        'base_amount': base_amount,
        'discount_amount': discount_amount,
        'discounted_base': discounted_base,
        'tax_amount': tax_amount,
        'tax_rate': tax_rate,
        'total_amount': total
    }


def calculate_commission(total_amount, commission_rate=0.10):
    """
    Calculate commission amount for partners.

    Args:
        total_amount: Total booking amount
        commission_rate: Commission rate as decimal (default 0.10 for 10%)

    Returns:
        Decimal: Commission amount
    """
    total_amount = Decimal(str(total_amount))
    commission_rate = Decimal(str(commission_rate))

    return total_amount * commission_rate
