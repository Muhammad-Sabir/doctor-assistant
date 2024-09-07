from django.contrib.auth.models import BaseUserManager

from apps.accounts.utils import normalize_phone_number


class UserManager(BaseUserManager):
    def create(self, password, username=None, email=None, phone_number=None, **extra_fields):
        return self.create_user(
            email=email,
            phone_number=phone_number,
            password=password,
            username=username,
            **extra_fields
        )

    def create_user(self, password, username=None, email=None, phone_number=None, **extra_fields):
        if not email and not phone_number:
            raise ValueError('The Email or Phone Number must be set')

        if phone_number:
            phone_number = normalize_phone_number(phone_number)

        email = self.normalize_email(email)
        user = self.model(
            email=email,
            phone_number=phone_number,
            username=username or email or phone_number,
            **extra_fields,
        )

        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, password, username=None, email=None, phone_number=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_account_verified', True)

        return self.create_user(
            email=email or username,
            phone_number=phone_number,
            password=password,
            username=username,
            **extra_fields
        )
