from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id',
            'phone',
            'username',
            'first_name',
            'last_name',
            'email',
            'avatar',
            'date_of_birth',
            'nationality',
            'preferred_language',
            'marketing_emails',
            'whatsapp_notifications',
            'is_verified',
        ]
        read_only_fields = ['id', 'phone', 'username', 'is_verified']


class OTPRequestSerializer(serializers.Serializer):
    phone = serializers.CharField(max_length=20)


class OTPVerifySerializer(serializers.Serializer):
    phone = serializers.CharField(max_length=20)
    otp = serializers.CharField(max_length=6)


