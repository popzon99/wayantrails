/**
 * Mock Payment Modal
 * Simulates Razorpay payment checkout for testing
 * Shows all payment methods: UPI, Cards, Net Banking, Wallets
 */
'use client';

import { useState, useEffect } from 'react';
import { X, CreditCard, Smartphone, Building2, Wallet, ChevronRight } from 'lucide-react';

export default function MockPaymentModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [amount, setAmount] = useState(0);
  const [bookingNumber, setBookingNumber] = useState('');
  const [guestName, setGuestName] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    // Check for mock payment data
    const checkPaymentData = () => {
      const data = (window as any).__mockPaymentData;
      if (data) {
        setIsOpen(true);
        setAmount(data.amount);
        setBookingNumber(data.bookingNumber);
        setGuestName(data.guestName);
      }
    };

    checkPaymentData();
    const interval = setInterval(checkPaymentData, 100);

    return () => clearInterval(interval);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    const data = (window as any).__mockPaymentData;
    if (data?.onFailure) {
      data.onFailure();
    }
    (window as any).__mockPaymentData = null;
  };

  const handlePaymentSuccess = (method: string) => {
    setProcessing(true);
    setSelectedMethod(method);

    // Simulate processing delay
    setTimeout(() => {
      const data = (window as any).__mockPaymentData;
      if (data?.onSuccess) {
        data.onSuccess(method);
      }
      setIsOpen(false);
      setProcessing(false);
      (window as any).__mockPaymentData = null;
    }, 1500);
  };

  const paymentMethods = [
    {
      id: 'upi',
      name: 'UPI',
      icon: <Smartphone className="w-6 h-6" />,
      description: 'Pay using PhonePe, Google Pay, Paytm, etc.',
      popular: true
    },
    {
      id: 'card',
      name: 'Debit/Credit Card',
      icon: <CreditCard className="w-6 h-6" />,
      description: 'Visa, Mastercard, RuPay, Amex',
      popular: false
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      icon: <Building2 className="w-6 h-6" />,
      description: 'All major banks',
      popular: false
    },
    {
      id: 'wallet',
      name: 'Wallets',
      icon: <Wallet className="w-6 h-6" />,
      description: 'Paytm, PhonePe, Amazon Pay',
      popular: false
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Complete Payment</h2>
            <p className="text-sm text-gray-600 mt-1">
              Booking #{bookingNumber}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Amount */}
        <div className="bg-emerald-50 border-b border-emerald-100 px-6 py-4">
          <div className="text-sm text-gray-600">Amount to Pay</div>
          <div className="text-3xl font-bold text-emerald-600">
            ₹{amount.toLocaleString('en-IN')}
          </div>
        </div>

        {/* Mock Mode Badge */}
        <div className="bg-yellow-50 border-b border-yellow-100 px-6 py-3">
          <div className="flex items-center gap-2 text-sm text-yellow-800">
            <span className="font-semibold">🧪 MOCK MODE</span>
            <span>- Testing without real payment gateway</span>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="p-6">
          <h3 className="font-semibold mb-4">Choose Payment Method</h3>

          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => handlePaymentSuccess(method.id)}
                disabled={processing}
                className="w-full border rounded-lg p-4 hover:border-emerald-500 hover:bg-emerald-50 transition-all flex items-center justify-between group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center gap-4">
                  <div className="text-emerald-600 group-hover:scale-110 transition-transform">
                    {method.icon}
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-2">
                      <div className="font-semibold">{method.name}</div>
                      {method.popular && (
                        <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded">
                          Most Popular
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      {method.description}
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-600" />
              </button>
            ))}
          </div>

          {/* Processing State */}
          {processing && (
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                <div>
                  <div className="font-semibold text-blue-900">Processing Payment...</div>
                  <div className="text-sm text-blue-700">
                    Simulating {selectedMethod?.toUpperCase()} payment
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Info */}
          <div className="mt-6 space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>🔒</span>
              <span>Secure mock payment (no real transaction)</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>✓</span>
              <span>All methods will succeed instantly</span>
            </div>
          </div>

          {/* Guest Info */}
          <div className="mt-4 pt-4 border-t text-sm text-gray-600">
            <div>Guest: {guestName}</div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4">
          <div className="text-center text-sm text-gray-500">
            Powered by Mock Payment Gateway
          </div>
        </div>
      </div>
    </div>
  );
}
