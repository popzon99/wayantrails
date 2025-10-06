// Common types
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Resort types
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

// Homestay types
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

// Filter params
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

// Auth types
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
  date_of_birth?: string;
  profile_picture?: string;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

// Booking types
export interface Booking {
  id: number;
  user: number;
  resort?: number;
  homestay?: number;
  rental?: number;
  destination?: number;
  booking_type: 'hybrid' | 'online';
  check_in_date: string;
  check_out_date: string;
  guests: number;
  total_price: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  special_requests?: string;
  created_at: string;
  updated_at: string;
}

// Review types
export interface Review {
  id: number;
  user: UserProfile;
  resort?: number;
  homestay?: number;
  rating: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}
