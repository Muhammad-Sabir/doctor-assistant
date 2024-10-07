from django.db import models

from apps.core.models import TimeStampedModel
from apps.profiles.models import PatientProfile, DoctorProfile


class Consultation(TimeStampedModel):
    doctor = models.ForeignKey(DoctorProfile, on_delete=models.CASCADE, related_name='consultations')
    patient = models.ForeignKey(PatientProfile, on_delete=models.CASCADE, related_name='consultations')
    title = models.CharField(max_length=255)


class SOAPNotes(TimeStampedModel):
    consultation = models.ForeignKey(Consultation, on_delete=models.CASCADE, related_name='soap_notes')
    subject = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)


class Prescription(TimeStampedModel):
    consultation = models.ForeignKey(Consultation, on_delete=models.CASCADE, related_name='prescriptions')
    medicine_name = models.CharField(max_length=255)
    instruction = models.TextField(blank=True, null=True)
