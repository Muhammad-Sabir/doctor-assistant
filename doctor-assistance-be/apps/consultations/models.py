from django.db import models

from apps.core.models import TimeStampedModel
from apps.profiles.models import PatientProfile, DoctorProfile


class Consultation(TimeStampedModel):
    doctor = models.ForeignKey(DoctorProfile, on_delete=models.CASCADE, related_name='consultations')
    patient = models.ForeignKey(PatientProfile, on_delete=models.CASCADE, related_name='consultations')
    title = models.CharField(max_length=255)


class Transcription(TimeStampedModel):
    consultation = models.OneToOneField(Consultation, on_delete=models.CASCADE, related_name='transcription')
    transcription_text = models.TextField()


class SOAPNotes(TimeStampedModel):
    consultation = models.OneToOneField(Consultation, on_delete=models.CASCADE, related_name='soap_note')
    description = models.TextField(blank=True, null=True)


class Prescription(TimeStampedModel):
    consultation = models.OneToOneField(Consultation, on_delete=models.CASCADE, related_name='prescription')
    medicines = models.JSONField(default=list)  # Will store list of medicine objects
    additional_info = models.TextField(blank=True, null=True)
