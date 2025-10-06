/**
 * Mock Payment Button Component
 * Use this for testing without real Razorpay keys
 */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMockPayment } from '@/hooks/useMockPayment';
import MockPaymentModal from './MockPaymentModal';

interface MockPaymentButtonProps {
  bookingId: string;
  bookingNumber: string;
  amount: number;
  guestName: string;
  guestEmail: string;
  guestContact: string;
  disabled?: boolean;
}

export default function MockPaymentButton({
  bookingId,
  bookingNumber,
  amount,
  guestName,
  guestEmail,
  guestContact,
  disabled
}: MockPaymentButtonProps) {
  const router = useRouter();
  const { initializeMockPayment, isProcessing, error, showModal } = useMockPayment();
  const [showSuccess, setShowSuccess] = useState(false);

  const handlePayment = () => {
    initializeMockPayment(
      bookingId,
      {
        amount,
        bookingNumber,
        guestName,
        guestEmail,
        guestContact
      },
      // On Success
      (response) => {
        console.log('Mock payment successful:', response);
        setShowSuccess(true);

        // Redirect to success page after 2 seconds
        setTimeout(() => {
          router.push(`/bookings/${bookingNumber}/payment-success`);
        }, 2000);
      },
      // On Error
      (error) => {
        console.error('Mock payment failed:', error);
      }
    );
  };

  return (
    <div className="space-y-4">
      {/* Mock Mode Warning */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <span className="text-lg">🧪</span>
          <div className="flex-1">
            <div className="font-semibold text-yellow-900 mb-1">
              Mock Payment Mode
            </div>
            <div className="text-sm text-yellow-800">
              You're using the mock payment gateway. No real payment will be processed.
              All payment methods will succeed instantly for testing.
            </div>
          </div>
        </div>
      </div>

      {/* Payment Button */}
      <button
        onClick={handlePayment}
        disabled={disabled || isProcessing}
        className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white py-4 px-6 rounded-lg font-semibold text-lg transition-colors shadow-lg hover:shadow-xl"
      >
        {isProcessing ? (
          <div className="flex items-center justify-center gap-2">
            <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
            Processing...
          </div>
        ) : (
          <>Pay ₹{amount.toLocaleString('en-IN')} (Mock)</>
        )}
      </button>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
          <div className="flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Success */}
      {showSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-sm">
          <div className="flex items-center gap-2">
            <span>✅</span>
            <span>Mock payment successful! Redirecting...</span>
          </div>
        </div>
      )}

      {/* Payment Methods Info */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p className="text-sm font-medium text-gray-700 mb-3">
          Available Mock Payment Methods:
        </p>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="px-3 py-2 bg-white rounded border flex items-center gap-2">
            <span>📱</span>
            <span className="font-medium">UPI</span>
          </div>
          <div className="px-3 py-2 bg-white rounded border flex items-center gap-2">
            <span>💳</span>
            <span className="font-medium">Cards</span>
          </div>
          <div className="px-3 py-2 bg-white rounded border flex items-center gap-2">
            <span>🏦</span>
            <span className="font-medium">Net Banking</span>
          </div>
          <div className="px-3 py-2 bg-white rounded border flex items-center gap-2">
            <span>💰</span>
            <span className="font-medium">Wallets</span>
          </div>
        </div>
        <p className="text-xs text-gray-600 mt-3">
          All methods will process instantly for testing purposes
        </p>
      </div>

      {/* Mock Payment Modal */}
      {showModal && <MockPaymentModal />}
    </div>
  );
}
