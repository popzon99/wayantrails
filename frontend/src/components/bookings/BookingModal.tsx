'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Users, Home, ChevronRight, ChevronLeft, Loader2 } from 'lucide-react';
import { bookingsApi, type CreateBookingPayload } from '@/lib/api/bookings';
import { useRouter } from 'next/navigation';

interface Resort {
  id: number;
  name: string;
  city: string;
  state: string;
}

interface RoomType {
  id: number;
  name: string;
  price_per_night: string;
  max_guests: number;
  description: string;
  amenities: string[];
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  resort: Resort;
  roomTypes: RoomType[];
  initialCheckIn?: string;
  initialCheckOut?: string;
  initialAdults?: number;
  initialChildren?: number;
}

export default function BookingModal({
  isOpen,
  onClose,
  resort,
  roomTypes,
  initialCheckIn = '',
  initialCheckOut = '',
  initialAdults = 2,
  initialChildren = 0
}: BookingModalProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Initialize booking data from localStorage or props
  const getInitialBookingData = () => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('wayantrails_booking_draft');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // Only use saved data if it's for the same resort
          if (parsed.resortId === resort.id) {
            return {
              ...parsed,
              checkIn: initialCheckIn || parsed.checkIn,
              checkOut: initialCheckOut || parsed.checkOut,
              adults: initialAdults || parsed.adults,
              children: initialChildren || parsed.children,
            };
          }
        } catch (e) {
          console.error('Failed to parse saved booking data', e);
        }
      }
    }
    return {
      resortId: resort.id,
      checkIn: initialCheckIn,
      checkOut: initialCheckOut,
      adults: initialAdults,
      children: initialChildren,
      roomTypeId: roomTypes[0]?.id || 0,
      guestName: '',
      guestEmail: '',
      guestPhone: '',
      specialRequests: ''
    };
  };

  const [bookingData, setBookingData] = useState(getInitialBookingData());

  // Update booking data when initial values change
  useEffect(() => {
    setBookingData(prev => ({
      ...prev,
      checkIn: initialCheckIn,
      checkOut: initialCheckOut,
      adults: initialAdults,
      children: initialChildren
    }));
  }, [initialCheckIn, initialCheckOut, initialAdults, initialChildren]);

  // Save booking data to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined' && bookingData) {
      localStorage.setItem('wayantrails_booking_draft', JSON.stringify(bookingData));
    }
  }, [bookingData]);

  const selectedRoom = roomTypes.find(r => r.id === bookingData.roomTypeId);
  const nights = calculateNights(bookingData.checkIn, bookingData.checkOut);
  const baseAmount = selectedRoom ? parseFloat(selectedRoom.price_per_night) * nights : 0;
  const taxAmount = baseAmount * 0.12;
  const totalAmount = baseAmount + taxAmount;

  function calculateNights(checkIn: string, checkOut: string) {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = end.getTime() - start.getTime();
    return Math.ceil(diff / (1000 * 3600 * 24));
  }

  const canProceed = () => {
    switch (step) {
      case 1:
        return bookingData.checkIn && bookingData.checkOut && nights > 0;
      case 2:
        return bookingData.adults > 0 && (bookingData.adults + bookingData.children) <= (selectedRoom?.max_guests || 0);
      case 3:
        return bookingData.roomTypeId > 0;
      case 4:
        return bookingData.guestName && bookingData.guestEmail && bookingData.guestPhone;
      default:
        return true;
    }
  };

  const handleConfirmBooking = async () => {
    setIsSubmitting(true);
    setError('');

    try {
      const payload: CreateBookingPayload = {
        booking_type: 'resort',
        booking_method: 'hybrid', // Using hybrid for WhatsApp flow
        object_id: resort.id,
        guest_name: bookingData.guestName,
        guest_email: bookingData.guestEmail,
        guest_phone: bookingData.guestPhone,
        adults: bookingData.adults,
        children: bookingData.children,
        total_guests: bookingData.adults + bookingData.children,
        booking_date: new Date().toISOString().split('T')[0],
        check_in_date: bookingData.checkIn,
        check_out_date: bookingData.checkOut,
        base_amount: baseAmount.toFixed(2),
        tax_amount: taxAmount.toFixed(2),
        total_amount: totalAmount.toFixed(2),
        special_requests: bookingData.specialRequests
      };

      const booking = await bookingsApi.create(payload);

      // Clear saved booking draft from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('wayantrails_booking_draft');
      }

      // Close modal
      onClose();

      // Redirect to confirmation page with booking number
      router.push(`/bookings/${booking.booking_number || booking.id}/confirmation`);
    } catch (err: any) {
      console.error('Booking error:', err);
      setError(err.response?.data?.detail || err.message || 'Failed to create booking. Please try again.');
      setIsSubmitting(false);
    }
  };

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
            className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl max-h-[90vh] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b px-4 py-4 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-lg">Book {resort.name}</h2>
                <p className="text-sm text-gray-600">Step {step} of 5</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="h-1 bg-gray-100">
              <motion.div
                className="h-full bg-emerald-600"
                initial={{ width: 0 }}
                animate={{ width: `${(step / 5) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Step 1: Dates */}
              {step === 1 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl">Select Dates</h3>
                      <p className="text-sm text-gray-600">When do you want to stay?</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Check-in Date</label>
                    <input
                      type="date"
                      value={bookingData.checkIn}
                      onChange={(e) => setBookingData({ ...bookingData, checkIn: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Check-out Date</label>
                    <input
                      type="date"
                      value={bookingData.checkOut}
                      onChange={(e) => setBookingData({ ...bookingData, checkOut: e.target.value })}
                      min={bookingData.checkIn || new Date().toISOString().split('T')[0]}
                      className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>

                  {nights > 0 && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                      <p className="text-emerald-800 font-medium">
                        Duration: {nights} night{nights > 1 ? 's' : ''}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: Guests */}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl">Number of Guests</h3>
                      <p className="text-sm text-gray-600">Who's coming?</p>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="font-medium">Adults</p>
                        <p className="text-sm text-gray-600">Age 13+</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setBookingData({ ...bookingData, adults: Math.max(1, bookingData.adults - 1) })}
                          className="w-10 h-10 border rounded-full flex items-center justify-center hover:bg-gray-100"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-bold">{bookingData.adults}</span>
                        <button
                          onClick={() => setBookingData({ ...bookingData, adults: bookingData.adults + 1 })}
                          className="w-10 h-10 border rounded-full flex items-center justify-center hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Children</p>
                        <p className="text-sm text-gray-600">Age 0-12</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setBookingData({ ...bookingData, children: Math.max(0, bookingData.children - 1) })}
                          className="w-10 h-10 border rounded-full flex items-center justify-center hover:bg-gray-100"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-bold">{bookingData.children}</span>
                        <button
                          onClick={() => setBookingData({ ...bookingData, children: bookingData.children + 1 })}
                          className="w-10 h-10 border rounded-full flex items-center justify-center hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {selectedRoom && (bookingData.adults + bookingData.children) > selectedRoom.max_guests && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-red-800 text-sm">
                        Selected room supports maximum {selectedRoom.max_guests} guests. Please select a different room or reduce guests.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Room Selection */}
              {step === 3 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                      <Home className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl">Select Room Type</h3>
                      <p className="text-sm text-gray-600">Choose your accommodation</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {roomTypes.map((room) => (
                      <label
                        key={room.id}
                        className={`block border-2 rounded-lg p-4 cursor-pointer transition ${
                          bookingData.roomTypeId === room.id
                            ? 'border-emerald-600 bg-emerald-50'
                            : 'border-gray-200 hover:border-emerald-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="roomType"
                          value={room.id}
                          checked={bookingData.roomTypeId === room.id}
                          onChange={() => setBookingData({ ...bookingData, roomTypeId: room.id })}
                          className="sr-only"
                        />
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-bold text-lg">{room.name}</p>
                            <p className="text-sm text-gray-600">Up to {room.max_guests} guests</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg">₹{parseFloat(room.price_per_night).toLocaleString()}</p>
                            <p className="text-xs text-gray-600">per night</p>
                          </div>
                        </div>
                        {room.description && (
                          <p className="text-sm text-gray-600 mb-2">{room.description}</p>
                        )}
                        {room.amenities && room.amenities.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {room.amenities.slice(0, 3).map((amenity, idx) => (
                              <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded">
                                {amenity}
                              </span>
                            ))}
                          </div>
                        )}
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 4: Guest Details */}
              {step === 4 && (
                <div className="space-y-4">
                  <div className="mb-6">
                    <h3 className="font-bold text-xl mb-2">Guest Details</h3>
                    <p className="text-sm text-gray-600">Who's checking in?</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name *</label>
                    <input
                      type="text"
                      value={bookingData.guestName}
                      onChange={(e) => setBookingData({ ...bookingData, guestName: e.target.value })}
                      placeholder="John Doe"
                      className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Email *</label>
                    <input
                      type="email"
                      value={bookingData.guestEmail}
                      onChange={(e) => setBookingData({ ...bookingData, guestEmail: e.target.value })}
                      placeholder="john@example.com"
                      className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      value={bookingData.guestPhone}
                      onChange={(e) => setBookingData({ ...bookingData, guestPhone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Special Requests (Optional)</label>
                    <textarea
                      value={bookingData.specialRequests}
                      onChange={(e) => setBookingData({ ...bookingData, specialRequests: e.target.value })}
                      placeholder="Early check-in, high floor, etc."
                      rows={3}
                      className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                </div>
              )}

              {/* Step 5: Summary */}
              {step === 5 && (
                <div className="space-y-4">
                  <div className="mb-6">
                    <h3 className="font-bold text-xl mb-2">Booking Summary</h3>
                    <p className="text-sm text-gray-600">Review your booking details</p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Resort</p>
                      <p className="font-medium">{resort.name}</p>
                      <p className="text-sm text-gray-500">{resort.city}, {resort.state}</p>
                    </div>

                    <div className="border-t pt-3">
                      <p className="text-sm text-gray-600">Dates</p>
                      <p className="font-medium">{new Date(bookingData.checkIn).toLocaleDateString()} - {new Date(bookingData.checkOut).toLocaleDateString()}</p>
                      <p className="text-sm text-gray-500">{nights} night{nights > 1 ? 's' : ''}</p>
                    </div>

                    <div className="border-t pt-3">
                      <p className="text-sm text-gray-600">Guests</p>
                      <p className="font-medium">{bookingData.adults} Adult{bookingData.adults > 1 ? 's' : ''}{bookingData.children > 0 && `, ${bookingData.children} Child${bookingData.children > 1 ? 'ren' : ''}`}</p>
                    </div>

                    <div className="border-t pt-3">
                      <p className="text-sm text-gray-600">Room Type</p>
                      <p className="font-medium">{selectedRoom?.name}</p>
                    </div>

                    <div className="border-t pt-3">
                      <p className="text-sm text-gray-600">Guest Details</p>
                      <p className="font-medium">{bookingData.guestName}</p>
                      <p className="text-sm text-gray-500">{bookingData.guestEmail}</p>
                      <p className="text-sm text-gray-500">{bookingData.guestPhone}</p>
                    </div>

                    {bookingData.specialRequests && (
                      <div className="border-t pt-3">
                        <p className="text-sm text-gray-600">Special Requests</p>
                        <p className="text-sm text-gray-700">{bookingData.specialRequests}</p>
                      </div>
                    )}
                  </div>

                  {/* Price Breakdown */}
                  <div className="border rounded-lg p-4 space-y-2">
                    <h4 className="font-bold mb-3">Price Breakdown</h4>
                    <div className="flex justify-between text-sm">
                      <span>₹{selectedRoom && parseFloat(selectedRoom.price_per_night).toLocaleString()} × {nights} nights</span>
                      <span>₹{baseAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Taxes & Service (12%)</span>
                      <span>₹{taxAmount.toLocaleString()}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>₹{totalAmount.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      <span className="font-medium">✓ Free cancellation</span> until 3 days before check-in
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-white border-t px-4 py-4">
              {error && (
                <div className="mb-3 bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}
              <div className="flex gap-3">
                {step > 1 && !isSubmitting && (
                  <button
                    onClick={() => setStep(step - 1)}
                    className="flex-1 border py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-gray-50"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    Back
                  </button>
                )}
                <button
                  onClick={() => step < 5 ? setStep(step + 1) : handleConfirmBooking()}
                  disabled={!canProceed() || isSubmitting}
                  className={`flex-1 py-3 rounded-lg font-medium flex items-center justify-center gap-2 ${
                    canProceed() && !isSubmitting
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Creating Booking...
                    </>
                  ) : step < 5 ? (
                    <>
                      Continue
                      <ChevronRight className="w-5 h-5" />
                    </>
                  ) : (
                    'Confirm Booking'
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
