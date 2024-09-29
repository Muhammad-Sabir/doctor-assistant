from decouple import config
from django.core.mail import EmailMessage
from django.http import QueryDict

def send_email(data):
	email = EmailMessage(
	  subject=data['subject'],
	  body=data['body'],
	  from_email=config('EMAIL_USER'),
	  to=data['to_email']
	)
	email.send()

def update_or_create_related_fields(instance, initial_data, related_fields):
	"""
	Helper function to update or create ManyToMany fields dynamically.

	Args:
		instance: The instance of the model being updated.
		initial_data: The initial data to be set, containing the M2M field IDs.
		related_fields: A dictionary where keys are field names and values are model classes.

	Returns:
		None
	"""
	mutable_initial_data = initial_data.copy() if isinstance(initial_data, QueryDict) else initial_data
	for field_name, model in related_fields.items():
		if field_name in mutable_initial_data:
			ids = mutable_initial_data.pop(field_name, [])
			current_ids = set(getattr(instance, field_name).values_list('id', flat=True))

			if set(ids) != current_ids:
				related_objects = model.objects.filter(id__in=ids)
				getattr(instance, field_name).set(related_objects)
