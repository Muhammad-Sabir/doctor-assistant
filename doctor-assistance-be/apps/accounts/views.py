from django.contrib.auth import get_user_model
from rest_framework import generics
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from decouple import config

from apps.accounts.emails import send_password_reset_email, send_verification_email, send_otp_email
from apps.accounts.utils import (
    create_uid_and_token, 
    generate_otp_code,
    is_pc_request
)
from apps.accounts.models import OTP
from apps.accounts.serializers import (
    UserRegistrationSerializer,
    UserPasswordUpdationSerializer,
    VerifyEmailSerializer,
    PasswordResetConfirmSerializer,
    VerifyAccountSerializer,
    OTPVerifyAccountSerializer,
    RoleBasedTokenObtainPairSerializer,
)

User = get_user_model()


class UserRegistration(generics.CreateAPIView):
    serializer_class = UserRegistrationSerializer

    def perform_create(self, serializer):
        user = serializer.save()
        if not is_pc_request(self.request):
            self.send_otp_email(user)
        else:
            self.send_verification_email(user)

    def send_otp_email(self, user):
        otp_code = generate_otp_code(user)
        send_otp_email(user, otp_code)

    def send_verification_email(self, user):
        uid, token = create_uid_and_token(user)
        send_verification_email(user, uid, token)


class RoleBasedObtainPairView(TokenObtainPairView):
    serializer_class = RoleBasedTokenObtainPairSerializer

class UserPasswordUpdation(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserPasswordUpdationSerializer

    def get_object(self):
        return self.request.user
    
    
class PasswordResetEmail(generics.CreateAPIView):
    serializer_class = VerifyEmailSerializer

    def perform_create(self, serializer):
        user = User.objects.get(email=serializer.validated_data['email'])
        uid, token = create_uid_and_token(user)
        send_password_reset_email(user, uid, token)

    def create(self, request, *args, **kwargs):
        super().create(request, *args, **kwargs)
        return Response({'detail': 'Password reset link has been sent to your email.'}, status=status.HTTP_200_OK)


class PasswordResetConfirm(generics.CreateAPIView):
    serializer_class = PasswordResetConfirmSerializer

    def get_serializer_context(self):
        return {
            'uid': self.kwargs.get('uid'),
            'token': self.kwargs.get('token'),
        }


class SendVerificationEmail(generics.CreateAPIView):
    serializer_class = VerifyEmailSerializer
    
    def perform_create(self, serializer):
        user = User.objects.get(email=serializer.validated_data['email'])
        uid, token = create_uid_and_token(user)
        send_verification_email(user, uid, token)

    def create(self, request, *args, **kwargs):
        super().create(request, *args, **kwargs)
        return Response(
            {'detail': 'Password verification email has been sent to your email.'},
            status=status.HTTP_200_OK
        )


class VerifyAccount(generics.CreateAPIView):
    serializer_class = VerifyAccountSerializer

    def get_serializer_context(self):
        return {
            'uid': self.kwargs.get('uid'),
            'token': self.kwargs.get('token'),
        }

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        return Response({'detail': 'Account successfully verified.'}, status=status.HTTP_200_OK)


class OTPGenerationView(generics.CreateAPIView):
    serializer_class = VerifyEmailSerializer

    def perform_create(self, serializer):
        user = User.objects.get(email=serializer.validated_data['email'])
        otp_code = generate_otp_code(user)
        send_otp_email(user, otp_code)

    def create(self, request, *args, **kwargs):
        super().create(request, *args, **kwargs)
        return Response(
            {'detail': 'Password verification OTP code has been sent to your email.'},
            status=status.HTTP_200_OK
        )

class VerifyOTPView(generics.CreateAPIView):
    serializer_class = OTPVerifyAccountSerializer

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        return Response({'detail': 'Account successfully verified.'}, status=status.HTTP_200_OK)
