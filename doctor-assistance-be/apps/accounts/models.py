import random

from django.db import models
from django.core.validators import RegexValidator
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.utils import timezone

from apps.accounts.managers import UserManager
from apps.core.models import TimeStampedModel


class UserRole(models.TextChoices):
        DOCTOR = 'doctor', 'Doctor'
        PATIENT = 'patient', 'Patient'


class User(AbstractBaseUser, PermissionsMixin, TimeStampedModel):    
    username = models.CharField(max_length=255, unique=True, blank=True, null=True)
    email = models.EmailField(unique=True, blank=True, null=True)
    phone_number = models.CharField(
        max_length=15,
        unique=True,
        blank=True,
        null=True,
        validators=[
            RegexValidator(
                regex=r'^(\+92|0)3\d{9}$',
                message=(
                    "Phone number must be entered in the format: "
                    "'+923039916210' or '03039916210'."
                )
            ),
        ]
    )
    is_staff = models.BooleanField(default=False)
    is_account_verified = models.BooleanField(default=False)
    is_profile_completed = models.BooleanField(default=False)  
    role = models.CharField(
        max_length=7,
        choices=UserRole.choices,
        default=UserRole.PATIENT,
    )

    objects = UserManager()

    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email or self.phone_number


class OTP(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    otp_code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)

    def is_valid(self):
        return (self.created_at >= timezone.now() - timezone.timedelta(minutes=5))

    def generate_otp(self):
        return random.randint(100000, 999999)
