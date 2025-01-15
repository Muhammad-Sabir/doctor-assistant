from django.db import models

from apps.core.models import TimeStampedModel
from apps.appointments.models import Appointment


class Consultation(TimeStampedModel):
    appointment = models.OneToOneField(
        Appointment, on_delete=models.CASCADE, related_name='consultation', default=None)
    title = models.CharField(max_length=255)


class Transcription(TimeStampedModel):
    consultation = models.OneToOneField(
        Consultation, on_delete=models.CASCADE, related_name='transcription')
    transcription_text = models.TextField()


class SOAPNotes(TimeStampedModel):
    consultation = models.OneToOneField(
        Consultation, on_delete=models.CASCADE, related_name='soap_note')
    description = models.TextField(blank=True, null=True)


class Prescription(TimeStampedModel):
    consultation = models.OneToOneField(
        Consultation, on_delete=models.CASCADE, related_name='prescription')
    # Will store list of medicine objects
    medicines = models.JSONField(default=list)
    additional_info = models.TextField(blank=True, null=True)
