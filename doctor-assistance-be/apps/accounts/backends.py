from django.contrib.auth.backends import BaseBackend
from django.contrib.auth import get_user_model
from django.db.models import Q
from django.core.exceptions import ValidationError

from apps.accounts.utils import normalize_phone_number
from apps.accounts.utils import create_uid_and_token
from apps.accounts.emails import send_verification_email

User = get_user_model()


class EmailOrPhoneNumberBackend(BaseBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        if not username:
            return None

        normalized_username = normalize_phone_number(username)

        user = User.objects.filter(
            Q(email=normalized_username) | Q(phone_number=normalized_username)
        ).first()

        if user and user.check_password(password):
            if not user.is_account_verified:
                uid, token = create_uid_and_token(user)
                send_verification_email(user, uid, token)
                raise ValidationError('Account is not verified.')
            return user
        
        return None

    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None
