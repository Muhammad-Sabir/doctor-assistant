from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from user_agents import parse


def is_pc_request(request):
	user_agent = request.META.get('HTTP_USER_AGENT', '')
	user_agent_parsed = parse(user_agent)
	return user_agent_parsed.is_pc

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

def generate_otp_code(user):
	from apps.accounts.models import OTP
	otp = OTP.objects.create(user=user)
	otp_code = otp.generate_otp()
	otp.otp_code = otp_code
	otp.save()
	return otp_code

def normalize_phone_number(phone_number):
    return f'+92{phone_number[1:]}' if phone_number.startswith('03') else phone_number
