import apiClient from './client';
import type { Booking, PaginatedResponse } from './types';

export interface CreateBookingPayload {
  booking_type: 'resort' | 'homestay' | 'rental' | 'destination' | 'service';
  booking_method: 'online' | 'hybrid';
  content_type_id?: number; // Will be set based on booking_type
  object_id: number; // ID of the resort/homestay/etc
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  adults: number;
  children: number;
  total_guests: number;
  booking_date: string;
  check_in_date?: string;
  check_out_date?: string;
  booking_time?: string;
  base_amount: string;
  tax_amount: string;
  total_amount: string;
  special_requests?: string;
}

export interface PaymentOrderPayload {
  booking_id: string;
  payment_type: 'order' | 'payment_link';
}

export interface PaymentVerificationPayload {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface BookingFilterParams {
  status?: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'refunded' | 'no_show';
  booking_type?: 'resort' | 'homestay' | 'rental' | 'destination' | 'service';
  booking_method?: 'online' | 'hybrid';
  ordering?: string;
  page?: number;
  search?: string;
}

export const bookingsApi = {
  /**
   * Get all bookings for current user
   */
  getAll: async (params?: BookingFilterParams): Promise<PaginatedResponse<Booking>> => {
    return apiClient.get('bookings/bookings/', { params });
  },

  /**
   * Get single booking by ID or booking number
   */
  getById: async (id: string | number): Promise<Booking> => {
    return apiClient.get(`bookings/bookings/${id}/`);
  },

  /**
   * Get booking by booking number
   */
  getByBookingNumber: async (bookingNumber: string): Promise<Booking> => {
    return apiClient.get(`bookings/bookings/${bookingNumber}/`);
  },

  /**
   * Create a new booking
   */
  create: async (data: CreateBookingPayload): Promise<Booking> => {
    return apiClient.post('bookings/bookings/', data);
  },

  /**
   * Cancel a booking
   */
  cancel: async (id: string | number, reason?: string): Promise<any> => {
    return apiClient.post(`bookings/bookings/${id}/cancel/`, { reason });
  },

  /**
   * Confirm booking (staff only)
   */
  confirm: async (id: string | number): Promise<Booking> => {
    return apiClient.post(`bookings/bookings/${id}/confirm/`);
  },

  /**
   * Generate payment link (staff only)
   */
  generatePaymentLink: async (id: string | number): Promise<any> => {
    return apiClient.post(`bookings/bookings/${id}/generate_payment_link/`);
  },

  /**
   * Get WhatsApp link for booking
   */
  getWhatsAppLink: async (id: string | number): Promise<{ whatsapp_link: string }> => {
    return apiClient.get(`bookings/bookings/${id}/whatsapp_link/`);
  },

  /**
   * Check availability
   */
  checkAvailability: async (params: {
    content_type: string;
    object_id: number;
    date: string;
    guests: number;
  }): Promise<{ available: boolean }> => {
    return apiClient.post('bookings/bookings/check_availability/', params);
  },

  /**
   * Create payment order
   */
  createPaymentOrder: async (data: PaymentOrderPayload): Promise<any> => {
    return apiClient.post('bookings/payments/create-order/', data);
  },

  /**
   * Verify payment
   */
  verifyPayment: async (data: PaymentVerificationPayload): Promise<any> => {
    return apiClient.post('bookings/payments/verify/', data);
  },

  /**
   * Get payment methods
   */
  getPaymentMethods: async (): Promise<any> => {
    return apiClient.get('bookings/payments/methods/');
  },

  /**
   * Get payment status for booking
   */
  getPaymentStatus: async (bookingNumber: string): Promise<any> => {
    return apiClient.get(`bookings/payments/status/${bookingNumber}/`);
  },
};
