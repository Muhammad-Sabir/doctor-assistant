from django.urls import path
from rest_framework_simplejwt.views import (
    TokenRefreshView,
    TokenBlacklistView,
)

from apps.accounts.views import (
    UserRegistration, 
    UserPasswordUpdation, 
    PasswordResetEmail,
    PasswordResetConfirm,
    SendVerificationEmail,
    VerifyAccount,
    RoleBasedObtainPairView,
    OTPGenerationView,
    VerifyOTPView
)

urlpatterns = [
    path('register/', UserRegistration.as_view()),
    path('login/', RoleBasedObtainPairView.as_view()),
    path('logout/', TokenBlacklistView.as_view()),
    path('token/refresh/', TokenRefreshView.as_view()),
    path('change-password/', UserPasswordUpdation.as_view()),
    path('send-reset-password/', PasswordResetEmail.as_view()),
    path('reset-password-confirm/<uid>/<token>', PasswordResetConfirm.as_view()),
    path('send-verify-email/', SendVerificationEmail.as_view()),
    path('verify-account/<uid>/<token>', VerifyAccount.as_view()),
    path('send-otp/', OTPGenerationView.as_view()),
    path('verify-otp/', VerifyOTPView.as_view()),
]
