# WayanTrails.com - Frontend Development Task Document

## 🎨 Project Overview
Build a premium, mobile-first Progressive Web Application (PWA) for WayanTrails - a hyperlocal travel platform for Wayanad, Kerala. The frontend must deliver a luxury experience while maintaining fast performance and intuitive navigation.

---

## 🎯 Technology Stack

### Core Framework
- **Next.js 14+** (App Router)
- **React 18+**
- **TypeScript** (strict mode enabled)
- **Tailwind CSS 3+**

### Essential Libraries
```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "tailwindcss": "^3.4.0",
    "framer-motion": "^10.0.0",
    "react-hook-form": "^7.48.0",
    "zustand": "^4.4.0",
    "axios": "^1.6.0",
    "date-fns": "^2.30.0",
    "react-day-picker": "^8.9.0",
    "swiper": "^11.0.0",
    "lucide-react": "^0.292.0",
    "next-pwa": "^5.6.0",
    "sharp": "^0.33.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0"
  }
}
```

---

## 🎨 Premium Design System

### Color Palette
```css
:root {
  /* Primary Colors */
  --sand-tan: #e1b382;
  --sand-tan-shadow: #c89666;
  --sand-tan-light: #f0d4b3;
  --sand-tan-dark: #d4a571;
  
  /* Secondary Colors */
  --night-blue: #2d545e;
  --night-blue-shadow: #12343b;
  --night-blue-light: #3d6470;
  --night-blue-dark: #1d444d;
  
  /* Accent Colors */
  --forest-green: #4a7c59;
  --sunset-orange: #d97642;
  --mist-gray: #f5f5f5;
  --cloud-white: #ffffff;
  
  /* Semantic Colors */
  --success: #4a7c59;
  --error: #dc2626;
  --warning: #f59e0b;
  --info: #3b82f6;
  
  /* Text Colors */
  --text-primary: #1a1a1a;
  --text-secondary: #4a5568;
  --text-muted: #718096;
  --text-inverse: #ffffff;
}
```

### Tailwind Configuration
```javascript
// tailwind.config.js
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        sand: {
          tan: '#e1b382',
          'tan-shadow': '#c89666',
          'tan-light': '#f0d4b3',
          'tan-dark': '#d4a571',
        },
        night: {
          blue: '#2d545e',
          'blue-shadow': '#12343b',
          'blue-light': '#3d6470',
          'blue-dark': '#1d444d',
        },
        forest: '#4a7c59',
        sunset: '#d97642',
        mist: '#f5f5f5',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        'premium': '0 10px 40px rgba(45, 84, 94, 0.1)',
        'premium-lg': '0 20px 60px rgba(45, 84, 94, 0.15)',
        'glow-sand': '0 0 20px rgba(225, 179, 130, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}
```

### Typography System
```css
/* Global Typography */
.heading-hero {
  @apply font-display text-5xl md:text-6xl lg:text-7xl font-bold text-night-blue leading-tight;
}

.heading-1 {
  @apply font-display text-4xl md:text-5xl font-bold text-night-blue leading-tight;
}

.heading-2 {
  @apply font-display text-3xl md:text-4xl font-bold text-night-blue leading-snug;
}

.heading-3 {
  @apply font-sans text-2xl md:text-3xl font-semibold text-night-blue leading-snug;
}

.heading-4 {
  @apply font-sans text-xl md:text-2xl font-semibold text-night-blue;
}

.body-large {
  @apply text-lg text-text-secondary leading-relaxed;
}

.body-normal {
  @apply text-base text-text-secondary leading-relaxed;
}

.body-small {
  @apply text-sm text-text-muted leading-relaxed;
}
```

---

## 📁 Project Structure

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── (main)/
│   │   ├── page.tsx                    # Homepage
│   │   ├── resorts/
│   │   │   ├── page.tsx                # Resorts listing
│   │   │   └── [slug]/
│   │   │       └── page.tsx            # Individual resort
│   │   ├── homestays/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── rentals/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── destinations/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── services/
│   │   │   ├── page.tsx
│   │   │   ├── guides/[id]/page.tsx
│   │   │   ├── taxis/[id]/page.tsx
│   │   │   └── photographers/[id]/page.tsx
│   │   ├── blog/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   └── layout.tsx
│   ├── api/                            # API route handlers
│   ├── layout.tsx                      # Root layout
│   ├── globals.css
│   └── not-found.tsx
├── components/
│   ├── ui/                             # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   ├── Badge.tsx
│   │   ├── Skeleton.tsx
│   │   ├── Toast.tsx
│   │   └── Dropdown.tsx
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── MobileNav.tsx
│   │   └── Breadcrumb.tsx
│   ├── home/
│   │   ├── HeroSection.tsx
│   │   ├── CategoryCards.tsx
│   │   ├── FeaturedListings.tsx
│   │   ├── TestimonialSlider.tsx
│   │   └── WhyChooseUs.tsx
│   ├── listings/
│   │   ├── ListingCard.tsx
│   │   ├── ListingGrid.tsx
│   │   ├── FilterSidebar.tsx
│   │   ├── SearchBar.tsx
│   │   └── MapView.tsx
│   ├── booking/
│   │   ├── HybridBookingForm.tsx       # For resorts/homestays/rentals
│   │   ├── OnlineBookingForm.tsx       # For destinations/activities
│   │   ├── DatePicker.tsx
│   │   ├── GuestSelector.tsx
│   │   └── PricingBreakdown.tsx
│   ├── detail/
│   │   ├── ImageGallery.tsx
│   │   ├── AmenitiesList.tsx
│   │   ├── LocationMap.tsx
│   │   ├── ReviewSection.tsx
│   │   └── SimilarListings.tsx
│   └── shared/
│       ├── LoadingSpinner.tsx
│       ├── EmptyState.tsx
│       ├── ErrorBoundary.tsx
│       └── SEOHead.tsx
├── lib/
│   ├── api/
│   │   ├── client.ts                   # Axios instance
│   │   ├── resorts.ts
│   │   ├── homestays.ts
│   │   ├── rentals.ts
│   │   ├── destinations.ts
│   │   ├── services.ts
│   │   └── auth.ts
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useBooking.ts
│   │   ├── useDebounce.ts
│   │   └── useMediaQuery.ts
│   ├── store/
│   │   ├── authStore.ts
│   │   ├── bookingStore.ts
│   │   └── uiStore.ts
│   ├── utils/
│   │   ├── formatters.ts
│   │   ├── validators.ts
│   │   ├── helpers.ts
│   │   └── constants.ts
│   └── types/
│       ├── listing.ts
│       ├── booking.ts
│       ├── user.ts
│       └── common.ts
├── public/
│   ├── images/
│   ├── icons/
│   └── manifest.json
└── styles/
    └── animations.css
```

---

## 🏠 Page-by-Page Development Tasks

### 1. Homepage (`/`)

#### Hero Section
```tsx
// Requirements:
- Full viewport height hero with parallax background
- Overlay gradient: night-blue-shadow to transparent
- Centered content with premium typography
- Search bar with category tabs (Resorts, Homestays, Rentals, Destinations)
- Animated CTA buttons with hover effects
- Background: High-quality Wayanad landscape image

// Design Specs:
- Heading: 72px (desktop), 48px (mobile), Playfair Display, white
- Subheading: 20px, Inter, white with 80% opacity
- Search bar: Elevated card with shadow-premium-lg
- CTAs: sand-tan primary, night-blue secondary
```

#### Category Cards Section
```tsx
// Requirements:
- 5 premium cards in responsive grid (2-3-5 columns)
- Each card: Icon, Title, Description, "Explore" link
- Cards: Resorts, Homestays, Rentals, Destinations, Services
- Hover effect: Lift animation + shadow-premium-lg
- Background gradient on hover from sand-tan-light to sand-tan

// Design Specs:
- Card padding: 32px
- Border radius: rounded-2xl
- Icons: 48px, sand-tan color
- Title: heading-4 style
- Description: body-normal, text-muted
```

#### Featured Listings
```tsx
// Requirements:
- Horizontal scrollable carousel with 4-6 featured listings
- Mix of resorts, homestays, and activities
- Each card: Image, Title, Location, Rating, Price, Quick View button
- Smooth scroll behavior with navigation arrows
- "View All" link to respective category

// Design Specs:
- Card width: 320px (mobile), 380px (desktop)
- Image aspect ratio: 4:3
- Image overlay: Gradient from transparent to night-blue-shadow
- Price badge: Positioned top-right, sand-tan background
```

#### Why Choose Us
```tsx
// Requirements:
- 3-column grid (1 column on mobile)
- Features: Hyperlocal Expertise, Instant Booking, Verified Reviews
- Icon + Title + Description for each
- Background: mist-gray section

// Design Specs:
- Section padding: 80px vertical
- Icons: 64px, sand-tan color in circular background
- Title: heading-3
- Description: body-large
```

#### Testimonials Slider
```tsx
// Requirements:
- Auto-playing carousel with 3-5 testimonials
- Each testimonial: Quote, Author name, Location, Star rating, Photo
- Pause on hover
- Navigation dots at bottom

// Design Specs:
- Quote: font-display, 24px, italic
- Card: White background, shadow-premium
- Author photo: 64px rounded-full
```

---

### 2. Resorts Listing Page (`/resorts`)

#### Layout Structure
```tsx
// Requirements:
- Sticky header with search and filter toggle
- Left sidebar: Filters (desktop), Bottom sheet (mobile)
- Main content: Grid of resort cards
- Top bar: Sort dropdown, View toggle (grid/list), Results count
- Load more button or infinite scroll

// Filter Categories:
- Price range slider
- Location checkboxes (Vythiri, Meppadi, Kalpetta, etc.)
- Amenities (Pool, WiFi, Restaurant, etc.)
- Star rating
- Property type
- Guest capacity
```

#### Resort Card Component
```tsx
// Requirements:
- Responsive card: 100% width (mobile), 2-3 columns (desktop)
- Image carousel with 3-5 photos
- Wishlist heart icon (top-right on image)
- Rating badge (top-left on image)
- Title, Location with pin icon
- Amenities icons (first 4)
- Price per night with "Book Now" CTA
- Hover effect: Slight scale up + shadow enhancement

// Design Specs:
- Image height: 240px
- Card padding: 16px
- Border: 1px solid gray-200
- Border radius: rounded-xl
- CTA button: sand-tan with hover state to sand-tan-dark
```

---

### 3. Individual Resort Page (`/resorts/[slug]`)

#### Image Gallery Section
```tsx
// Requirements:
- Hero image (large) + 4 thumbnail grid (right side on desktop)
- Lightbox modal on click showing full gallery
- Navigation arrows in lightbox
- Image counter (e.g., "3 / 12")
- Mobile: Single image with swipe gesture + dots indicator

// Design Specs:
- Hero image height: 500px (desktop), 300px (mobile)
- Thumbnails: 120px height each
- Lightbox: Full screen overlay with night-blue-shadow background
```

#### Details Section
```tsx
// Requirements:
- Two-column layout (desktop): Left = details, Right = booking card
- Single column (mobile): Details first, sticky booking bar at bottom

// Left Column Content:
1. Breadcrumb navigation
2. Title + Location
3. Quick stats: Rating, Reviews count, Property type
4. About section (rich text)
5. Amenities grid with icons
6. Room types accordion
7. House rules
8. Cancellation policy
9. Location map (Google Maps embed)
10. Reviews section with filter/sort
11. Similar resorts carousel

// Right Column (Sticky Booking Card):
- Price per night prominently displayed
- Date range picker
- Guest selector dropdown
- Total price breakdown
- "Book Now" CTA (opens hybrid booking form)
- WhatsApp quick contact button
- Phone number with click-to-call
```

#### Hybrid Booking Modal
```tsx
// Requirements:
- Full-screen modal (mobile), centered modal (desktop)
- Multi-step form with progress indicator
- Steps: 1) Dates & Guests, 2) Contact Info, 3) Special Requests
- Login/signup integration at step 2 (if not logged in)
- Pre-filled WhatsApp message generation
- "Send via WhatsApp" primary button
- "Copy Message" fallback button
- Form validation with error messages

// Design Specs:
- Modal max-width: 600px (desktop)
- Input fields: Consistent height 48px
- Button: Full width on mobile, auto width on desktop
- Progress bar: sand-tan color
```

---

### 4. Homestays, Rentals, Services Pages

#### Same Structure as Resorts with Category-Specific Variations:

**Homestays:**
- Emphasis on "Local Experience" badge
- Host profile section with photo and bio
- "Meet Your Host" section

**Rentals (Vehicles):**
- Vehicle specifications table
- Insurance details
- Pickup/dropoff location selector
- Hourly vs Daily pricing toggle
- Fuel policy information

**Services (Guides/Taxis/Photographers):**
- Service provider profile card
- Portfolio/experience section
- Availability calendar
- Rate card table
- Booking request form (similar to hybrid booking)

---

### 5. Destinations/Activities Page (`/destinations`)

#### Listing View
```tsx
// Requirements:
- Similar to resorts listing but with activity-specific filters
- Activity type filters (Trekking, Safari, Tours, Cultural, Adventure)
- Difficulty level badges
- Duration display
- "Book Now" shows instant booking flow (not hybrid)

// Unique Elements:
- Best time to visit indicator
- Group size limits
- Age restrictions badge
- Instant confirmation badge (emphasized)
```

#### Individual Activity Page (`/destinations/[slug]`)
```tsx
// Requirements:
- Similar structure to resort detail page
- Key differences:
  * Highlights section (What's included/excluded)
  * Itinerary timeline
  * What to bring checklist
  * Safety information
  * Weather considerations
  * Meeting point map

// Online Booking Card (Sticky):
- Date picker with real-time availability
- Participant selector (Adults/Children with age ranges)
- Time slot selector (if applicable)
- Price calculation per person
- Instant "Book & Pay" button
- Real-time availability status indicator
```

#### Online Booking Flow
```tsx
// Requirements:
- Simplified 2-step process
- Step 1: Activity details + participant info + date/time
- Login prompt if not authenticated
- Step 2: Payment directly integrated (Razorpay/Stripe)
- Instant confirmation screen with booking ID
- Automated confirmation email/WhatsApp
- Add to calendar button

// Design Specs:
- Streamlined form with minimal fields
- Progress indicator: 2 steps only
- Trust badges near payment section
- Secure payment icons
- Success animation on confirmation
```

---

### 6. Blog Pages

#### Blog Listing (`/blog`)
```tsx
// Requirements:
- Hero section with featured post
- Grid of blog cards (3 columns desktop, 1 mobile)
- Category filter tabs
- Search functionality
- Pagination or infinite scroll

// Blog Card:
- Featured image with aspect ratio 16:9
- Category badge
- Title (heading-4)
- Excerpt (2 lines max)
- Author avatar + name
- Read time
- Date
- "Read More" link
```

#### Blog Post (`/blog/[slug]`)
```tsx
// Requirements:
- Hero image with title overlay
- Breadcrumb navigation
- Author info card (left sidebar on desktop)
- Rich content area with typography styles
- Embedded booking widgets for mentioned listings
- Table of contents (auto-generated from headings)
- Share buttons (WhatsApp, Facebook, Twitter, Copy link)
- Related posts at bottom
- Comment section (future consideration)

// Content Booking Integration:
- Inline CTA cards within blog content
- Example: "Book Chembra Trek" card within article about treks
- Direct link to instant booking flow
```

---

## 🎨 Component Development Guidelines

### Button Component
```tsx
// variants: primary, secondary, outline, ghost, danger
// sizes: sm, md, lg, xl
// states: default, hover, active, disabled, loading

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
}

// Primary: bg-sand-tan, hover:bg-sand-tan-dark, text-white
// Secondary: bg-night-blue, hover:bg-night-blue-dark, text-white
// Outline: border-2 border-sand-tan, text-sand-tan, hover:bg-sand-tan hover:text-white
```

### Card Component
```tsx
// Premium card with elevation and hover effects
interface CardProps {
  elevation?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  children: React.ReactNode;
}

// Default: rounded-xl, shadow-premium, hover:shadow-premium-lg
// Smooth transition on all properties
```

### Input Component
```tsx
// Consistent form input styling
interface InputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  required?: boolean;
}

// Styling:
// - Border: 2px solid gray-300, focus:border-sand-tan
// - Height: 48px
// - Padding: 12px 16px
// - Error state: border-red-500, text-red-500
// - Focus ring: ring-2 ring-sand-tan ring-offset-2
```

---

## 📱 Responsive Design Breakpoints

```javascript
// Tailwind breakpoints to use consistently
const breakpoints = {
  sm: '640px',   // Mobile landscape
  md: '768px',   // Tablet
  lg: '1024px',  // Desktop
  xl: '1280px',  // Large desktop
  '2xl': '1536px' // Extra large
}

// Mobile-first approach:
// - Default styles for mobile (< 640px)
// - Use sm: md: lg: prefixes for larger screens
// - Test on: iPhone SE, iPhone 12, iPad, Desktop 1920px
```

---

## 🔄 State Management with Zustand

### Auth Store
```typescript
interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (phone: string, otp: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}
```

### Booking Store
```typescript
interface BookingStore {
  currentBooking: Booking | null;
  bookingType: 'hybrid' | 'online';
  step: number;
  setBookingDetails: (details: Partial<Booking>) => void;
  nextStep: () => void;
  previousStep: () => void;
  resetBooking: () => void;
  submitBooking: () => Promise<void>;
}
```

### UI Store
```typescript
interface UIStore {
  isMobileMenuOpen: boolean;
  isFilterOpen: boolean;
  activeModal: string | null;
  toast: Toast | null;
  toggleMobileMenu: () => void;
  toggleFilter: () => void;
  openModal: (modalId: string) => void;
  closeModal: () => void;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
}
```

---

## 🌐 API Integration

### Axios Client Setup
```typescript
// lib/api/client.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Handle 401, 403, 500 errors
    return Promise.reject(error);
  }
);
```

### API Functions Structure

Based on the actual WayanTrails API (OpenAPI 3.0 spec), here are the complete API integration modules:

```typescript
// lib/api/types.ts - TypeScript interfaces matching API schemas

export interface Resort {
  id: number;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  resort_type: 'luxury' | 'boutique' | 'eco' | 'family' | 'adventure';
  star_rating: 1 | 2 | 3 | 4 | 5;
  phone: string;
  email: string;
  website?: string;
  total_rooms: number;
  property_size?: string;
  year_established?: number;
  price_range_min: string;
  price_range_max: string;
  check_in_time: string;
  check_out_time: string;
  cancellation_policy: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  latitude?: string;
  longitude?: string;
  full_address?: string;
  cover_image: string;
  gallery_images: string[];
  is_active: boolean;
  is_featured: boolean;
  is_verified: boolean;
  commission_rate: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  room_types?: RoomType[];
  amenity_mappings?: ResortAmenityMapping[];
  seasonal_pricing?: SeasonalPricing[];
  average_rating?: string;
  total_reviews?: string;
  created_at?: string;
  updated_at?: string;
}

export interface RoomType {
  id: number;
  name: string;
  slug: string;
  room_type: 'standard' | 'deluxe' | 'suite' | 'villa' | 'cottage' | 'treehouse';
  description: string;
  size?: string;
  max_occupancy: number;
  base_price: string;
  weekend_price?: string;
  peak_season_price?: string;
  total_rooms: number;
  bed_type: string;
  has_ac: boolean;
  has_wifi: boolean;
  has_tv: boolean;
  has_balcony: boolean;
  has_bathtub: boolean;
  images: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ResortAmenity {
  id: number;
  name: string;
  category: 'recreation' | 'dining' | 'wellness' | 'business' | 'family' | 'outdoor' | 'transport' | 'services';
  icon: string;
  description?: string;
}

export interface ResortAmenityMapping {
  amenity: ResortAmenity;
  is_featured: boolean;
  additional_info?: string;
}

export interface SeasonalPricing {
  id: number;
  season_name: string;
  season_type: 'peak' | 'high' | 'normal' | 'low';
  start_date: string;
  end_date: string;
  price_multiplier: string;
  fixed_price?: string;
  is_active: boolean;
}

export interface Homestay {
  id: number;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  homestay_type: 'traditional' | 'farmstay' | 'village' | 'heritage' | 'eco';
  host_name: string;
  host_phone: string;
  host_email?: string;
  host_bio?: string;
  host_languages: string[];
  total_rooms: number;
  total_bathrooms: number;
  house_age?: number;
  family_size: number;
  max_guests: number;
  price_per_night: string;
  extra_person_charge: string;
  provides_meals: boolean;
  meal_types: string[];
  cooking_experience: boolean;
  local_guide_service: boolean;
  check_in_time: string;
  check_out_time: string;
  house_rules?: string;
  cancellation_policy: string;
  pet_friendly: boolean;
  children_friendly: boolean;
  elderly_friendly: boolean;
  cultural_activities: string[];
  farm_activities: string[];
  nearby_attractions: string[];
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  latitude?: string;
  longitude?: string;
  full_address?: string;
  cover_image: string;
  gallery_images: string[];
  is_active: boolean;
  is_featured: boolean;
  is_verified: boolean;
  commission_rate?: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  rooms?: HomestayRoom[];
  meal_plans?: MealPlan[];
  experiences?: Experience[];
  average_rating?: string;
  total_reviews?: string;
  created_at?: string;
  updated_at?: string;
}

export interface HomestayRoom {
  id: number;
  room_name: string;
  room_type: 'single' | 'double' | 'family' | 'shared' | 'dormitory';
  description?: string;
  max_occupancy: number;
  bed_configuration: string;
  has_ac: boolean;
  has_fan: boolean;
  has_wifi: boolean;
  has_attached_bathroom: boolean;
  has_balcony: boolean;
  has_study_table: boolean;
  base_price: string;
  images: string[];
  is_active: boolean;
}

export interface MealPlan {
  id: number;
  plan_name: string;
  meal_type: 'breakfast' | 'half_board' | 'full_board' | 'custom';
  description: string;
  price_per_person: string;
  child_price?: string;
  cuisine_type?: string;
  dietary_options: string[];
  special_dishes: string[];
  is_active: boolean;
  advance_notice_hours: number;
}

export interface Experience {
  id: number;
  name: string;
  slug: string;
  experience_type: 'cultural' | 'cooking' | 'farming' | 'craft' | 'nature' | 'spiritual';
  description: string;
  duration_hours: string;
  price_per_person: string;
  minimum_participants: number;
  maximum_participants: number;
  age_restriction?: string;
  fitness_level?: string;
  equipment_provided: boolean;
  equipment_list: string[];
  available_times: string[];
  advance_booking_days: number;
  images: string[];
  is_active: boolean;
}

export interface HomestayAmenity {
  id: number;
  name: string;
  category: 'basic' | 'kitchen' | 'outdoor' | 'entertainment' | 'services' | 'safety';
  icon: string;
  description?: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ResortFilterParams {
  city?: string;
  resort_type?: 'luxury' | 'boutique' | 'eco' | 'family' | 'adventure';
  star_rating?: 1 | 2 | 3 | 4 | 5;
  is_featured?: boolean;
  is_verified?: boolean;
  search?: string;
  ordering?: string;
  page?: number;
}

export interface HomestayFilterParams {
  city?: string;
  homestay_type?: 'traditional' | 'farmstay' | 'village' | 'heritage' | 'eco';
  provides_meals?: boolean;
  is_featured?: boolean;
  is_verified?: boolean;
  search?: string;
  ordering?: string;
  page?: number;
}
```

```typescript
// lib/api/resorts.ts
import { apiClient } from './client';
import type { Resort, PaginatedResponse, ResortFilterParams, RoomType, ResortAmenity } from './types';

export const resortsApi = {
  // Get all resorts with filters
  getAll: (params?: ResortFilterParams) => 
    apiClient.get<PaginatedResponse<Resort>>('/api/resorts/resorts/', { params }),
  
  // Get single resort by slug
  getBySlug: (slug: string) => 
    apiClient.get<Resort>(`/api/resorts/resorts/${slug}/`),
  
  // Get featured resorts
  getFeatured: () => 
    apiClient.get<Resort[]>('/api/resorts/resorts/featured/'),
  
  // Check availability for specific dates
  checkAvailability: (slug: string, checkIn: string, checkOut: string) => 
    apiClient.get<Resort>(`/api/resorts/resorts/${slug}/availability/`, {
      params: { check_in: checkIn, check_out: checkOut }
    }),
  
  // Get all amenities
  getAmenities: (params?: { category?: string; search?: string; page?: number }) => 
    apiClient.get<PaginatedResponse<ResortAmenity>>('/api/resorts/amenities/', { params }),
  
  // Get single amenity
  getAmenityById: (id: number) => 
    apiClient.get<ResortAmenity>(`/api/resorts/amenities/${id}/`),
  
  // Get room types
  getRoomTypes: (params?: { resort?: number; room_type?: string; is_active?: boolean; page?: number }) => 
    apiClient.get<PaginatedResponse<RoomType>>('/api/resorts/room-types/', { params }),
  
  // Get single room type
  getRoomTypeById: (id: number) => 
    apiClient.get<RoomType>(`/api/resorts/room-types/${id}/`),
};
```

```typescript
// lib/api/homestays.ts
import { apiClient } from './client';
import type { 
  Homestay, 
  PaginatedResponse, 
  HomestayFilterParams, 
  HomestayRoom, 
  MealPlan, 
  Experience,
  HomestayAmenity 
} from './types';

export const homestaysApi = {
  // Get all homestays with filters
  getAll: (params?: HomestayFilterParams) => 
    apiClient.get<PaginatedResponse<Homestay>>('/api/homestays/homestays/', { params }),
  
  // Get single homestay by slug
  getBySlug: (slug: string) => 
    apiClient.get<Homestay>(`/api/homestays/homestays/${slug}/`),
  
  // Get featured homestays
  getFeatured: () => 
    apiClient.get<Homestay[]>('/api/homestays/homestays/featured/'),
  
  // Get homestay rooms
  getRooms: (params?: { homestay?: number; room_type?: string; is_active?: boolean; page?: number }) => 
    apiClient.get<PaginatedResponse<HomestayRoom>>('/api/homestays/rooms/', { params }),
  
  // Get single room
  getRoomById: (id: number) => 
    apiClient.get<HomestayRoom>(`/api/homestays/rooms/${id}/`),
  
  // Get meal plans
  getMealPlans: (params?: { homestay?: number; meal_type?: string; is_active?: boolean; page?: number }) => 
    apiClient.get<PaginatedResponse<MealPlan>>('/api/homestays/meal-plans/', { params }),
  
  // Get single meal plan
  getMealPlanById: (id: number) => 
    apiClient.get<MealPlan>(`/api/homestays/meal-plans/${id}/`),
  
  // Get experiences
  getExperiences: (params?: { homestay?: number; experience_type?: string; is_active?: boolean; page?: number }) => 
    apiClient.get<PaginatedResponse<Experience>>('/api/homestays/experiences/', { params }),
  
  // Get single experience by slug
  getExperienceBySlug: (slug: string) => 
    apiClient.get<Experience>(`/api/homestays/experiences/${slug}/`),
  
  // Get amenities
  getAmenities: (params?: { category?: string; search?: string; page?: number }) => 
    apiClient.get<PaginatedResponse<HomestayAmenity>>('/api/homestays/amenities/', { params }),
  
  // Get single amenity
  getAmenityById: (id: number) => 
    apiClient.get<HomestayAmenity>(`/api/homestays/amenities/${id}/`),
};
```

```typescript
// lib/api/auth.ts
import { apiClient } from './client';

export interface OTPRequestPayload {
  phone: string;
}

export interface OTPVerifyPayload {
  phone: string;
  otp: string;
}

export interface TokenResponse {
  access: string;
  refresh: string;
}

export interface UserProfile {
  id: number;
  phone: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  // Add other user fields as needed
}

export const authApi = {
  // Request OTP
  requestOTP: (data: OTPRequestPayload) => 
    apiClient.post('/api/users/otp/request/', data),
  
  // Verify OTP
  verifyOTP: (data: OTPVerifyPayload) => 
    apiClient.post<TokenResponse>('/api/users/otp/verify/', data),
  
  // Get JWT token (traditional login)
  getToken: (phone: string, password: string) => 
    apiClient.post<TokenResponse>('/api/users/token/', { phone, password }),
  
  // Refresh token
  refreshToken: (refresh: string) => 
    apiClient.post<{ access: string }>('/api/users/token/refresh/', { refresh }),
  
  // Get current user profile
  getProfile: () => 
    apiClient.get<UserProfile>('/api/users/me/'),
  
  // Update user profile
  updateProfile: (data: Partial<UserProfile>) => 
    apiClient.patch<UserProfile>('/api/users/me/', data),
};
```

```typescript
// lib/hooks/useResorts.ts - React Query hooks example
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { resortsApi } from '@/lib/api/resorts';
import type { Resort, PaginatedResponse, ResortFilterParams } from '@/lib/api/types';

export const useResorts = (
  params?: ResortFilterParams,
  options?: UseQueryOptions<PaginatedResponse<Resort>>
) => {
  return useQuery({
    queryKey: ['resorts', params],
    queryFn: () => resortsApi.getAll(params),
    ...options,
  });
};

export const useResort = (slug: string, options?: UseQueryOptions<Resort>) => {
  return useQuery({
    queryKey: ['resort', slug],
    queryFn: () => resortsApi.getBySlug(slug),
    enabled: !!slug,
    ...options,
  });
};

export const useFeaturedResorts = (options?: UseQueryOptions<Resort[]>) => {
  return useQuery({
    queryKey: ['resorts', 'featured'],
    queryFn: () => resortsApi.getFeatured(),
    ...options,
  });
};
```

```typescript
// lib/hooks/useHomestays.ts
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { homestaysApi } from '@/lib/api/homestays';
import type { Homestay, PaginatedResponse, HomestayFilterParams } from '@/lib/api/types';

export const useHomestays = (
  params?: HomestayFilterParams,
  options?: UseQueryOptions<PaginatedResponse<Homestay>>
) => {
  return useQuery({
    queryKey: ['homestays', params],
    queryFn: () => homestaysApi.getAll(params),
    ...options,
  });
};

export const useHomestay = (slug: string, options?: UseQueryOptions<Homestay>) => {
  return useQuery({
    queryKey: ['homestay', slug],
    queryFn: () => homestaysApi.getBySlug(slug),
    enabled: !!slug,
    ...options,
  });
};

export const useFeaturedHomestays = (options?: UseQueryOptions<Homestay[]>) => {
  return useQuery({
    queryKey: ['homestays', 'featured'],
    queryFn: () => homestaysApi.getFeatured(),
    ...options,
  });
};
```

---

## 🎭 Animation Guidelines

### Page Transitions
```tsx
// Use Framer Motion for smooth page transitions
import { motion } from 'framer-motion';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

// Apply to page components
<motion.div
  variants={pageVariants}
  initial="initial"
  animate="animate"
  exit="exit"
  transition={{ duration: 0.3 }}
>
  {/* Page content */}
</motion.div>
```

### Hover Effects
```css
/* Premium hover transitions */
.card-hover {
  @apply transition-all duration-300 ease-out;
  @apply hover:scale-105 hover:shadow-premium-lg;
}

.button-hover {
  @apply transition-all duration-200 ease-out;
  @apply hover:-translate-y-0.5 hover:shadow-md;
  @apply active:translate-y-0 active:shadow-sm;
}

.image-hover {
  @apply transition-transform duration-500 ease-out;
  @apply hover:scale-110;
}
```

### Loading States
```tsx
// Skeleton loaders for async content
import { Skeleton } from '@/components/ui/Skeleton';

<Skeleton className="h-64 w-full rounded-xl" />
<Skeleton className="h-8 w-3/4 mt-4" />
<Skeleton className="h-4 w-1/2 mt-2" />
```

---

## 🔍 SEO Implementation

### Meta Tags
```tsx
// components/shared/SEOHead.tsx
import Head from 'next/head';

interface SEOHeadProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
}

// Generate complete meta tags including Open Graph and Twitter Cards
```

### Schema Markup
```tsx
// Add JSON-LD structured data for each page type

// Resort page schema
{
  "@context": "https://schema.org",
  "@type": "Hotel",
  "name": "Resort Name",
  "description": "...",
  "image": ["..."],
  "address": {...},
  "starRating": {...},
  "priceRange": "₹₹",
}

// Activity page schema
{
  "@context": "https://schema.org",
  "@type": "TouristAttraction",
  "name": "Activity Name",
  "description": "...",
  "image": ["..."],
}
```

---

## 📱 PWA Configuration

### Manifest.json
```json
{
  "name": "WayanTrails - Discover Wayanad",
  "short_name": "WayanTrails",
  "description": "Premium travel platform for Wayanad",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#2d545e",
  "theme_color": "#e1b382",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### Service Worker (next-pwa)
```javascript
// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

module.exports = withPWA({
  // Next.js config
});
```

---

## ✅ Quality Checklist

### Before Considering Any Page Complete:

#### Visual Quality
- [ ] Matches premium design system (colors, typography, spacing)
- [ ] Smooth animations and transitions
- [ ] Proper loading states for all async operations
- [ ] Error states with helpful messages
- [ ] Empty states with guidance

#### Responsive Design
- [ ] Tested on mobile (375px, 414px)
- [ ] Tested on tablet (768px, 1024px)
- [ ] Tested on desktop (1280px, 1920px)
- [ ] No horizontal scroll on any screen size
- [ ] Touch-friendly tap targets (min 44x44px)

#### Performance
- [ ] Images optimized and lazy-loaded with Next.js Image component
- [ ] Lighthouse score > 90 for all metrics
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3.5s
- [ ] No layout shifts (CLS < 0.1)
- [ ] Code splitting implemented for routes

#### Accessibility
- [ ] Keyboard navigation works throughout
- [ ] ARIA labels on interactive elements
- [ ] Color contrast ratio meets WCAG AA (4.5:1 minimum)
- [ ] Focus indicators visible and clear
- [ ] Screen reader tested with basic flows
- [ ] Form validation errors announced properly

#### Functionality
- [ ] All links and buttons functional
- [ ] Forms validate correctly
- [ ] Error handling implemented
- [ ] Success states show appropriate feedback
- [ ] Browser back/forward buttons work correctly
- [ ] No console errors or warnings

#### SEO
- [ ] Meta tags complete and accurate
- [ ] Structured data implemented
- [ ] Semantic HTML used throughout
- [ ] URLs are clean and descriptive
- [ ] Alt text on all images
- [ ] Proper heading hierarchy (h1, h2, h3...)

---

## 🚀 Priority Development Phases

### Phase 1: Core Foundation (Week 1-2)
**Goal: Get the basic site structure running**

#### Tasks:
1. **Project Setup**
   ```bash
   npx create-next-app@latest wayantrails-frontend --typescript --tailwind --app
   cd wayantrails-frontend
   npm install framer-motion zustand axios date-fns react-hook-form
   npm install -D @tailwindcss/forms @tailwindcss/typography
   ```

2. **Design System Implementation**
   - Configure Tailwind with premium color palette
   - Create typography classes in globals.css
   - Build base UI components (Button, Card, Input, Badge)
   - Set up animations.css with keyframes

3. **Layout Components**
   - Header with navigation and search
   - Footer with links and social media
   - Mobile navigation drawer
   - Breadcrumb component

4. **Homepage Development**
   - Hero section with search bar
   - Category cards (5 main sections)
   - Featured listings carousel
   - Why Choose Us section
   - Testimonials slider
   - Mobile responsive optimization

**Deliverable: Fully functional homepage with navigation**

---

### Phase 2: Listing Pages (Week 3-4)
**Goal: Complete browsing experience for all categories**

#### Tasks:
1. **Resorts Listing Page**
   - Filter sidebar with all categories
   - Resort card grid with hover effects
   - Search and sort functionality
   - Pagination/infinite scroll
   - Mobile filter bottom sheet

2. **Individual Resort Detail Page**
   - Image gallery with lightbox
   - Details section with amenities
   - Location map integration
   - Sticky booking card (right sidebar)
   - Reviews section with ratings
   - Similar listings carousel

3. **Clone Structure for Other Categories**
   - Homestays listing + detail pages
   - Rentals listing + detail pages
   - Services listing + detail pages
   - Adjust category-specific fields

**Deliverable: Complete browsing experience for all 5 main categories**

---

### Phase 3: Destinations & Online Booking (Week 5)
**Goal: Implement instant booking flow for activities**

#### Tasks:
1. **Destinations Listing Page**
   - Activity cards with difficulty badges
   - Activity-specific filters
   - Duration and group size display
   - Instant confirmation badges

2. **Activity Detail Page**
   - What's included/excluded section
   - Itinerary timeline
   - Meeting point map
   - Real-time availability calendar

3. **Online Booking Flow**
   - Date/time picker with availability
   - Participant selector
   - Login integration (if not authenticated)
   - Payment gateway integration (Razorpay/Stripe)
   - Instant confirmation screen
   - Booking confirmation email/WhatsApp trigger

**Deliverable: Fully functional instant booking for activities**

---

### Phase 4: Hybrid Booking System (Week 6)
**Goal: Form-to-WhatsApp booking for accommodations and rentals**

#### Tasks:
1. **Hybrid Booking Form Component**
   - Multi-step form with progress bar
   - Step 1: Dates, guests, room selection
   - Step 2: Contact information
   - Step 3: Special requests
   - Login/signup integration

2. **WhatsApp Integration**
   - Pre-filled message generation
   - "Send via WhatsApp" button (with deep link)
   - "Copy Message" fallback button
   - Confirmation screen with next steps

3. **Form State Management**
   - Zustand store for booking flow
   - Form validation with react-hook-form
   - Data persistence during authentication

**Deliverable: Complete hybrid booking flow for resorts, homestays, rentals**

---

### Phase 5: Authentication (Week 7)
**Goal: User login and account management**

#### Tasks:
1. **Login/Signup Pages**
   - Phone + OTP authentication UI
   - Google login integration
   - Modal and full-page versions
   - Form validation and error handling

2. **Auth State Management**
   - Zustand auth store
   - Token management (localStorage)
   - Protected route wrapper
   - Redirect after login

3. **User Account Pages**
   - Profile page
   - Booking history
   - Wishlist (future phase)
   - Settings

**Deliverable: Functional authentication system with phone OTP and Google login**

---

### Phase 6: Blog & Content (Week 8)
**Goal: Content marketing with booking integration**

#### Tasks:
1. **Blog Listing Page**
   - Featured post hero
   - Blog card grid
   - Category filters
   - Search functionality

2. **Blog Post Detail Page**
   - Rich content area with typography
   - Author info sidebar
   - Table of contents
   - Share buttons
   - Related posts

3. **Content-Booking Integration**
   - Inline booking CTA cards
   - Direct links to listing pages
   - Embedded instant booking widgets

**Deliverable: Complete blog system with booking integration**

---

### Phase 7: Polish & Optimization (Week 9-10)
**Goal: Production-ready quality**

#### Tasks:
1. **Performance Optimization**
   - Image optimization audit
   - Code splitting optimization
   - Lazy loading implementation
   - Bundle size analysis and reduction
   - Lighthouse score optimization

2. **PWA Implementation**
   - Service worker setup
   - Offline page
   - Install prompt
   - Push notifications (basic)

3. **SEO Optimization**
   - Meta tags on all pages
   - Schema markup implementation
   - Sitemap generation
   - robots.txt configuration

4. **Error Handling**
   - 404 page design
   - Error boundary implementation
   - API error handling refinement
   - Toast notifications system

5. **Accessibility Audit**
   - Keyboard navigation testing
   - Screen reader testing
   - Color contrast verification
   - ARIA labels addition

**Deliverable: Production-ready, optimized, accessible website**

---

## 🎯 Component Priority List

### Must Build First (Core Components)
1. Button - Primary, secondary, and outline variants
2. Card - Base card with elevation and hover
3. Input - Text, email, phone, textarea
4. Badge - Status, category, and rating badges
5. Modal - Reusable modal wrapper
6. Header - Navigation and search
7. Footer - Links and info
8. Hero Section - Homepage hero
9. Listing Card - Reusable for all categories
10. Image Gallery - Lightbox and carousel

### Build Second (Feature Components)
11. Filter Sidebar - Listing pages
12. Date Picker - Booking flows
13. Guest Selector - Booking flows
14. Booking Form - Hybrid and online variants
15. Review Card - Rating display
16. Price Breakdown - Cost details
17. Location Map - Google Maps integration
18. Search Bar - Global search
19. Breadcrumb - Navigation trail
20. Loading Spinner - Async operations

### Build Third (Enhancement Components)
21. Wishlist Button - Save functionality
22. Share Buttons - Social sharing
23. Testimonial Card - Reviews
24. FAQ Accordion - Information display
25. Toast Notifications - User feedback
26. Mobile Nav - Hamburger menu
27. Skeleton Loaders - Loading states
28. Empty State - No results
29. Error Boundary - Error handling
30. SEO Head - Meta tags

---

## 🛠️ Development Best Practices

### Code Organization
```typescript
// Use barrel exports for clean imports
// components/ui/index.ts
export { Button } from './Button';
export { Card } from './Card';
export { Input } from './Input';

// Import like this:
import { Button, Card, Input } from '@/components/ui';
```

### TypeScript Standards
```typescript
// Always define prop interfaces
interface ComponentProps {
  title: string;
  description?: string; // Optional props with ?
  onAction: () => void; // Function props
  children?: React.ReactNode; // For composition
}

// Use proper typing for API responses
interface Resort {
  id: string;
  name: string;
  slug: string;
  images: string[];
  pricePerNight: number;
  rating: number;
  // ... more fields
}

// Use enums for constants
enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
}
```

### Component Structure Template
```tsx
'use client'; // Only if needed (interactivity/hooks)

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui';
import type { ComponentProps } from '@/lib/types';

interface MyComponentProps {
  // Props here
}

export function MyComponent({ prop1, prop2 }: MyComponentProps) {
  // Hooks
  const [state, setState] = useState('');

  // Derived state
  const isValid = state.length > 0;

  // Event handlers
  const handleAction = () => {
    // Logic here
  };

  // Render
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="premium-component"
    >
      {/* JSX here */}
    </motion.div>
  );
}
```

### Styling Conventions
```tsx
// Use Tailwind utility classes with consistent ordering:
// 1. Layout (flex, grid, block)
// 2. Spacing (p-, m-)
// 3. Sizing (w-, h-)
// 4. Typography (text-, font-)
// 5. Colors (bg-, text-, border-)
// 6. Effects (shadow-, rounded-, opacity-)
// 7. Transitions (transition-, duration-)
// 8. States (hover:, focus:, active:)

<div className="
  flex items-center justify-between
  p-6 mx-auto
  w-full max-w-7xl
  text-lg font-semibold
  bg-white text-night-blue border-2 border-sand-tan
  rounded-xl shadow-premium
  transition-all duration-300
  hover:shadow-premium-lg hover:scale-105
">
  {/* Content */}
</div>

// For complex repeated styles, use CSS classes
// styles/components.css
.listing-card {
  @apply bg-white rounded-xl shadow-premium overflow-hidden;
  @apply transition-all duration-300;
  @apply hover:shadow-premium-lg hover:scale-105;
}
```

### Performance Tips
```tsx
// 1. Use Next.js Image component
import Image from 'next/image';

<Image
  src="/resort.jpg"
  alt="Resort name"
  width={800}
  height={600}
  className="object-cover"
  priority={false} // Only true for above-fold images
  loading="lazy"
/>

// 2. Lazy load components
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('@/components/HeavyComponent'), {
  loading: () => <Skeleton />,
  ssr: false, // Disable SSR if needed
});

// 3. Memoize expensive computations
import { useMemo } from 'react';

const filteredListings = useMemo(() => {
  return listings.filter(listing => 
    listing.price >= minPrice && listing.price <= maxPrice
  );
}, [listings, minPrice, maxPrice]);

// 4. Use React.memo for components that re-render often
import { memo } from 'react';

export const ListingCard = memo(({ listing }: Props) => {
  // Component logic
});
```

---

## 🧪 Testing Guidelines

### Component Testing Checklist
For each component, verify:

1. **Visual Testing**
   - Renders correctly on all screen sizes
   - Colors match design system
   - Typography is consistent
   - Spacing is appropriate
   - Animations are smooth

2. **Interaction Testing**
   - Click/tap handlers work
   - Hover states display correctly
   - Focus states are visible
   - Form inputs accept data
   - Validation errors show properly

3. **State Testing**
   - Component updates on state changes
   - Loading states display
   - Error states display
   - Empty states display
   - Success states display

4. **Edge Cases**
   - Long text doesn't break layout
   - Missing images show placeholder
   - Empty arrays handled gracefully
   - Network errors handled
   - Slow connections work

---

## 📦 Environment Variables

Create `.env.local` file:
```bash
# API
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_API_TIMEOUT=10000

# Authentication
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id

# Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_maps_api_key

# Payment Gateways
NEXT_PUBLIC_RAZORPAY_KEY=your_razorpay_key
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=your_stripe_key

# Media
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_preset

# WhatsApp
NEXT_PUBLIC_WHATSAPP_NUMBER=919876543210

# Feature Flags
NEXT_PUBLIC_ENABLE_PWA=true
NEXT_PUBLIC_ENABLE_ANALYTICS=false

# Environment
NEXT_PUBLIC_ENV=development
```

---

## 🎨 Design Assets Needed

Request from designer or create:

### Icons (SVG format)
- Logo (primary and white versions)
- Category icons (resort, homestay, rental, destination, services)
- Amenity icons (WiFi, pool, parking, restaurant, etc.)
- Social media icons
- UI icons (search, filter, calendar, user, menu, close, etc.)

### Images
- Hero background (high-res Wayanad landscape)
- Category placeholder images
- Default listing images
- Team photos (About page)
- Blog post featured images
- Favicon set (16x16, 32x32, 192x192, 512x512)

### Illustrations (Optional)
- Empty state illustrations
- Error page illustration
- Success confirmation illustration
- Loading state animation

---

## 🚨 Common Pitfalls to Avoid

1. **Don't use localStorage/sessionStorage in SSR context**
   ```tsx
   // ❌ Bad - Causes hydration errors
   const token = localStorage.getItem('token');
   
   // ✅ Good - Check if client-side first
   const token = typeof window !== 'undefined' 
     ? localStorage.getItem('token') 
     : null;
   
   // ✅ Better - Use useEffect
   useEffect(() => {
     const token = localStorage.getItem('token');
     // Use token
   }, []);
   ```

2. **Don't forget to optimize images**
   ```tsx
   // ❌ Bad - Large image size
   <img src="/big-resort.jpg" alt="Resort" />
   
   // ✅ Good - Optimized with Next.js
   <Image 
     src="/big-resort.jpg" 
     alt="Resort"
     width={800}
     height={600}
     quality={85}
   />
   ```

3. **Don't hardcode API URLs**
   ```tsx
   // ❌ Bad
   fetch('http://localhost:8000/api/resorts')
   
   // ✅ Good
   fetch(`${process.env.NEXT_PUBLIC_API_URL}/resorts`)
   ```

4. **Don't ignore loading states**
   ```tsx
   // ❌ Bad - No loading feedback
   const { data } = useQuery('resorts', fetchResorts);
   
   // ✅ Good - Show loading state
   const { data, isLoading, error } = useQuery('resorts', fetchResorts);
   if (isLoading) return <Skeleton />;
   if (error) return <ErrorMessage />;
   ```

5. **Don't skip error boundaries**
   ```tsx
   // Wrap app or routes with error boundary
   <ErrorBoundary fallback={<ErrorPage />}>
     <YourComponent />
   </ErrorBoundary>
   ```

---

## 📚 Resources & Documentation

### Official Docs
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [Zustand](https://github.com/pmndrs/zustand)

### Design Inspiration
- [Dribbble - Travel Websites](https://dribbble.com/tags/travel-website)
- [Awwwards - Travel](https://www.awwwards.com/websites/travel/)
- Airbnb, Booking.com for UX patterns

### Tools
- [Figma](https://figma.com) - Design handoff
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - Performance
- [React DevTools](https://react.dev/learn/react-developer-tools) - Debugging
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) - VSCode extension

---

## ✨ Final Notes for Claude Code

### Expectations:
1. **Pixel-perfect implementation** - Match the design system exactly
2. **Clean, maintainable code** - Follow TypeScript and React best practices
3. **Mobile-first approach** - Test on mobile viewport first
4. **Smooth animations** - Use Framer Motion for all transitions
5. **Accessible** - Keyboard navigation and ARIA labels
6. **Performance-optimized** - Lazy loading, code splitting, image optimization
7. **Error handling** - Never show raw errors to users
8. **Type safety** - No `any` types, proper interfaces for everything

### Before Marking Complete:
- [ ] All console errors resolved
- [ ] All TypeScript errors resolved
- [ ] Mobile responsive verified
- [ ] Animations smooth and performant
- [ ] Loading states implemented
- [ ] Error states implemented
- [ ] Accessibility checked
- [ ] Code formatted and linted

### Communication:
- Document any deviations from specs
- Ask questions if requirements unclear
- Suggest improvements where applicable
- Report any technical blockers immediately

---

## 🎉 Success Criteria

The frontend is complete when:

1. ✅ All 5 category pages are functional and beautiful
2. ✅ Homepage showcases the platform effectively
3. ✅ Both booking flows work seamlessly
4. ✅ Authentication is smooth and secure
5. ✅ Site is fast (Lighthouse > 90)
6. ✅ Site is responsive on all devices
7. ✅ Site is accessible (WCAG AA)
8. ✅ No console errors or warnings
9. ✅ Code is clean, typed, and documented
10. ✅ Ready for production deployment

---

**Remember:** This is a premium platform. Every pixel, every animation, every interaction should feel polished and intentional. Users should feel confident and excited to book their Wayanad experience through WayanTrails.

Good luck! 🚀