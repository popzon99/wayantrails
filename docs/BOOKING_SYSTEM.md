# Booking System - Complete Implementation Guide

## 🎯 Overview
Complete booking system implementation from resort detail page to confirmation, including WhatsApp integration for booking requests and user dashboard for managing bookings.

---

## 📊 BOOKING FLOW DIAGRAM

```
Resort Detail Page
       ↓
   [Check Dates] Button
       ↓
   Booking Modal/Page Opens
       ↓
   User Fills Details:
   - Check-in/out dates
   - Number of guests
   - Room type
   - Contact info
   - Special requests
       ↓
   Review Booking Summary
   - Price breakdown
   - Cancellation policy
   - Terms & conditions
       ↓
   [Confirm Booking] Button
       ↓
   Authentication Check
   (If not logged in → Login/Signup)
       ↓
   Create Booking (Pending status)
       ↓
   WhatsApp Message Pre-filled
   "Hi, I want to book [Resort Name]
   Check-in: [Date]
   Check-out: [Date]
   Guests: [Number]
   Room: [Type]
   Booking ID: #[REF]"
       ↓
   User Sends to WayanTrails
       ↓
   Team Confirms & Sends Payment Link
       ↓
   User Pays → Booking Confirmed
       ↓
   Confirmation Email + Dashboard Update
```

---

## 🎨 UI COMPONENTS

### 1. Sticky Booking Card (Already in Detail Page)

**Desktop - Right Sidebar:**
```jsx
<div className="sticky top-24 w-[380px]">
  <div className="border rounded-xl shadow-lg p-6">
    {/* Price */}
    <div className="mb-4">
      <span className="text-3xl font-bold">₹{selectedRoom.price}</span>
      <span className="text-gray-600">/night</span>
    </div>

    {/* Date Pickers */}
    <DateRangePicker
      checkIn={checkIn}
      checkOut={checkOut}
      onChange={handleDateChange}
      minDate={new Date()}
    />

    {/* Guest Selector */}
    <GuestSelector
      adults={adults}
      children={children}
      onChange={handleGuestChange}
    />

    {/* Room Type Radio Buttons */}
    <RoomTypeSelector
      rooms={roomTypes}
      selected={selectedRoom}
      onChange={setSelectedRoom}
    />

    {/* Price Breakdown */}
    <PriceBreakdown
      basePrice={basePrice}
      nights={nights}
      taxes={taxes}
      total={total}
    />

    {/* CTA Button */}
    <button
      onClick={handleBookNow}
      className="w-full bg-emerald-600 text-white py-3 rounded-lg"
    >
      Reserve Now
    </button>

    <p className="text-xs text-center text-gray-500 mt-2">
      ✓ Free cancellation until 3 days before
    </p>
  </div>
</div>
```

**Mobile - Bottom Sticky Bar:**
```jsx
<div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
  <div className="flex items-center justify-between px-4 py-3">
    <div>
      <div className="text-sm text-gray-600">From</div>
      <div className="text-xl font-bold">₹{minPrice}/night</div>
    </div>
    <button
      onClick={openBookingModal}
      className="bg-emerald-600 text-white px-6 py-3 rounded-lg"
    >
      Check Dates
    </button>
  </div>
</div>
```

---

### 2. Booking Modal (Mobile & Small Screens)

```jsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Users, Home } from 'lucide-react';

export default function BookingModal({
  isOpen,
  onClose,
  resort,
  roomTypes
}) {
  const [step, setStep] = useState(1); // 1: Dates, 2: Guests, 3: Room, 4: Details, 5: Summary
  const [bookingData, setBookingData] = useState({
    checkIn: '',
    checkOut: '',
    adults: 2,
    children: 0,
    roomType: null,
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    specialRequests: ''
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b px-4 py-4 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-lg">Book {resort.name}</h2>
                <p className="text-sm text-gray-600">Step {step} of 5</p>
              </div>
              <button onClick={onClose} className="p-2">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="h-1 bg-gray-100">
              <div
                className="h-full bg-emerald-600 transition-all duration-300"
                style={{ width: `${(step / 5) * 100}%` }}
              />
            </div>

            {/* Content */}
            <div className="p-6">
              {step === 1 && <DateSelectionStep />}
              {step === 2 && <GuestSelectionStep />}
              {step === 3 && <RoomSelectionStep />}
              {step === 4 && <GuestDetailsStep />}
              {step === 5 && <BookingSummaryStep />}
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-white border-t px-4 py-4">
              <div className="flex gap-3">
                {step > 1 && (
                  <button
                    onClick={() => setStep(step - 1)}
                    className="flex-1 border py-3 rounded-lg font-medium"
                  >
                    Back
                  </button>
                )}
                <button
                  onClick={() => step < 5 ? setStep(step + 1) : handleConfirmBooking()}
                  className="flex-1 bg-emerald-600 text-white py-3 rounded-lg font-medium"
                >
                  {step < 5 ? 'Continue' : 'Confirm Booking'}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
```

---

### 3. Booking Page (Desktop - Full Page)

```
URL: /bookings/new?resort=[slug]&checkIn=[date]&checkOut=[date]

┌─────────────────────────────────────────────────────────────────┐
│ WayanTrails  [Progress: 1/4 Complete]                           │
└─────────────────────────────────────────────────────────────────┘

┌───────────────────────────────────┬─────────────────────────────┐
│                                   │                             │
│ 1. Booking Details ✓              │  BOOKING SUMMARY            │
│                                   │  ─────────────────────────  │
│ Check-in: [Date Picker]          │  Vythiri Village Resort     │
│ Check-out: [Date Picker]         │  [Resort Image]             │
│                                   │                             │
│ Duration: 3 nights                │  Check-in:  Jan 15, 2025    │
│                                   │  Check-out: Jan 18, 2025    │
│ Adults: [2 ▼]                    │  Duration:  3 nights        │
│ Children: [0 ▼]                  │                             │
│                                   │  Room Type:                 │
│ ───────────────────────────────   │  Treehouse Villa            │
│                                   │                             │
│ 2. Select Room Type ○             │  Guests:                    │
│                                   │  2 Adults, 0 Children       │
│ ○ Treehouse Villa     ₹15,000/nt │                             │
│   Up to 2 guests                  │  ─────────────────────────  │
│   • Valley View                   │  PRICE BREAKDOWN            │
│   • Private Balcony               │  ─────────────────────────  │
│   ⚠️ Only 1 left!                │  ₹15,000 × 3 nights         │
│                                   │  = ₹45,000                  │
│ ○ Forest Cottage      ₹12,000/nt │                             │
│   Up to 3 guests                  │  Taxes & Service            │
│   • Garden View                   │  (12%) = ₹5,400             │
│   ✓ Available                     │                             │
│                                   │  ─────────────────────────  │
│ ○ Luxury Suite        ₹18,000/nt │  TOTAL: ₹50,400             │
│   Up to 4 guests                  │  ─────────────────────────  │
│   • 2 Bedrooms                    │                             │
│   ✓ Available                     │  ✓ Free cancellation        │
│                                   │  ✓ Pay at property          │
│ ───────────────────────────────   │                             │
│                                   │  [Confirm Booking →]        │
│ 3. Guest Details ○                │                             │
│                                   │                             │
│ 4. Review & Confirm ○             │                             │
│                                   │                             │
└───────────────────────────────────┴─────────────────────────────┘
```

---

### 4. Booking Confirmation Page

```jsx
export default function BookingConfirmation({ bookingId }) {
  const booking = await getBooking(bookingId);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Success Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-center mb-8"
        >
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-5xl">✓</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Booking Request Sent!</h1>
          <p className="text-gray-600">
            We've received your booking request and will confirm within 2 hours
          </p>
        </motion.div>

        {/* Booking Details Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm text-gray-600">Booking Reference</p>
              <p className="text-2xl font-bold">#{booking.reference}</p>
            </div>
            <span className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
              Pending Confirmation
            </span>
          </div>

          {/* Resort Info */}
          <div className="border-t pt-4 mb-4">
            <h2 className="font-bold text-xl mb-2">{booking.resort.name}</h2>
            <p className="text-gray-600">{booking.resort.city}, {booking.resort.state}</p>
          </div>

          {/* Booking Details */}
          <div className="grid grid-cols-2 gap-4 border-t pt-4">
            <div>
              <p className="text-sm text-gray-600">Check-in</p>
              <p className="font-medium">{formatDate(booking.checkIn)}</p>
              <p className="text-xs text-gray-500">After 2:00 PM</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Check-out</p>
              <p className="font-medium">{formatDate(booking.checkOut)}</p>
              <p className="text-xs text-gray-500">Before 11:00 AM</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Guests</p>
              <p className="font-medium">{booking.adults} Adults{booking.children > 0 && `, ${booking.children} Children`}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Duration</p>
              <p className="font-medium">{booking.nights} nights</p>
            </div>
          </div>

          {/* Room Type */}
          <div className="border-t pt-4 mt-4">
            <p className="text-sm text-gray-600 mb-1">Room Type</p>
            <p className="font-medium">{booking.roomType.name}</p>
          </div>

          {/* Price */}
          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">₹{booking.roomType.price} × {booking.nights} nights</span>
              <span>₹{booking.baseAmount}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Taxes & Service</span>
              <span>₹{booking.taxAmount}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>Total</span>
              <span>₹{booking.totalAmount}</span>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
          <h3 className="font-bold mb-3">📱 Next Steps</h3>
          <ol className="space-y-2 text-sm">
            <li className="flex gap-2">
              <span className="font-bold">1.</span>
              <span>Our team will confirm availability within 2 hours</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold">2.</span>
              <span>You'll receive a WhatsApp message with payment link</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold">3.</span>
              <span>Complete payment to confirm your booking</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold">4.</span>
              <span>Receive booking confirmation & e-voucher</span>
            </li>
          </ol>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <a
            href={booking.whatsappLink}
            target="_blank"
            className="bg-green-500 text-white text-center py-3 rounded-lg font-medium flex items-center justify-center gap-2"
          >
            <span>💬</span>
            Chat with Us on WhatsApp
          </a>
          <Link
            href="/dashboard/bookings"
            className="border text-center py-3 rounded-lg font-medium"
          >
            View in My Bookings
          </Link>
          <Link
            href="/"
            className="text-center text-gray-600 py-3"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
```

---

## 🔧 BACKEND API STRUCTURE

### Models (Already exists in `backend/bookings/models.py`)

```python
from django.db import models
from django.contrib.auth import get_user_model
from resorts.models import Resort, RoomType

User = get_user_model()

class Booking(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending Confirmation'),
        ('confirmed', 'Confirmed'),
        ('paid', 'Paid'),
        ('cancelled', 'Cancelled'),
        ('completed', 'Completed'),
    ]

    # Booking Reference
    reference = models.CharField(max_length=20, unique=True)

    # User & Resort
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookings')
    resort = models.ForeignKey(Resort, on_delete=models.CASCADE)
    room_type = models.ForeignKey(RoomType, on_delete=models.SET_NULL, null=True)

    # Dates
    check_in = models.DateField()
    check_out = models.DateField()
    nights = models.IntegerField()

    # Guests
    adults = models.IntegerField(default=2)
    children = models.IntegerField(default=0)

    # Guest Details
    guest_name = models.CharField(max_length=255)
    guest_email = models.EmailField()
    guest_phone = models.CharField(max_length=20)

    # Pricing
    base_amount = models.DecimalField(max_digits=10, decimal_places=2)
    tax_amount = models.DecimalField(max_digits=10, decimal_places=2)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)

    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')

    # Additional
    special_requests = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.reference:
            self.reference = self.generate_reference()
        super().save(*args, **kwargs)

    def generate_reference(self):
        import random
        import string
        return 'WT' + ''.join(random.choices(string.digits, k=8))
```

### API Endpoints

**1. Create Booking**
```python
# POST /api/bookings/
{
  "resort_id": 1,
  "room_type_id": 3,
  "check_in": "2025-01-15",
  "check_out": "2025-01-18",
  "adults": 2,
  "children": 0,
  "guest_name": "John Doe",
  "guest_email": "john@example.com",
  "guest_phone": "+919876543210",
  "special_requests": "Early check-in if possible"
}

Response:
{
  "id": 123,
  "reference": "WT12345678",
  "status": "pending",
  "whatsapp_link": "https://wa.me/919876543210?text=...",
  "total_amount": "50400.00",
  ...
}
```

**2. Get User Bookings**
```python
# GET /api/bookings/user/
# Requires authentication

Response:
{
  "count": 5,
  "results": [
    {
      "id": 123,
      "reference": "WT12345678",
      "resort": {
        "name": "Vythiri Village Resort",
        "city": "Vythiri",
        "image": "..."
      },
      "check_in": "2025-01-15",
      "check_out": "2025-01-18",
      "status": "confirmed",
      "total_amount": "50400.00"
    },
    ...
  ]
}
```

**3. Get Booking Details**
```python
# GET /api/bookings/{id}/
# Requires authentication (owner or admin)

Response: Full booking object
```

**4. Cancel Booking**
```python
# PUT /api/bookings/{id}/cancel/
# Requires authentication (owner)

Response:
{
  "success": true,
  "message": "Booking cancelled successfully",
  "refund_amount": "25200.00" // 50% if within policy
}
```

**5. Check Availability**
```python
# GET /api/resorts/{id}/availability/?check_in=2025-01-15&check_out=2025-01-18

Response:
{
  "available": true,
  "room_types": [
    {
      "id": 1,
      "name": "Treehouse Villa",
      "price": "15000.00",
      "available_count": 1
    },
    {
      "id": 2,
      "name": "Forest Cottage",
      "price": "12000.00",
      "available_count": 5
    }
  ]
}
```

---

## 📱 USER DASHBOARD

### My Bookings Page

```
/dashboard/bookings

┌─────────────────────────────────────────────────────────────┐
│ My Bookings                                    [+ New Booking]│
├─────────────────────────────────────────────────────────────┤
│                                                               │
│ 🔍 Filter: [All ▼] [Upcoming] [Past] [Cancelled]           │
│                                                               │
│ ┌───────────────────────────────────────────────────────────┐│
│ │ [Resort Image]  Vythiri Village Resort                    ││
│ │                                                            ││
│ │ Booking #WT12345678              🟢 Confirmed             ││
│ │                                                            ││
│ │ 📅 Jan 15 - 18, 2025 (3 nights)                          ││
│ │ 👥 2 Adults • 🏠 Treehouse Villa                         ││
│ │ 💰 ₹50,400                                                ││
│ │                                                            ││
│ │ [View Details] [Cancel Booking] [Download Voucher]        ││
│ └───────────────────────────────────────────────────────────┘│
│                                                               │
│ ┌───────────────────────────────────────────────────────────┐│
│ │ [Resort Image]  Sterling Wayanad                          ││
│ │                                                            ││
│ │ Booking #WT87654321              🟡 Pending               ││
│ │                                                            ││
│ │ 📅 Feb 10 - 12, 2025 (2 nights)                          ││
│ │ 👥 3 Adults, 1 Child • 🏠 Deluxe Room                    ││
│ │ 💰 ₹28,000                                                ││
│ │                                                            ││
│ │ [View Details] [Cancel Request] [Contact Support]         ││
│ └───────────────────────────────────────────────────────────┘│
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎨 IMPLEMENTATION PHASES

### **Phase 1: Core Booking Flow (Week 1)**
- [ ] Booking modal/page UI
- [ ] Date picker integration
- [ ] Guest selector
- [ ] Room type selection
- [ ] Price calculation logic
- [ ] Form validation

### **Phase 2: Backend Integration (Week 2)**
- [ ] API endpoints (create, read)
- [ ] Booking model integration
- [ ] Availability checking
- [ ] WhatsApp link generation
- [ ] Email notifications

### **Phase 3: User Dashboard (Week 3)**
- [ ] My Bookings page
- [ ] Booking details view
- [ ] Cancel booking flow
- [ ] Booking filters & search

### **Phase 4: Enhancements (Week 4)**
- [ ] Payment gateway integration (Razorpay)
- [ ] Booking modification
- [ ] Refund handling
- [ ] Admin booking management

---

## 📋 KEY FEATURES CHECKLIST

### Must-Have (MVP)
- [x] Booking form with date/guest selection
- [x] Room type selection
- [x] Price calculation
- [x] WhatsApp booking request
- [x] Booking confirmation page
- [x] User dashboard (my bookings)
- [x] Cancel booking
- [x] Email notifications

### Nice-to-Have (V2)
- [ ] Payment gateway integration
- [ ] Instant booking confirmation
- [ ] Booking modification
- [ ] Calendar view of bookings
- [ ] Booking reminders
- [ ] Guest reviews after stay

---

## 🚀 QUICK START GUIDE FOR CLAUDE CODE

1. **Start with the Booking Modal** - Add to resort detail page
2. **Create API endpoints** - Use existing booking models
3. **Build confirmation page** - Show booking success
4. **Add user dashboard** - List user's bookings
5. **Test complete flow** - From browse to booking

**Priority Order:**
1. Booking Modal/Form ⭐⭐⭐
2. API Integration ⭐⭐⭐
3. Confirmation Page ⭐⭐
4. User Dashboard ⭐⭐
5. Payment Integration ⭐

---

## 📝 TECHNICAL NOTES

### Form Validation
```typescript
const validateBooking = (data) => {
  const errors = {};

  // Date validation
  if (new Date(data.checkIn) < new Date()) {
    errors.checkIn = 'Check-in date cannot be in the past';
  }

  if (new Date(data.checkOut) <= new Date(data.checkIn)) {
    errors.checkOut = 'Check-out must be after check-in';
  }

  // Guest validation
  if (data.adults < 1) {
    errors.adults = 'At least 1 adult required';
  }

  // Room capacity check
  const totalGuests = data.adults + data.children;
  if (totalGuests > data.roomType.maxGuests) {
    errors.guests = `This room supports max ${data.roomType.maxGuests} guests`;
  }

  return errors;
};
```

### Price Calculation
```typescript
const calculateBookingPrice = (roomPrice, nights, extras = {}) => {
  const baseAmount = roomPrice * nights;
  const taxRate = 0.12; // 12% GST
  const taxAmount = baseAmount * taxRate;
  const total = baseAmount + taxAmount;

  return {
    baseAmount,
    taxAmount,
    total,
    perNight: roomPrice,
    nights
  };
};
```

---

---

## 🔧 CRITICAL IMPLEMENTATION DETAILS

### WhatsApp Integration Flow
1. User submits booking form
2. Create booking with status='pending'
3. Generate WhatsApp link with booking details
4. Redirect user to confirmation page with WhatsApp button
5. User contacts team via WhatsApp (optional - we already have details)
6. Team checks availability in Django Admin
7. If available: Team updates status to 'confirmed' and generates payment link
8. If not available: Team updates status to 'cancelled' and notifies user

**Implementation:**
```python
# In backend/bookings/models.py
from urllib.parse import quote

class Booking(models.Model):
    # ... existing fields ...

    def get_whatsapp_link(self):
        """Generate WhatsApp link with pre-filled booking details"""
        phone = "919876543210"  # WayanTrails support number
        message = f"""Hi WayanTrails Team!

I would like to book:
🏨 *{self.resort.name}*

📅 Check-in: {self.check_in.strftime('%d %b %Y')}
📅 Check-out: {self.check_out.strftime('%d %b %Y')}
🌙 Duration: {self.nights} nights

👥 Guests: {self.adults} Adults{f', {self.children} Children' if self.children else ''}
🏠 Room: {self.room_type.name}

💰 Total Amount: ₹{self.total_amount}

📝 Booking Reference: #{self.reference}

{f'Special Requests: {self.special_requests}' if self.special_requests else ''}

Please confirm availability and send payment link.
Thank you!"""

        encoded_message = quote(message)
        return f"https://wa.me/{phone}?text={encoded_message}"
```

### Payment Link Generation (Razorpay)
```python
# In backend/bookings/utils.py
import razorpay
from django.conf import settings

def generate_payment_link(booking):
    """Generate Razorpay payment link for booking"""
    client = razorpay.Client(
        auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
    )

    payment_link = client.payment_link.create({
        "amount": int(float(booking.total_amount) * 100),  # Amount in paise
        "currency": "INR",
        "description": f"Booking for {booking.resort.name}",
        "customer": {
            "name": booking.guest_name,
            "email": booking.guest_email,
            "contact": booking.guest_phone
        },
        "notify": {
            "sms": True,
            "email": True
        },
        "reminder_enable": True,
        "notes": {
            "booking_id": booking.id,
            "booking_reference": booking.reference,
            "resort_name": booking.resort.name
        },
        "callback_url": f"{settings.FRONTEND_URL}/bookings/{booking.reference}/payment-callback",
        "callback_method": "get"
    })

    # Save payment link to booking
    booking.payment_link = payment_link['short_url']
    booking.payment_link_id = payment_link['id']
    booking.save()

    return payment_link['short_url']
```

### Email Notifications
```python
# backend/bookings/emails.py
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.conf import settings

def send_booking_confirmation_email(booking):
    """Send booking confirmation email to user"""
    subject = f"Booking Confirmed - {booking.resort.name}"

    context = {
        'booking': booking,
        'user_name': booking.guest_name,
        'resort_name': booking.resort.name,
        'check_in': booking.check_in.strftime('%d %B %Y'),
        'check_out': booking.check_out.strftime('%d %B %Y'),
        'nights': booking.nights,
        'guests': f"{booking.adults} Adults{f', {booking.children} Children' if booking.children else ''}",
        'room_type': booking.room_type.name,
        'total_amount': booking.total_amount,
        'reference': booking.reference,
    }

    html_message = render_to_string('emails/booking_confirmation.html', context)
    plain_message = render_to_string('emails/booking_confirmation.txt', context)

    send_mail(
        subject=subject,
        message=plain_message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[booking.guest_email],
        html_message=html_message,
        fail_silently=False,
    )
```

### Availability Checking
```python
# backend/bookings/utils.py
from django.db.models import Q, Count
from datetime import datetime

def check_room_availability(resort, room_type, check_in, check_out):
    """
    Check if a specific room type is available for given dates
    Returns: (is_available: bool, available_count: int)
    """
    # Get all bookings that overlap with the requested dates
    overlapping_bookings = Booking.objects.filter(
        resort=resort,
        room_type=room_type,
        status__in=['confirmed', 'paid'],
        check_in__lt=check_out,
        check_out__gt=check_in
    ).count()

    # Calculate available rooms
    total_rooms = room_type.quantity
    available_count = total_rooms - overlapping_bookings

    return available_count > 0, available_count

def get_available_room_types(resort, check_in, check_out):
    """Get all available room types for a resort on given dates"""
    room_types = resort.room_types.all()
    available_rooms = []

    for room_type in room_types:
        is_available, count = check_room_availability(
            resort, room_type, check_in, check_out
        )

        if is_available:
            available_rooms.append({
                'id': room_type.id,
                'name': room_type.name,
                'price': room_type.price_per_night,
                'max_guests': room_type.max_guests,
                'available_count': count,
                'amenities': list(room_type.amenities.values_list('name', flat=True))
            })

    return available_rooms
```

### Refund Calculation
```python
# backend/bookings/utils.py
from datetime import datetime, timedelta
from decimal import Decimal

def calculate_refund(booking):
    """
    Calculate refund amount based on cancellation policy

    Cancellation Policy:
    - More than 7 days before check-in: 100% refund
    - 3-7 days before check-in: 50% refund
    - Less than 3 days before check-in: No refund

    Returns: (refund_amount, refund_percentage)
    """
    if booking.status not in ['confirmed', 'paid']:
        return Decimal('0.00'), 0

    today = datetime.now().date()
    days_until_checkin = (booking.check_in - today).days

    if days_until_checkin > 7:
        refund_percentage = 100
        refund_amount = booking.total_amount
    elif days_until_checkin >= 3:
        refund_percentage = 50
        refund_amount = booking.total_amount * Decimal('0.5')
    else:
        refund_percentage = 0
        refund_amount = Decimal('0.00')

    return refund_amount, refund_percentage
```

---

This document provides everything needed to implement the complete booking system! 🎉
