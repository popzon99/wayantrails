"# WayanTrails.com - Hyperlocal Travel Platform for Wayanad" 
# 🌲 WayanTrails.com

**Hyperlocal Travel Booking Platform for Wayanad**

A comprehensive travel platform exclusively serving the Wayanad region in Kerala, India. Built with Next.js and Django, featuring dual booking systems for optimal user experience.

[![Build Status](https://github.com/your-username/wayantrails/workflows/WayanTrails%20CI%2FCD%20Pipeline/badge.svg)](https://github.com/your-username/wayantrails/actions)
[![codecov](https://codecov.io/gh/your-username/wayantrails/branch/main/graph/badge.svg)](https://codecov.io/gh/your-username/wayantrails)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🎯 Project Vision

**Vision**: Become the #1 travel and experience platform for Wayanad by blending local expertise, trust, and digital convenience.

**Mission**: Empower travelers with easy discovery and seamless booking while supporting local hosts and service providers.

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 14 with TypeScript, Tailwind CSS
- **Backend**: Django 5.0 with Django REST Framework
- **Database**: PostgreSQL 15
- **Cache**: Redis 7
- **Task Queue**: Celery
- **File Storage**: Cloudinary (dev) / AWS S3 (prod)
- **Infrastructure**: Docker, AWS, GitHub Actions

### Key Features
- 🏠 **Five-Section Homepage**: Resorts, Homestays, Rentals, Destinations, Services
- 🔄 **Dual Booking Systems**: Hybrid (WhatsApp) + Online (Instant)
- 📱 **Mobile-First PWA**: Installable, offline-capable
- 🔍 **SEO Optimized**: Pillar pages for each category
- 💳 **Dual Payment Support**: Razorpay (India) + Stripe (International)
- 🗣️ **Multilingual**: English/Malayalam support
- 🌐 **Browse-First**: No signup required for discovery

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ (for local frontend development)
- Python 3.11+ (for local backend development)

### Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/wayantrails.git
   cd wayantrails
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start Development Environment**
   ```bash
   docker-compose -f docker-compose.dev.yml up --build
   ```

4. **Initialize Database**
   ```bash
   docker-compose -f docker-compose.dev.yml exec backend python manage.py migrate
   docker-compose -f docker-compose.dev.yml exec backend python manage.py createsuperuser
   ```

5. **Load Sample Data** (optional)
   ```bash
   docker-compose -f docker-compose.dev.yml exec backend python manage.py loaddata fixtures/sample_data.json
   ```

### Access Points
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/api/
- **Django Admin**: http://localhost:8000/admin/
- **Nginx**: http://localhost (unified access)

## 📁 Project Structure

```
wayantrails/
├── backend/                    # Django backend
│   ├── wayantrails_backend/   # Main Django project
│   ├── users/                 # User authentication & profiles
│   ├── resorts/              # Resort listings
│   ├── homestays/            # Homestay listings
│   ├── rentals/              # Vehicle rentals
│   ├── destinations/         # Activities & attractions
│   ├── services/             # Local services (guides, taxis)
│   ├── bookings/             # Unified booking system
│   ├── reviews/              # Review & rating system
│   ├── blog/                 # Content management
│   ├── payments/             # Payment processing
│   └── core/                 # Shared utilities & base models
├── frontend/                  # Next.js frontend
│   ├── src/
│   │   ├── app/              # Next.js 14 app router
│   │   ├── components/       # Reusable UI components
│   │   ├── lib/              # Utilities & configurations
│   │   └── types/            # TypeScript type definitions
│   └── public/               # Static assets
├── nginx/                     # Nginx configuration
├── docs/                      # Documentation
├── scripts/                   # Deployment & utility scripts
├── .github/workflows/         # CI/CD pipelines
└── docker-compose.*.yml       # Docker configurations
```

## 🔄 Booking Flow

### Hybrid Booking (Resorts, Homestays, Rentals, Services)
1. **Discovery**: User browses listings
2. **Form Submission**: Structured booking form
3. **WhatsApp Redirect**: Prefilled message to team
4. **Manual Confirmation**: Team verifies and sends payment link
5. **Payment**: Secure gateway processing
6. **Confirmation**: Automated notifications

### Online Booking (Destinations & Activities)
1. **Selection**: User chooses activity and date
2. **Availability Check**: Real-time verification
3. **Payment**: Direct gateway processing
4. **Instant Confirmation**: Automated booking completion

## 🛡️ Security

- JWT-based authentication
- CORS configured for specific origins
- Rate limiting on API endpoints
- Input validation and sanitization
- HTTPS enforcement (production)
- Environment variable protection
- Database connection security

## 📊 Monitoring & Analytics

- **Error Tracking**: Sentry integration
- **Performance**: CloudWatch metrics
- **Analytics**: Google Analytics & Tag Manager
- **Uptime**: Health check