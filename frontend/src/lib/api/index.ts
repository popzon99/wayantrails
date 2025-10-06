// Export all API modules
export { resortsApi } from './resorts';
export { homestaysApi } from './homestays';
export { rentalsApi } from './rentals';
export { destinationsApi } from './destinations';
export { servicesApi } from './services';
export { bookingsApi } from './bookings';
export { authApi } from './auth';
export { default as apiClient } from './client';

// Export types
export type * from './types';
export type { Rental, RentalFilterParams } from './rentals';
export type { Destination, DestinationFilterParams } from './destinations';
export type { Service, ServiceFilterParams } from './services';
export type { CreateBookingPayload, BookingFilterParams } from './bookings';
