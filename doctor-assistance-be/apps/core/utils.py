from decouple import config
from django.core.mail import EmailMessage


def send_email(data):
	email = EmailMessage(
	  subject=data['subject'],
	  body=data['body'],
	  from_email=config('EMAIL_USER'),
	  to=data['to_email']
	)
	email.send()
