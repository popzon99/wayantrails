'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Calendar, Users, MapPin, Phone, Mail, MessageCircle, ArrowRight, Home, Copy, Check } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { bookingsApi } from '@/lib/api/bookings';
import Navbar from '@/components/Navbar';

interface Booking {
  id: string;
  booking_number: string;
  booking_type: string;
  status: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  check_in_date: string;
  check_out_date: string;
  adults: number;
  children: number;
  total_amount: string;
  base_amount: string;
  tax_amount: string;
  special_requests?: string;
  whatsapp_message_text?: string;
  created_at: string;
}

export default function BookingConfirmationPage() {
  const params = useParams();
  const router = useRouter();
  const bookingNumber = params.bookingNumber as string;

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [whatsappLink, setWhatsappLink] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (bookingNumber) {
      loadBooking();
    }
  }, [bookingNumber]);

  const loadBooking = async () => {
    try {
      const data = await bookingsApi.getByBookingNumber(bookingNumber);
      setBooking(data);

      // Get WhatsApp link
      try {
        const linkData = await bookingsApi.getWhatsAppLink(bookingNumber);
        setWhatsappLink(linkData.whatsapp_link);
      } catch (err) {
        console.error('Failed to load WhatsApp link:', err);
      }
    } catch (error) {
      console.error('Failed to load booking:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyBookingNumber = () => {
    navigator.clipboard.writeText(bookingNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateNights = () => {
    if (!booking) return 0;
    const checkIn = new Date(booking.check_in_date);
    const checkOut = new Date(booking.check_out_date);
    const diff = checkOut.getTime() - checkIn.getTime();
    return Math.ceil(diff / (1000 * 3600 * 24));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 py-24">
          <div className="animate-pulse space-y-6">
            <div className="h-32 bg-gray-200 rounded-xl"></div>
            <div className="h-96 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 py-24 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Booking Not Found</h1>
          <p className="text-gray-600 mb-6">The booking you're looking for doesn't exist.</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const nights = calculateNights();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Success Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-16 h-16 text-green-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Booking Request Sent!
          </h1>
          <p className="text-lg text-gray-600">
            We've received your booking request and will confirm within 2 hours
          </p>
        </motion.div>

        {/* Booking Reference */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-6 mb-6"
        >
          <p className="text-sm text-gray-600 mb-2">Booking Reference</p>
          <div className="flex items-center justify-between">
            <p className="text-3xl font-bold text-gray-900">{booking.booking_number}</p>
            <button
              onClick={handleCopyBookingNumber}
              className="p-2 hover:bg-white rounded-lg transition"
            >
              {copied ? (
                <Check className="w-5 h-5 text-green-600" />
              ) : (
                <Copy className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>
          <div className="mt-3">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
              booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {booking.status === 'pending' && '⏳ Pending Confirmation'}
              {booking.status === 'confirmed' && '✓ Confirmed'}
              {booking.status === 'cancelled' && '✗ Cancelled'}
            </span>
          </div>
        </motion.div>

        {/* Booking Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-6"
        >
          <h2 className="font-bold text-xl mb-4">Booking Details</h2>

          {/* Dates */}
          <div className="space-y-4">
            <div className="flex items-start gap-4 pb-4 border-b">
              <Calendar className="w-5 h-5 text-emerald-600 mt-1" />
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">Check-in & Check-out</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium">{formatDate(booking.check_in_date)}</p>
                    <p className="text-xs text-gray-500">After 2:00 PM</p>
                  </div>
                  <div>
                    <p className="font-medium">{formatDate(booking.check_out_date)}</p>
                    <p className="text-xs text-gray-500">Before 11:00 AM</p>
                  </div>
                </div>
                <p className="text-sm text-emerald-600 font-medium mt-2">
                  {nights} night{nights > 1 ? 's' : ''}
                </p>
              </div>
            </div>

            {/* Guests */}
            <div className="flex items-start gap-4 pb-4 border-b">
              <Users className="w-5 h-5 text-emerald-600 mt-1" />
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">Guests</p>
                <p className="font-medium">
                  {booking.adults} Adult{booking.adults > 1 ? 's' : ''}
                  {booking.children > 0 && `, ${booking.children} Child${booking.children > 1 ? 'ren' : ''}`}
                </p>
              </div>
            </div>

            {/* Guest Details */}
            <div className="flex items-start gap-4 pb-4 border-b">
              <Mail className="w-5 h-5 text-emerald-600 mt-1" />
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">Guest Information</p>
                <p className="font-medium">{booking.guest_name}</p>
                <p className="text-sm text-gray-600">{booking.guest_email}</p>
                <p className="text-sm text-gray-600">{booking.guest_phone}</p>
              </div>
            </div>

            {/* Special Requests */}
            {booking.special_requests && (
              <div className="flex items-start gap-4">
                <MessageCircle className="w-5 h-5 text-emerald-600 mt-1" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">Special Requests</p>
                  <p className="text-sm text-gray-700">{booking.special_requests}</p>
                </div>
              </div>
            )}
          </div>

          {/* Price Breakdown */}
          <div className="mt-6 pt-6 border-t">
            <h3 className="font-bold mb-3">Price Breakdown</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Base Amount ({nights} {nights > 1 ? 'nights' : 'night'})</span>
                <span className="font-medium">₹{parseFloat(booking.base_amount).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Taxes & Service (12%)</span>
                <span className="font-medium">₹{parseFloat(booking.tax_amount).toLocaleString()}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold text-lg">
                <span>Total Amount</span>
                <span className="text-emerald-600">₹{parseFloat(booking.total_amount).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6"
        >
          <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-blue-600" />
            Next Steps
          </h3>
          <ol className="space-y-2 text-sm text-gray-700">
            <li className="flex gap-2">
              <span className="font-bold text-blue-600">1.</span>
              <span>Our team will confirm availability within 2 hours</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-blue-600">2.</span>
              <span>You'll receive a WhatsApp message with payment link</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-blue-600">3.</span>
              <span>Complete payment to confirm your booking</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-blue-600">4.</span>
              <span>Receive booking confirmation & e-voucher</span>
            </li>
          </ol>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col gap-3"
        >
          {whatsappLink && (
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 text-white text-center py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-green-600 transition shadow-lg"
            >
              <MessageCircle className="w-5 h-5" />
              Chat with Us on WhatsApp
            </a>
          )}

          <Link
            href="/dashboard/bookings"
            className="border-2 border-gray-300 text-center py-4 rounded-xl font-semibold hover:bg-gray-50 transition"
          >
            View in My Bookings
          </Link>

          <Link
            href="/"
            className="text-center text-gray-600 py-3 hover:text-gray-900 transition flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
        </motion.div>

        {/* Cancellation Policy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 p-4 bg-gray-100 rounded-lg text-sm text-gray-600"
        >
          <p className="font-medium mb-2">Cancellation Policy</p>
          <ul className="space-y-1 text-xs">
            <li>• Free cancellation up to 3 days before check-in</li>
            <li>• 50% refund if cancelled 1-3 days before check-in</li>
            <li>• No refund for cancellations within 24 hours</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
