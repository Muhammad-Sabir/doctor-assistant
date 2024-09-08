from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str


def create_uid_and_token(user):
	token = PasswordResetTokenGenerator().make_token(user=user)
	uid = urlsafe_base64_encode(force_bytes(user.id))
	return uid, token

def get_user_from_uid(uid):
	User = get_user_model()
	uid = force_str(urlsafe_base64_decode(uid))
	return User.objects.get(pk=uid)
	
def check_token(user, token):
	return PasswordResetTokenGenerator().check_token(user, token)

def normalize_phone_number(phone_number):
        return f'+92{phone_number[1:]}' if phone_number.startswith('03') else phone_number
