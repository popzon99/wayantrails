# Payment Integration Guide - WayanTrails

## 🎯 Overview

Complete guide for integrating Razorpay payment gateway with support for:
- ✅ **UPI** (PhonePe, Google Pay, Paytm, BHIM, etc.)
- ✅ **Debit/Credit Cards** (Visa, Mastercard, RuPay, Amex)
- ✅ **Net Banking** (All major banks)
- ✅ **Digital Wallets** (Paytm, PhonePe, Amazon Pay, Mobikwik)
- ✅ **EMI** (No-cost and standard EMI options)

---

## 📦 Backend Setup (Already Complete!)

### 1. Models
✅ Payment model with support for all payment methods
✅ Tracking of UPI ID, card details, wallet info
✅ Payment verification and signature validation

### 2. API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/payments/create-order/` | POST | Create Razorpay order |
| `/api/payments/verify/` | POST | Verify payment after success |
| `/api/payments/webhook/` | POST | Razorpay webhook (automatic) |
| `/api/payments/refund/` | POST | Create refund (staff only) |
| `/api/payments/methods/` | GET | Get available payment methods |
| `/api/payments/status/{booking_number}/` | GET | Get payment status |

---

## 🚀 Frontend Implementation

### Step 1: Install Razorpay Script

Add to your `layout.tsx` or `_document.tsx`:

```tsx
// frontend/src/app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Razorpay Checkout Script */}
        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
      </head>
      <body>{children}</body>
    </html>
  )
}
```

### Step 2: Create Payment Hook

```typescript
// frontend/src/hooks/useRazorpay.ts
'use client';

import { useState } from 'react';

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  notes: Record<string, any>;
  theme: {
    color: string;
  };
  handler: (response: any) => void;
  modal?: {
    ondismiss?: () => void;
  };
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export function useRazorpay() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initializePayment = async (
    bookingId: string,
    onSuccess: (response: any) => void,
    onError?: (error: any) => void
  ) => {
    setIsProcessing(true);
    setError(null);

    try {
      // Step 1: Create order
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

      // Step 2: Open Razorpay checkout
      const options: RazorpayOptions = {
        key: data.key,
        amount: data.amount * 100, // Convert to paise
        currency: data.currency,
        name: data.name,
        description: data.description,
        order_id: data.order_id,
        prefill: data.prefill,
        notes: data.notes,
        theme: data.theme,
        handler: async (response) => {
          try {
            // Step 3: Verify payment
            const verifyResponse = await fetch('/api/payments/verify/', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
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
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
            setError('Payment cancelled by user');
          }
        }
      };

      // Initialize Razorpay
      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error: any) {
      console.error('Payment initialization error:', error);
      setError(error.message || 'Failed to initialize payment');
      setIsProcessing(false);
      onError?.(error);
    }
  };

  return {
    initializePayment,
    isProcessing,
    error
  };
}
```

### Step 3: Payment Button Component

```tsx
// frontend/src/components/PaymentButton.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRazorpay } from '@/hooks/useRazorpay';

interface PaymentButtonProps {
  bookingId: string;
  bookingNumber: string;
  amount: number;
  disabled?: boolean;
}

export default function PaymentButton({
  bookingId,
  bookingNumber,
  amount,
  disabled
}: PaymentButtonProps) {
  const router = useRouter();
  const { initializePayment, isProcessing, error } = useRazorpay();
  const [showSuccess, setShowSuccess] = useState(false);

  const handlePayment = () => {
    initializePayment(
      bookingId,
      // On Success
      (response) => {
        console.log('Payment successful:', response);
        setShowSuccess(true);

        // Redirect to success page after 2 seconds
        setTimeout(() => {
          router.push(`/bookings/${bookingNumber}/payment-success`);
        }, 2000);
      },
      // On Error
      (error) => {
        console.error('Payment failed:', error);
        alert('Payment failed. Please try again.');
      }
    );
  };

  return (
    <div className="space-y-4">
      <button
        onClick={handlePayment}
        disabled={disabled || isProcessing}
        className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white py-4 px-6 rounded-lg font-semibold text-lg transition-colors"
      >
        {isProcessing ? (
          <div className="flex items-center justify-center gap-2">
            <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
            Processing...
          </div>
        ) : (
          `Pay ₹${amount.toLocaleString('en-IN')}`
        )}
      </button>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
          ⚠️ {error}
        </div>
      )}

      {showSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-sm">
          ✅ Payment successful! Redirecting...
        </div>
      )}

      {/* Payment Methods Info */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p className="text-sm font-medium text-gray-700 mb-2">We accept:</p>
        <div className="flex flex-wrap gap-2 text-xs text-gray-600">
          <span className="px-2 py-1 bg-white rounded border">💳 Cards</span>
          <span className="px-2 py-1 bg-white rounded border">📱 UPI</span>
          <span className="px-2 py-1 bg-white rounded border">🏦 Net Banking</span>
          <span className="px-2 py-1 bg-white rounded border">💰 Wallets</span>
        </div>
      </div>
    </div>
  );
}
```

### Step 4: Booking Confirmation Page

```tsx
// frontend/src/app/bookings/[bookingNumber]/confirm/page.tsx
import PaymentButton from '@/components/PaymentButton';

export default async function BookingConfirmPage({
  params
}: {
  params: { bookingNumber: string }
}) {
  // Fetch booking details
  const booking = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/bookings/${params.bookingNumber}/`,
    { cache: 'no-store' }
  ).then(res => res.json());

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h1 className="text-2xl font-bold mb-4">Confirm Your Booking</h1>

        {/* Booking Details */}
        <div className="space-y-4 mb-6">
          <div className="flex justify-between">
            <span className="text-gray-600">Booking Reference</span>
            <span className="font-semibold">#{booking.booking_number}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Guest Name</span>
            <span className="font-semibold">{booking.guest_name}</span>
          </div>
          <div className="border-t pt-4 flex justify-between text-lg">
            <span className="font-semibold">Total Amount</span>
            <span className="font-bold text-emerald-600">
              ₹{booking.total_amount.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Payment Button */}
        <PaymentButton
          bookingId={booking.booking_id}
          bookingNumber={booking.booking_number}
          amount={booking.total_amount}
        />

        {/* Secure Payment Badge */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <span className="inline-flex items-center gap-1">
            🔒 Secure payment powered by Razorpay
          </span>
        </div>
      </div>
    </div>
  );
}
```

### Step 5: Payment Success Page

```tsx
// frontend/src/app/bookings/[bookingNumber]/payment-success/page.tsx
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default async function PaymentSuccessPage({
  params
}: {
  params: { bookingNumber: string }
}) {
  // Fetch payment status
  const paymentStatus = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/payments/status/${params.bookingNumber}/`,
    { cache: 'no-store' }
  ).then(res => res.json());

  const payment = paymentStatus.payment;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Success Animation */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-16 h-16 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Payment Successful!
          </h1>
          <p className="text-gray-600">
            Your booking has been confirmed
          </p>
        </div>

        {/* Payment Details Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="font-bold text-lg mb-4">Payment Details</h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Transaction ID</span>
              <span className="font-mono">{payment.gateway_payment_id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Amount Paid</span>
              <span className="font-semibold">₹{payment.amount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Payment Method</span>
              <span className="font-semibold capitalize">
                {payment.payment_method_display || payment.payment_method_type}
              </span>
            </div>
            {payment.upi_id && (
              <div className="flex justify-between">
                <span className="text-gray-600">UPI ID</span>
                <span className="font-mono text-xs">{payment.upi_id}</span>
              </div>
            )}
            {payment.card_last_4 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Card</span>
                <span>**** **** **** {payment.card_last_4}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">Status</span>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                ✓ Completed
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Link
            href={`/bookings/${params.bookingNumber}`}
            className="bg-emerald-600 text-white text-center py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
          >
            View Booking Details
          </Link>
          <Link
            href="/dashboard/bookings"
            className="border text-center py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Go to My Bookings
          </Link>
          <Link
            href="/"
            className="text-center text-gray-600 py-3"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
```

---

## 🔐 Security Best Practices

### 1. Signature Verification (Already Implemented in Backend)

```python
# Backend automatically verifies signatures
def verify_payment(razorpay_order_id, razorpay_payment_id, razorpay_signature):
    generated_signature = hmac.new(
        RAZORPAY_KEY_SECRET.encode('utf-8'),
        f"{razorpay_order_id}|{razorpay_payment_id}".encode('utf-8'),
        hashlib.sha256
    ).hexdigest()

    return hmac.compare_digest(generated_signature, razorpay_signature)
```

### 2. Never Expose Secret Key

❌ **Don't do this:**
```javascript
const razorpay_secret = "your_secret_key"; // NEVER in frontend!
```

✅ **Do this:**
```javascript
// Frontend only uses public key
const razorpay_key = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
```

### 3. Verify Payment on Server

Always verify payment on the backend before updating booking status.

---

## 🧪 Testing

### Test Mode Credentials

Razorpay provides test credentials:
- **Test Mode:** Use test API keys from Razorpay Dashboard
- **Test Cards:** `4111 1111 1111 1111` (Any CVV, future expiry)
- **Test UPI:** Use any UPI ID, select "Success" in test mode

### Test Different Payment Methods

```typescript
// In development, Razorpay will show test payment options
// You can test:
// - UPI: user@paytm, user@oksbi (auto-success)
// - Cards: 4111 1111 1111 1111
// - Net Banking: Select any bank → Success
// - Wallets: Select any wallet → Success
```

---

## 📊 Payment Flow Diagram

```
User clicks "Pay Now"
       ↓
Frontend calls /api/payments/create-order/
       ↓
Backend creates Razorpay order
       ↓
Returns order_id + key to frontend
       ↓
Frontend opens Razorpay checkout modal
       ↓
User selects payment method:
  - UPI (PhonePe, GPay, etc.)
  - Card (Debit/Credit)
  - Net Banking
  - Wallet (Paytm, etc.)
       ↓
User completes payment
       ↓
Razorpay returns payment details
       ↓
Frontend calls /api/payments/verify/
       ↓
Backend verifies signature
       ↓
Updates booking status to "confirmed"
       ↓
Sends confirmation email
       ↓
User sees success page
```

---

## 🎨 UI/UX Best Practices

### 1. Show All Payment Methods

```tsx
<div className="payment-methods">
  <h3>Pay Using:</h3>
  <div className="grid grid-cols-2 gap-3">
    <div className="method-card">
      <span>📱 UPI</span>
      <small>PhonePe, GPay, Paytm</small>
    </div>
    <div className="method-card">
      <span>💳 Cards</span>
      <small>Debit/Credit Cards</small>
    </div>
    <div className="method-card">
      <span>🏦 Net Banking</span>
      <small>All Banks</small>
    </div>
    <div className="method-card">
      <span>💰 Wallets</span>
      <small>Paytm, PhonePe, etc.</small>
    </div>
  </div>
</div>
```

### 2. Loading States

```tsx
{isProcessing && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg">
      <div className="animate-spin h-12 w-12 border-4 border-emerald-600 border-t-transparent rounded-full mb-4"></div>
      <p>Processing payment...</p>
    </div>
  </div>
)}
```

### 3. Error Handling

```tsx
{error && (
  <div className="alert alert-error">
    <AlertCircle className="w-5 h-5" />
    <div>
      <strong>Payment Failed</strong>
      <p>{error}</p>
    </div>
    <button onClick={retryPayment}>Retry</button>
  </div>
)}
```

---

## 🌍 Environment Variables

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_key_id
```

### Backend (.env)

```env
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_secret_key
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
FRONTEND_URL=http://localhost:3000
```

---

## 📱 Mobile Optimization

Razorpay automatically:
- ✅ Detects UPI apps installed on mobile
- ✅ Shows "Pay with PhonePe/GPay" buttons
- ✅ Redirects to UPI apps for seamless payment
- ✅ Falls back to QR code if no apps found

---

## 🚀 Going Live

### 1. Switch to Live Mode

```env
# Update to live credentials
RAZORPAY_KEY_ID=rzp_live_your_key_id
RAZORPAY_KEY_SECRET=your_live_secret_key
```

### 2. Configure Webhooks

In Razorpay Dashboard:
1. Go to Settings → Webhooks
2. Add webhook URL: `https://yourdomain.com/api/payments/webhook/`
3. Select events: `payment.captured`, `payment.failed`, `refund.created`
4. Copy webhook secret to `.env`

### 3. Test in Production

Test with small amounts before going fully live.

---

## 📞 Support & Troubleshooting

### Common Issues

**1. "Razorpay is not defined"**
- Make sure script is loaded in layout
- Check browser console for script loading errors

**2. "Invalid signature"**
- Verify webhook secret is correct
- Check if keys match (test mode vs live mode)

**3. Payment stuck in "Processing"**
- Check webhook is configured
- Verify webhook endpoint is accessible
- Check backend logs for errors

---

**Documentation Complete! 🎉**

All payment methods (UPI, Cards, Net Banking, Wallets) are fully integrated and ready to use.
