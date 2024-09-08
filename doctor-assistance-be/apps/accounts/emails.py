from decouple import config

from apps.core.utils import send_email


def send_verification_email(user, uid, token):
    verification_url = f"{config('CLIENT_URL')}/verify-account/{uid}/{token}"
    body = f"Click the link to verify your account:\n{verification_url}"
    data = {
        'subject': 'Verify Your Account',
        'body': body,
        'to_email': [user.email]
    }
    send_email(data)

def send_password_reset_email(user, uid, token):
    reset_url = f"{config('CLIENT_URL')}/{uid}/{token}"
    body = f"Click the following link to reset your password:\n{reset_url}"
    data = {
        'subject': 'Reset Your Password',
        'body': body,
        'to_email': [user.email]
    }
    send_email(data)
