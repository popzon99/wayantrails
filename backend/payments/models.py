"""
Payment models for WayanTrails platform.
Handles Razorpay, Stripe, and other payment gateways.
"""
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.contrib.auth import get_user_model
from core.models import TimeStampedModel

User = get_user_model()


class PaymentGateway(TimeStampedModel):
    """Payment gateway configurations."""

    GATEWAY_TYPES = [
        ('razorpay', 'Razorpay'),
        ('stripe', 'Stripe'),
        ('paypal', 'PayPal'),
        ('payu', 'PayU'),
    ]

    name = models.CharField(_('gateway name'), max_length=100)
    gateway_type = models.CharField(_('gateway type'), max_length=20, choices=GATEWAY_TYPES)

    # Configuration
    is_active = models.BooleanField(_('is active'), default=True)
    is_test_mode = models.BooleanField(_('test mode'), default=True)

    # Credentials (store encrypted)
    public_key = models.TextField(_('public key'), blank=True)
    secret_key = models.TextField(_('secret key'), blank=True)

    # Fees
    transaction_fee_percentage = models.DecimalField(_('transaction fee %'), max_digits=5, decimal_places=2, default=0)

    class Meta:
        db_table = 'payment_gateways'
        verbose_name = _('Payment Gateway')
        verbose_name_plural = _('Payment Gateways')

    def __str__(self):
        return self.name


class PaymentTransaction(TimeStampedModel):
    """Payment transaction records."""

    TRANSACTION_STATUS = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('success', 'Success'),
        ('failed', 'Failed'),
        ('cancelled', 'Cancelled'),
        ('refunded', 'Refunded'),
    ]

    # Transaction details
    transaction_id = models.CharField(_('transaction ID'), max_length=100, unique=True)
    gateway = models.ForeignKey(PaymentGateway, on_delete=models.PROTECT)

    # Payment details
    amount = models.DecimalField(_('amount'), max_digits=10, decimal_places=2)
    currency = models.CharField(_('currency'), max_length=3, default='INR')

    # Status
    status = models.CharField(_('status'), max_length=20, choices=TRANSACTION_STATUS, default='pending')

    # Gateway response
    gateway_transaction_id = models.CharField(_('gateway transaction ID'), max_length=200, blank=True)
    gateway_response = models.JSONField(_('gateway response'), default=dict, blank=True)

    class Meta:
        db_table = 'payment_transactions'
        verbose_name = _('Payment Transaction')
        verbose_name_plural = _('Payment Transactions')
        ordering = ['-created_at']

    def __str__(self):
        return f"Transaction {self.transaction_id} - ₹{self.amount}"
