'use client';

import { useState, useEffect } from 'react';
import { Calendar, Users, Check, Info } from 'lucide-react';

interface RoomType {
  name: string;
  price: number;
  capacity: number;
  features: string[];
  availability: string;
  roomsLeft: number;
}

interface StickyBookingCardProps {
  resortName: string;
  roomTypes: RoomType[];
  onBookingChange?: (data: BookingData) => void;
  onReserve?: () => void;
  isModal?: boolean; // Flag to indicate if rendered in modal
}

interface BookingData {
  checkIn: string;
  checkOut: string;
  guests: number;
  selectedRoomIndex: number;
  numberOfNights: number;
  totalPrice: number;
}

export default function StickyBookingCard({
  resortName,
  roomTypes,
  onBookingChange,
  onReserve,
  isModal = false
}: StickyBookingCardProps) {
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [guestCount, setGuestCount] = useState(2);
  const [selectedRoomIndex, setSelectedRoomIndex] = useState(0);
  const [numberOfNights, setNumberOfNights] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  const minPrice = Math.min(...roomTypes.map(r => r.price));
  const selectedRoom = roomTypes[selectedRoomIndex];

  // Calculate number of nights
  useEffect(() => {
    if (checkInDate && checkOutDate) {
      const checkIn = new Date(checkInDate);
      const checkOut = new Date(checkOutDate);
      const diffTime = checkOut.getTime() - checkIn.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setNumberOfNights(diffDays > 0 ? diffDays : 0);
    } else {
      setNumberOfNights(0);
    }
  }, [checkInDate, checkOutDate]);

  // Calculate total price
  useEffect(() => {
    if (numberOfNights > 0 && selectedRoom) {
      const baseTotal = selectedRoom.price * numberOfNights;
      const serviceFee = Math.round(baseTotal * 0.1); // 10% service fee
      const taxes = Math.round(baseTotal * 0.12); // 12% taxes
      setTotalPrice(baseTotal + serviceFee + taxes);

      // Call callback if provided
      if (onBookingChange) {
        onBookingChange({
          checkIn: checkInDate,
          checkOut: checkOutDate,
          guests: guestCount,
          selectedRoomIndex,
          numberOfNights,
          totalPrice: baseTotal + serviceFee + taxes,
        });
      }
    } else {
      setTotalPrice(0);
    }
  }, [numberOfNights, selectedRoomIndex, selectedRoom, checkInDate, checkOutDate, guestCount, onBookingChange]);

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  // Get minimum checkout date (day after check-in)
  const minCheckOut = checkInDate
    ? new Date(new Date(checkInDate).getTime() + 86400000).toISOString().split('T')[0]
    : today;

  const handleReserve = () => {
    if (!checkInDate || !checkOutDate) {
      alert('Please select check-in and check-out dates');
      return;
    }

    // Call the onReserve callback if provided
    if (onReserve) {
      onReserve();
    }
  };

  return (
    <aside className={isModal ? "w-full" : "hidden lg:block lg:sticky lg:top-24 w-full lg:w-[380px]"}>
      <div className={isModal ? "bg-white" : "border rounded-xl shadow-lg p-6 bg-white"}>
        {/* Price Display */}
        <div className="mb-6">
          <span className="text-sm text-gray-600">From</span>
          <div className="text-3xl font-bold text-gray-900">₹{minPrice.toLocaleString()}</div>
          <span className="text-gray-600">per night</span>
        </div>

        {/* Date Pickers */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="border rounded-lg p-3 hover:border-emerald-500 transition-colors">
            <label className="text-xs text-gray-600 font-medium flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Check-in
            </label>
            <input
              type="date"
              value={checkInDate}
              onChange={(e) => setCheckInDate(e.target.value)}
              min={today}
              className="w-full mt-1 text-sm font-medium outline-none cursor-pointer"
            />
          </div>
          <div className="border rounded-lg p-3 hover:border-emerald-500 transition-colors">
            <label className="text-xs text-gray-600 font-medium flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Check-out
            </label>
            <input
              type="date"
              value={checkOutDate}
              onChange={(e) => setCheckOutDate(e.target.value)}
              min={minCheckOut}
              disabled={!checkInDate}
              className="w-full mt-1 text-sm font-medium outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
        </div>

        {/* Guest Selector */}
        <div className="border rounded-lg p-3 mb-4 hover:border-emerald-500 transition-colors">
          <label className="text-xs text-gray-600 font-medium flex items-center gap-1">
            <Users className="w-3 h-3" />
            Guests
          </label>
          <select
            value={guestCount}
            onChange={(e) => setGuestCount(Number(e.target.value))}
            className="w-full mt-1 text-sm font-medium outline-none cursor-pointer"
          >
            <option value={1}>1 guest</option>
            <option value={2}>2 guests</option>
            <option value={3}>3 guests</option>
            <option value={4}>4 guests</option>
            <option value={5}>5 guests</option>
            <option value={6}>6 guests</option>
          </select>
        </div>

        {/* Room Type Selector */}
        <div className="mb-4 space-y-2">
          <label className="text-sm font-semibold text-gray-900">Select Room:</label>
          {roomTypes.map((room, index) => (
            <label
              key={index}
              className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all ${
                selectedRoomIndex === index
                  ? 'border-emerald-500 bg-emerald-50'
                  : 'hover:bg-gray-50 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="room"
                value={index}
                checked={selectedRoomIndex === index}
                onChange={() => setSelectedRoomIndex(index)}
                className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
              />
              <div className="flex-1">
                <div className="font-medium text-gray-900">{room.name}</div>
                <div className="text-sm text-gray-600">₹{room.price.toLocaleString()}/night • Up to {room.capacity} guests</div>
              </div>
              {room.availability === 'limited' && room.roomsLeft > 0 && (
                <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-1 rounded">
                  Only {room.roomsLeft} left
                </span>
              )}
              {room.availability === 'available' && (
                <Check className="w-5 h-5 text-emerald-600" />
              )}
            </label>
          ))}
        </div>

        {/* Price Breakdown */}
        {numberOfNights > 0 && (
          <div className="border-t pt-4 mb-4 space-y-2">
            <div className="flex justify-between text-sm text-gray-700">
              <span>₹{selectedRoom.price.toLocaleString()} × {numberOfNights} {numberOfNights === 1 ? 'night' : 'nights'}</span>
              <span>₹{(selectedRoom.price * numberOfNights).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-700">
              <span className="flex items-center gap-1">
                Service fee
                <Info className="w-3 h-3 text-gray-400" />
              </span>
              <span>₹{Math.round(selectedRoom.price * numberOfNights * 0.1).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-700">
              <span className="flex items-center gap-1">
                Taxes (12%)
                <Info className="w-3 h-3 text-gray-400" />
              </span>
              <span>₹{Math.round(selectedRoom.price * numberOfNights * 0.12).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t">
              <span>Total</span>
              <span>₹{totalPrice.toLocaleString()}</span>
            </div>
          </div>
        )}

        {/* Reserve Button */}
        <button
          onClick={handleReserve}
          disabled={!checkInDate || !checkOutDate}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Reserve Now
        </button>

        {/* Info Text */}
        <p className="text-xs text-gray-500 text-center mt-3">
          You won't be charged yet
        </p>

        {/* Features List */}
        <div className="mt-4 pt-4 border-t space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Check className="w-4 h-4 text-emerald-600" />
            Free cancellation up to 48 hours
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Check className="w-4 h-4 text-emerald-600" />
            Best price guarantee
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Check className="w-4 h-4 text-emerald-600" />
            Instant booking confirmation
          </div>
        </div>
      </div>
    </aside>
  );
}
