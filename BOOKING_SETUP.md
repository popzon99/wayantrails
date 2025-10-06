# Booking System Setup Guide

## 🚀 Quick Setup

Follow these steps to set up the booking system on your local development environment.

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

This will install the new `razorpay` package along with all other dependencies.

### 2. Update Environment Variables

Add the following to your `.env` file (or create one from `.env.example`):

```env
# Payment Gateway
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=rzp_test_your_secret_key

# Email Configuration
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your_email@gmail.com
EMAIL_HOST_PASSWORD=your_app_password
DEFAULT_FROM_EMAIL=noreply@wayantrails.com

# WhatsApp
WHATSAPP_PHONE_NUMBER=919876543210

# Frontend
FRONTEND_URL=http://localhost:3000
```

**Note:** For development, you can use `EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend` to print emails to console instead of sending them.

### 3. Create Database Migrations

```bash
cd backend
python manage.py makemigrations bookings
```

You should see output like:
```
Migrations for 'bookings':
  bookings/migrations/000X_auto_XXXXXXXX_XXXX.py
    - Add field payment_link to payment
    - Add field payment_link_id to payment
    - Add field paid_at to payment
```

### 4. Run Migrations

```bash
python manage.py migrate
```

### 5. Test the Setup

Start the development server:

```bash
python manage.py runserver
```

Visit the Django admin at `http://localhost:8000/admin/` and verify:
- ✅ Booking model is accessible
- ✅ Payment model has new fields
- ✅ You can create test bookings

---

## 🔍 Verify Installation

### Test Razorpay Integration

```python
# In Django shell
python manage.py shell

>>> from bookings.models import Booking
>>> booking = Booking.objects.first()
>>> from bookings.utils import generate_payment_link
>>> try:
...     link = generate_payment_link(booking)
...     print("✅ Razorpay configured correctly")
... except Exception as e:
...     print(f"❌ Error: {e}")
```

### Test Email Configuration

```python
# In Django shell
python manage.py shell

>>> from django.core.mail import send_mail
>>> send_mail(
...     'Test Email',
...     'This is a test email from WayanTrails',
...     'noreply@wayantrails.com',
...     ['your-email@example.com'],
...     fail_silently=False,
... )
```

### Test WhatsApp Link Generation

```python
# In Django shell
python manage.py shell

>>> from bookings.models import Booking
>>> booking = Booking.objects.first()
>>> whatsapp_link = booking.get_whatsapp_link()
>>> print(whatsapp_link)
# Should output a wa.me link with pre-filled message
```

---

## 📝 Create Sample Data (Optional)

Create a test booking to verify the system:

```python
# In Django shell
python manage.py shell

>>> from bookings.models import Booking, BookingItem
>>> from users.models import User
>>> from resorts.models import Resort
>>> from datetime import date, timedelta
>>> from decimal import Decimal

>>> # Get or create user
>>> user = User.objects.first()

>>> # Get a resort
>>> resort = Resort.objects.first()

>>> # Create booking
>>> booking = Booking.objects.create(
...     user=user,
...     guest_name="Test User",
...     guest_email="test@example.com",
...     guest_phone="+919876543210",
...     booking_type='resort',
...     booking_method='hybrid',
...     content_type='resort',
...     object_id=resort.id,
...     check_in_date=date.today() + timedelta(days=7),
...     check_out_date=date.today() + timedelta(days=10),
...     booking_date=date.today() + timedelta(days=7),
...     adults=2,
...     children=0,
...     total_guests=2,
...     base_amount=Decimal('15000.00'),
...     tax_amount=Decimal('1800.00'),
...     total_amount=Decimal('16800.00'),
...     status='pending',
...     special_requests='Early check-in if possible'
... )

>>> print(f"✅ Created booking #{booking.booking_number}")
>>> print(f"WhatsApp Link: {booking.get_whatsapp_link()}")
```

---

## 🧪 Test API Endpoints

### Using curl

**1. Create a booking:**
```bash
curl -X POST http://localhost:8000/api/bookings/ \
  -H "Content-Type: application/json" \
  -d '{
    "booking_type": "resort",
    "booking_method": "hybrid",
    "content_type": "resort",
    "object_id": 1,
    "check_in_date": "2025-10-15",
    "check_out_date": "2025-10-18",
    "booking_date": "2025-10-15",
    "adults": 2,
    "children": 0,
    "total_guests": 2,
    "guest_name": "John Doe",
    "guest_email": "john@example.com",
    "guest_phone": "+919876543210",
    "base_amount": "15000.00",
    "tax_amount": "1800.00",
    "total_amount": "16800.00",
    "special_requests": "Early check-in"
  }'
```

**2. Get WhatsApp link:**
```bash
curl http://localhost:8000/api/bookings/1/whatsapp_link/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**3. Cancel booking:**
```bash
curl -X POST http://localhost:8000/api/bookings/1/cancel/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"reason": "Plans changed"}'
```

---

## 🔐 Getting Razorpay Test Credentials

1. Sign up at [https://razorpay.com/](https://razorpay.com/)
2. Go to Settings → API Keys
3. Generate Test Mode keys
4. Copy the Key ID and Key Secret
5. Add to your `.env` file

**Important:** Never commit real API keys to version control!

---

## 📧 Setting up Gmail for Email Notifications

### Option 1: Gmail App Password (Recommended)

1. Enable 2-Factor Authentication on your Google account
2. Go to Google Account → Security → 2-Step Verification
3. Scroll down to "App passwords"
4. Generate a new app password for "Mail"
5. Use this password in `EMAIL_HOST_PASSWORD`

### Option 2: Console Backend (Development)

For development, just print emails to console:

```env
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
```

---

## 🐛 Troubleshooting

### "No module named 'razorpay'"
```bash
pip install razorpay==1.4.1
```

### "RAZORPAY_KEY_ID not found"
Make sure your `.env` file is in the `backend/` directory and contains the Razorpay keys.

### Migrations not applying
```bash
python manage.py migrate bookings --fake-initial
python manage.py migrate
```

### Email not sending
Check your email configuration in `.env` and test with:
```python
python manage.py shell
>>> from django.core.mail import send_mail
>>> send_mail('Test', 'Message', 'from@example.com', ['to@example.com'])
```

---

## ✅ Setup Complete!

You should now have:
- ✅ Razorpay integration configured
- ✅ Email notifications working
- ✅ WhatsApp link generation functional
- ✅ Database migrations applied
- ✅ API endpoints ready to use

Next step: **Implement the frontend booking flow!**

See `docs/BOOKING_SYSTEM.md` for the complete implementation guide.

---

**Need Help?**
- Check `docs/BOOKING_IMPLEMENTATION_SUMMARY.md` for what was implemented
- Review `docs/BOOKING_SYSTEM.md` for the complete system design
- Test endpoints using Django REST Framework browsable API at `http://localhost:8000/api/`
