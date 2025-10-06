import { create } from 'zustand';
import type { CreateBookingPayload } from '@/lib/api/bookings';

interface BookingState {
  // Current booking details
  currentBooking: Partial<CreateBookingPayload> | null;
  bookingType: 'hybrid' | 'online' | null;
  step: number;
  totalSteps: number;

  // Actions
  setBookingDetails: (details: Partial<CreateBookingPayload>) => void;
  setBookingType: (type: 'hybrid' | 'online') => void;
  nextStep: () => void;
  previousStep: () => void;
  goToStep: (step: number) => void;
  resetBooking: () => void;
}

export const useBookingStore = create<BookingState>((set, get) => ({
  currentBooking: null,
  bookingType: null,
  step: 1,
  totalSteps: 3,

  setBookingDetails: (details) =>
    set((state) => ({
      currentBooking: {
        ...state.currentBooking,
        ...details,
      },
    })),

  setBookingType: (type) =>
    set({
      bookingType: type,
      currentBooking: { booking_type: type },
    }),

  nextStep: () =>
    set((state) => ({
      step: Math.min(state.step + 1, state.totalSteps),
    })),

  previousStep: () =>
    set((state) => ({
      step: Math.max(state.step - 1, 1),
    })),

  goToStep: (step) =>
    set((state) => ({
      step: Math.max(1, Math.min(step, state.totalSteps)),
    })),

  resetBooking: () =>
    set({
      currentBooking: null,
      bookingType: null,
      step: 1,
    }),
}));
