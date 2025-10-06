# WayanTrails Development Tasks & Instructions

## Project Overview
WayanTrails is a hyperlocal travel booking platform for Wayanad, Kerala. It features dual booking systems (Hybrid WhatsApp + Online instant) and serves 5 main categories: Resorts, Homestays, Rentals, Destinations, and Services.

## Current Status ✅ PHASE 1 COMPLETE
- ✅ Django project structure created
- ✅ User authentication with phone-based OTP
- ✅ Core models base classes (TimeStampedModel, AddressModel, etc.)
- ✅ Complete business models for all 5 categories
- ✅ Database migrations created and applied
- ✅ Environment configuration setup
- ✅ URL routing structure
- ✅ Backend server running successfully

## Current Phase: API Development ✅ PHASE 2 COMPLETE

### ✅ Completed API Components
1. **API Serializers** - Complete serializers for resorts and homestays
2. **ViewSets & CRUD Operations** - Full REST API with filtering, search, ordering
3. **Admin Interface** - Comprehensive Django admin for all models
4. **URL Routing** - RESTful API endpoints configured
5. **Search & Filtering** - Price range, amenities, location filtering

### 🚀 Current Status
- **Resort API**: `/api/resorts/resorts/` - Full CRUD with availability check
- **Homestay API**: `/api/homestays/homestays/` - Complete with experiences & meal plans
- **Room Management**: Room types, amenities, seasonal pricing
- **Admin Panel**: Rich admin interface with inlines and search
- **Authentication**: Phone-based OTP system ready

## Next Priority: Booking System (Phase 3)

### 1. Booking Workflow Implementation
**Required Models**:
- `resorts/models.py` - Resort listings with rooms, amenities
- `homestays/models.py` - Homestay properties
- `rentals/models.py` - Vehicle rentals (bikes, cars, buses)
- `destinations/models.py` - Activities and attractions
- `services/models.py` - Local services (guides, taxis)
- `reviews/models.py` - Review and rating system
- `blog/models.py` - Content management
- `payments/models.py` - Payment processing

### 3. Business Logic Requirements

#### Booking System
- **Hybrid Booking Flow**: Form submission → WhatsApp message → Manual confirmation → Payment
- **Online Booking Flow**: Direct payment → Instant confirmation
- **Availability Management**: Date-based slots for all bookable items
- **Pricing**: Base + tax + commission calculations

#### User Experience
- **Browse-First**: No signup required for discovery
- **Phone Authentication**: OTP-based verification
- **Multilingual**: English/Malayalam support
- **Mobile-First**: PWA with offline capability

#### Payment Integration
- **Dual Gateways**: Razorpay (India) + Stripe (International)
- **Booking Flow**: Manual payment links for hybrid, instant for online

## Development Priority

### Phase 1: Core Infrastructure (Current)
1. ✅ Fix core models import
2. ✅ Create all business entity models
3. ✅ Set up URL routing
4. ✅ Run database migrations
5. ✅ Environment configuration

### Phase 2: API Development
1. Create serializers for all models
2. Implement CRUD views with proper permissions
3. Add search and filtering
4. Implement booking workflows
5. Add payment gateway integration

### Phase 3: Frontend Integration
1. API client setup
2. Browse and search functionality
3. Booking forms and flows
4. User dashboard
5. Admin panel enhancements

## Business Categories Detail

### Resorts
- **Features**: Luxury accommodations, multiple room types
- **Booking**: Hybrid (WhatsApp confirmation required)
- **Pricing**: Per night, seasonal rates
- **Amenities**: Pool, restaurant, activities

### Homestays
- **Features**: Authentic local experience
- **Booking**: Hybrid (host approval needed)
- **Pricing**: Per night, family-friendly
- **Highlights**: Home-cooked meals, local guides

### Rentals
- **Types**: Bikes, cars, buses for groups
- **Booking**: Hybrid (availability confirmation)
- **Pricing**: Per day/hour
- **Requirements**: License verification

### Destinations
- **Types**: Trekking, waterfalls, wildlife, adventure
- **Booking**: Online instant booking
- **Pricing**: Per person, time-slot based
- **Features**: Real-time availability

### Services
- **Types**: Tour guides, taxi services, photographers
- **Booking**: Hybrid (service provider confirmation)
- **Pricing**: Hourly/package rates
- **Verification**: Licensed service providers

## Technical Standards

### Code Quality
- Follow Django best practices
- Use type hints where applicable
- Implement proper error handling
- Add comprehensive logging

### Database Design
- Use appropriate indexes for performance
- Implement soft deletes where needed
- Optimize for read-heavy workloads
- Plan for data archival

### API Design
- RESTful endpoints with proper HTTP methods
- Consistent response formats
- Proper pagination and filtering
- Rate limiting implementation

### Security
- JWT token authentication
- Input validation and sanitization
- CORS configuration
- Environment variable protection

## Environment Setup

### Required Environment Variables
```env
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/wayantrails
REDIS_URL=redis://localhost:6379/0

# Security
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# JWT
JWT_ACCESS_TOKEN_LIFETIME_MINUTES=60
JWT_REFRESH_TOKEN_LIFETIME_DAYS=7

# Payment Gateways
RAZORPAY_KEY_ID=rzp_test_key
RAZORPAY_KEY_SECRET=rzp_test_secret
STRIPE_PUBLISHABLE_KEY=pk_test_key
STRIPE_SECRET_KEY=sk_test_key

# External Services
GOOGLE_MAPS_API_KEY=your-google-maps-key
WHATSAPP_PHONE_NUMBER=+91XXXXXXXXXX

# File Storage
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## Next Actions
1. Create core app with TimeStampedModel
2. Implement all business models
3. Set up proper URL routing
4. Create and run migrations
5. Set up environment configuration
6. Test the complete backend setup

## Notes
- Focus on Wayanad-specific features
- Optimize for mobile-first experience
- Ensure WhatsApp integration works smoothly
- Plan for seasonal demand variations
- Consider local language (Malayalam) support early