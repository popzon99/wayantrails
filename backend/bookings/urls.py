from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BookingViewSet
from .payment_views import (
    PaymentViewSet,
    create_payment_order,
    verify_payment,
    payment_webhook,
    create_refund,
    get_payment_methods,
    get_payment_status,
)

router = DefaultRouter()
router.register(r'bookings', BookingViewSet, basename='booking')
router.register(r'payments', PaymentViewSet, basename='payment')

urlpatterns = [
    path('', include(router.urls)),

    # Payment endpoints
    path('payments/create-order/', create_payment_order, name='payment-create-order'),
    path('payments/verify/', verify_payment, name='payment-verify'),
    path('payments/webhook/', payment_webhook, name='payment-webhook'),
    path('payments/refund/', create_refund, name='payment-refund'),
    path('payments/methods/', get_payment_methods, name='payment-methods'),
    path('payments/status/<str:booking_number>/', get_payment_status, name='payment-status'),
]