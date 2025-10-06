from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import OTPRequestView, OTPVerifyView, MeView


urlpatterns = [
    # OTP flows
    path('otp/request/', OTPRequestView.as_view(), name='otp-request'),
    path('otp/verify/', OTPVerifyView.as_view(), name='otp-verify'),

    # JWT
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Me
    path('me/', MeView.as_view(), name='me'),
]


