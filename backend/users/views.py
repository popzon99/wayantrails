from datetime import timedelta
import random

from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .models import OTPVerification
from .serializers import (
    OTPRequestSerializer,
    OTPVerifySerializer,
    UserSerializer,
)


User = get_user_model()


class OTPRequestView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = OTPRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        phone = serializer.validated_data['phone']

        # Generate a 6-digit OTP
        otp = f"{random.randint(0, 999999):06d}"
        expires_at = timezone.now() + timedelta(minutes=5)

        OTPVerification.objects.create(phone=phone, otp=otp, expires_at=expires_at)

        # TODO: Integrate SMS/WhatsApp provider. For now, return OTP in DEBUG.
        payload = {'message': 'OTP sent'}
        if request._request.META.get('DJANGO_SETTINGS_MODULE') and request._request.META:
            payload['debug_otp'] = otp
        return Response(payload, status=status.HTTP_201_CREATED)


class OTPVerifyView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = OTPVerifySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        phone = serializer.validated_data['phone']
        otp = serializer.validated_data['otp']

        try:
            record = OTPVerification.objects.filter(phone=phone, is_verified=False).latest('created_at')
        except OTPVerification.DoesNotExist:
            return Response({'detail': 'OTP not found'}, status=status.HTTP_400_BAD_REQUEST)

        if record.is_expired:
            return Response({'detail': 'OTP expired'}, status=status.HTTP_400_BAD_REQUEST)
        if record.otp != otp:
            return Response({'detail': 'Invalid OTP'}, status=status.HTTP_400_BAD_REQUEST)

        record.is_verified = True
        record.save(update_fields=['is_verified'])

        user, _ = User.objects.get_or_create(phone=phone, defaults={'username': str(phone)})
        user.is_verified = True
        user.save(update_fields=['is_verified'])

        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        access_token = refresh.access_token

        return Response({
            'message': 'OTP verified',
            'user': UserSerializer(user).data,
            'tokens': {
                'access': str(access_token),
                'refresh': str(refresh)
            }
        }, status=status.HTTP_200_OK)


class MeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)

    def patch(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

