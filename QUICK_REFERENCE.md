# 🚀 WayanTrails Payment System - Quick Reference

## ⚡ Quick Setup (5 Minutes)

```bash
# 1. Install dependencies
cd backend
pip install razorpay==1.4.1

# 2. Add to .env
echo "RAZORPAY_KEY_ID=rzp_test_your_key" >> .env
echo "RAZORPAY_KEY_SECRET=your_secret" >> .env
echo "FRONTEND_URL=http://localhost:3000" >> .env

# 3. Run migrations
python manage.py makemigrations bookings
python manage.py migrate

# 4. Test
python test_payment_integration.py

# 5. Start server
python manage.py runserver
```

---

## 💳 Supported Payment Methods

| Method | Apps/Cards | Status |
|--------|-----------|--------|
| 📱 **UPI** | PhonePe, GPay, Paytm, BHIM | ✅ Ready |
| 💳 **Cards** | Visa, MC, RuPay, Amex | ✅ Ready |
| 🏦 **Net Banking** | All Banks | ✅ Ready |
| 💰 **Wallets** | Paytm, PhonePe, Mobikwik | ✅ Ready |
| 📊 **EMI** | No-cost & Standard | ✅ Ready |

---

## 📡 API Endpoints

### Create Payment
```bash
POST /api/payments/create-order/
Body: {"booking_id": "uuid", "payment_type": "order"}
```

### Verify Payment
```bash
POST /api/payments/verify/
Body: {
  "razorpay_order_id": "order_xxx",
  "razorpay_payment_id": "pay_xxx",
  "razorpay_signature": "sig_xxx"
}
```

### Payment Methods
```bash
GET /api/payments/methods/
```

### Payment Status
```bash
GET /api/payments/status/{booking_number}/
```

---

## 🧪 Test Credentials

### Test Card
```
Number: 4111 1111 1111 1111
Expiry: 12/25 (any future date)
CVV: 123 (any 3 digits)
```

### Test UPI
```
success@razorpay  → Auto Success
failure@razorpay  → Auto Fail
```

---

## 🔧 Frontend Integration

### 1. Add Script
```html
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
```

### 2. Use Hook
```tsx
import { useRazorpay } from '@/hooks/useRazorpay';

const { initializePayment } = useRazorpay();

initializePayment(
  bookingId,
  (response) => console.log('Success!'),
  (error) => console.log('Failed!')
);
```

**Full guide:** `docs/PAYMENT_INTEGRATION_GUIDE.md`

---

## 📂 Important Files

| File | Purpose |
|------|---------|
| `IMPLEMENTATION_COMPLETE.md` | 📋 Overview |
| `PAYMENT_SYSTEM_SUMMARY.md` | 💳 Payment details |
| `docs/PAYMENT_INTEGRATION_GUIDE.md` | 🔌 Frontend guide |
| `docs/BOOKING_SYSTEM.md` | 📚 Full docs |
| `backend/test_payment_integration.py` | 🧪 Test script |

---

## 🔐 Security Checklist

- [x] Signature verification enabled
- [x] Webhook validation enabled
- [x] Secrets in environment variables
- [x] HTTPS required in production
- [x] User authorization checks
- [x] Amount tampering prevention

---

## 🐛 Troubleshooting

**"Razorpay is not defined"**
→ Add script to layout/head

**"Invalid signature"**
→ Check webhook secret matches

**"Payment stuck"**
→ Verify webhook is configured

**Need help?**
→ Check `docs/PAYMENT_INTEGRATION_GUIDE.md`

---

## 📞 Get Razorpay Credentials

1. Sign up: https://razorpay.com/
2. Dashboard → Settings → API Keys
3. Generate Test Keys
4. Copy to `.env` file

---

## ✅ Pre-Launch Checklist

- [ ] Razorpay account created & verified
- [ ] Test credentials added to `.env`
- [ ] Migrations run successfully
- [ ] Test payment completed
- [ ] Email notifications working
- [ ] Frontend integrated
- [ ] Webhooks configured
- [ ] Production keys ready

---

## 🎯 Payment Flow (Simplified)

```
Click Pay → Create Order → Open Razorpay
→ User Pays → Verify → Update Booking → Success!
```

---

## 💡 Quick Tips

✅ **Use test mode** during development
✅ **Test all payment methods** before going live
✅ **Configure webhooks** for production
✅ **Monitor dashboard** for failed payments
✅ **Enable 2FA** on Razorpay account

---

**Built for WayanTrails 🌴**

Ready to accept payments! 🚀
