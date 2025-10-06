# 🌲 WayanTrails.com

**Hyperlocal Travel Booking Platform for Wayanad**

A comprehensive travel platform exclusively serving the Wayanad region in Kerala, India. Built with Next.js 15 and Django 5.0, featuring a hybrid booking system (online + WhatsApp) for optimal user experience.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-15.5.3-black)](https://nextjs.org/)
[![Django](https://img.shields.io/badge/Django-5.0-green)](https://www.djangoproject.com/)

## 🎯 Project Vision

**Vision**: Become the #1 travel and experience platform for Wayanad by blending local expertise, trust, and digital convenience.

**Mission**: Empower travelers with easy discovery and seamless booking while supporting local hosts and service providers.

---

## ✨ Features Implemented

### Backend (Django 5.0 + DRF)
✅ **Complete Booking System**
- Hybrid booking flow (Online + WhatsApp)
- Generic relations for polymorphic bookings (resorts, homestays, rentals, destinations, services)
- Mock Razorpay payment gateway for development
- Multiple payment methods (UPI, Card, Wallet, Net Banking, EMI)
- Booking status management (pending, confirmed, cancelled, completed, refunded, no_show)
- Email notifications for booking confirmations
- WhatsApp integration with pre-filled messages

✅ **Models & Admin**
- User management with custom user model
- Resort, Homestay, Rental, Destination, and Service models
- Comprehensive amenities system with categorization
- Review and rating system
- Blog/content management
- Payment processing and tracking
- Admin interface with inline editing and filtering

✅ **API Endpoints**
- RESTful API with Django REST Framework
- JWT authentication with SimpleJWT
- CORS configuration for Next.js frontend
- Serializers for all models
- Filter backends for advanced querying
- Pagination support
- Custom actions (confirm booking, cancel booking, generate payment link)

### Frontend (Next.js 15.5.3 + TypeScript)
✅ **Pages Implemented**
- Homepage with hero section and featured listings
- Resort listing page with filters
- Resort detail page with sticky booking card
- Booking confirmation page
- Homestay, Rental, Service, and Destination pages (structure ready)

✅ **Booking System**
- 5-step booking modal (dates, guests, room type, guest info, review)
- Pre-filled booking data from sticky card (no duplicate entry)
- Real-time price calculation with automatic discounts (3+ nights: 5%, 5+ nights: 10%, 7+ nights: 15%)
- Responsive design for mobile and desktop
- Sticky booking cards (desktop) and bottom bars (mobile)

✅ **UI/UX Features**
- Framer Motion animations
- Google Maps integration for locations
- OpenStreetMap integration for nearby attractions
- Amenities display with categorization
- Review and rating displays
- FAQ sections with accordion
- Policy information (check-in, cancellation, children, pets, house rules)
- Mobile-first responsive design
- Tailwind CSS styling

✅ **State Management & Hooks**
- Custom hooks for API calls (useResorts, useHomestays, useDestinations)
- Zustand stores for auth, booking, search, and UI state
- Type-safe API client with Axios interceptors

---

## 🏗️ Tech Stack

### Backend
- **Framework**: Django 5.0
- **API**: Django REST Framework
- **Authentication**: SimpleJWT (JWT tokens)
- **Database**: SQLite (dev) / PostgreSQL (production)
- **Payment**: Razorpay (Mock gateway for development)
- **Email**: Django email backend
- **CORS**: django-cors-headers

### Frontend
- **Framework**: Next.js 15.5.3 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.0
- **Animations**: Framer Motion
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Maps**: Google Maps API, OpenStreetMap (Overpass API)

### DevOps
- **Version Control**: Git & GitHub
- **Containerization**: Docker (ready)
- **CI/CD**: GitHub Actions (workflow configured)

---

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- Git

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/popzon99/wayantrails.git
   cd wayantrails/backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run migrations**
   ```bash
   python manage.py migrate
   ```

5. **Create superuser**
   ```bash
   python manage.py createsuperuser
   ```

6. **Load sample data** (optional)
   ```bash
   python manage.py loaddata fixtures/resorts.json
   python manage.py loaddata fixtures/homestays.json
   ```

7. **Start development server**
   ```bash
   python manage.py runserver
   ```

### Frontend Setup

1. **Navigate to frontend**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000/api
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

### Access Points
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/api/
- **Django Admin**: http://localhost:8000/admin/

---

## 📁 Project Structure

```
wayantrails/
├── backend/                    # Django backend
│   ├── wayantrails_backend/   # Main Django project
│   │   ├── settings.py        # Django settings
│   │   └── urls.py            # Main URL configuration
│   ├── users/                 # User authentication & profiles
│   ├── resorts/              # Resort listings & management
│   ├── homestays/            # Homestay listings & management
│   ├── rentals/              # Vehicle rentals
│   ├── destinations/         # Activities & attractions
│   ├── services/             # Local services (guides, taxis)
│   ├── bookings/             # Unified booking system
│   │   ├── models.py         # Booking & Payment models
│   │   ├── views.py          # Booking API views
│   │   ├── serializers.py    # API serializers
│   │   ├── mock_payment_gateway.py  # Mock Razorpay
│   │   └── emails.py         # Email notifications
│   ├── reviews/              # Review & rating system
│   ├── blog/                 # Content management
│   ├── payments/             # Payment processing
│   └── core/                 # Shared utilities
├── frontend/                  # Next.js frontend
│   ├── src/
│   │   ├── app/              # Next.js 14 app router
│   │   │   ├── page.tsx      # Homepage
│   │   │   ├── resorts/      # Resort pages
│   │   │   ├── homestays/    # Homestay pages
│   │   │   ├── rentals/      # Rental pages
│   │   │   ├── destinations/ # Destination pages
│   │   │   ├── services/     # Service pages
│   │   │   └── bookings/     # Booking confirmation
│   │   ├── components/       # Reusable components
│   │   │   ├── bookings/     # BookingModal
│   │   │   ├── amenities/    # Amenity components
│   │   │   └── ui/           # UI components
│   │   ├── lib/              # Utilities
│   │   │   ├── api/          # API client & endpoints
│   │   │   ├── hooks/        # Custom React hooks
│   │   │   └── store/        # Zustand stores
│   │   └── types/            # TypeScript definitions
│   └── public/               # Static assets
├── docs/                      # Documentation
│   ├── BOOKING_SYSTEM.md     # Booking system guide
│   ├── PAYMENT_INTEGRATION_GUIDE.md
│   └── DEVELOPMENT_PLAN.md   # Development roadmap
├── .github/workflows/         # CI/CD pipelines
└── .env.example              # Environment template
```

---

## 🔄 Booking Flow

### Current Implementation (Hybrid Booking)

1. **Discovery**: User browses resort listings
2. **Selection**: User selects dates, guests, and room type in sticky card
3. **Reserve**: Click "Reserve Now" to open booking modal
4. **5-Step Process**:
   - Step 1: Dates (pre-filled from sticky card)
   - Step 2: Guests (pre-filled from sticky card)
   - Step 3: Room type selection
   - Step 4: Guest information (name, email, phone)
   - Step 5: Review and confirm
5. **Booking Creation**: API creates booking with "pending" status
6. **Confirmation Page**: Shows booking details and WhatsApp link
7. **WhatsApp Contact**: User contacts team via WhatsApp for payment
8. **Manual Confirmation**: Team confirms and processes payment
9. **Email Notification**: Automated confirmation email sent

### Payment Gateway

Currently using **Mock Razorpay Gateway** for development:
- Simulates all payment methods (UPI, Card, Wallet, Net Banking, EMI)
- No real API credentials required
- Switch to real Razorpay by setting `USE_MOCK_PAYMENT = False` in Django settings

---

## 🔐 Security

- JWT-based authentication with refresh tokens
- CORS configured for specific origins
- Environment variable protection (`.env` files excluded from git)
- Input validation and sanitization
- Secure password hashing with Django's built-in system
- CSRF protection enabled

---

## 📚 Documentation

- [Booking System Guide](docs/BOOKING_SYSTEM.md)
- [Payment Integration Guide](docs/PAYMENT_INTEGRATION_GUIDE.md)
- [Development Plan & Roadmap](docs/DEVELOPMENT_PLAN.md)
- [Google Places Setup](docs/GOOGLE_PLACES_SETUP.md)
- [OpenStreetMap Integration](docs/OPENSTREETMAP_SETUP.md)

---

## 🧪 Testing

### Backend Tests
```bash
cd backend
python manage.py test
```

### Frontend Tests
```bash
cd frontend
npm test
```

---

## 🚢 Deployment

### Production Considerations

**Backend**:
- Switch to PostgreSQL database
- Configure production email backend (SMTP)
- Set `DEBUG = False`
- Configure allowed hosts
- Set up static file serving (WhiteNoise or S3)
- Switch to real Razorpay payment gateway

**Frontend**:
- Build production bundle: `npm run build`
- Deploy to Vercel/Netlify/AWS
- Configure production API URL
- Set up CDN for static assets

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

**Developer**: [popzon99](https://github.com/popzon99)

---

## 🙏 Acknowledgments

- Built with assistance from Claude Code (Anthropic)
- Inspired by the beautiful landscapes of Wayanad, Kerala
- Special thanks to the open-source community

---

## 📞 Support

For questions or support, please open an issue on GitHub or contact the development team.

---

**Made with ❤️ for Wayanad travelers**
