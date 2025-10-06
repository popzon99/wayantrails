/**
 * Mock Payment Hook for Testing
 * Simulates Razorpay payment flow without real API keys
 * Perfect for development and testing!
 */
'use client';

import { useState } from 'react';

interface MockPaymentOptions {
  amount: number;
  bookingNumber: string;
  guestName: string;
  guestEmail: string;
  guestContact: string;
}

interface MockPaymentResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  payment_method?: string;
}

export function useMockPayment() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Initialize mock payment
   * Shows a simulated payment modal with all payment options
   */
  const initializeMockPayment = async (
    bookingId: string,
    options: MockPaymentOptions,
    onSuccess: (response: MockPaymentResponse) => void,
    onError?: (error: any) => void
  ) => {
    setIsProcessing(true);
    setError(null);

    try {
      // Step 1: Create order (using mock API)
      const orderResponse = await fetch('/api/payments/create-order/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          booking_id: bookingId,
          payment_type: 'order'
        })
      });

      if (!orderResponse.ok) {
        throw new Error('Failed to create order');
      }

      const { data } = await orderResponse.json();

      // Step 2: Show mock payment modal
      setShowModal(true);
      setIsProcessing(false);

      // Store payment data for modal
      (window as any).__mockPaymentData = {
        order_id: data.order_id,
        amount: options.amount,
        bookingNumber: options.bookingNumber,
        guestName: options.guestName,
        onSuccess: async (paymentMethod: string) => {
          setShowModal(false);
          setIsProcessing(true);

          // Step 3: Simulate payment success
          const mockResponse: MockPaymentResponse = {
            razorpay_order_id: data.order_id,
            razorpay_payment_id: `pay_mock_${Date.now()}_${paymentMethod}`,
            razorpay_signature: 'mock_signature_success',
            payment_method: paymentMethod
          };

          // Step 4: Verify payment
          try {
            const verifyResponse = await fetch('/api/payments/verify/', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              },
              body: JSON.stringify(mockResponse)
            });

            if (!verifyResponse.ok) {
              throw new Error('Payment verification failed');
            }

            const verifyData = await verifyResponse.json();
            onSuccess(verifyData);
            setIsProcessing(false);

          } catch (error) {
            console.error('Payment verification error:', error);
            setError('Payment verification failed');
            setIsProcessing(false);
            onError?.(error);
          }
        },
        onFailure: () => {
          setShowModal(false);
          setIsProcessing(false);
          setError('Payment cancelled by user');
          onError?.(new Error('Payment cancelled'));
        }
      };

    } catch (error: any) {
      console.error('Payment initialization error:', error);
      setError(error.message || 'Failed to initialize payment');
      setIsProcessing(false);
      onError?.(error);
    }
  };

  const closeMockModal = () => {
    setShowModal(false);
    const data = (window as any).__mockPaymentData;
    if (data?.onFailure) {
      data.onFailure();
    }
  };

  return {
    initializeMockPayment,
    isProcessing,
    error,
    showModal,
    closeMockModal
  };
}
