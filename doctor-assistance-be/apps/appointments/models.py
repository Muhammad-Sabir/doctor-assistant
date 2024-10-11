from django.db import models
from django.core.exceptions import ValidationError
from django.utils import timezone

from apps.profiles.models import DoctorProfile, PatientProfile
from apps.core.models import TimeStampedModel


class AppointmentStatus(models.TextChoices):
        PENDING = 'pending', 'Pending'
        APPROVED = 'approved', 'Approved'
        REJECTED = 'rejected', 'Rejected'


class AppointmentMode(models.TextChoices):
        ONLINE = 'online', 'Online'
        PHYSICAL = 'physical', 'Physical'


class Appointment(TimeStampedModel):
    doctor = models.ForeignKey(DoctorProfile, on_delete=models.CASCADE, related_name='appointments')
    patient = models.ForeignKey(PatientProfile, on_delete=models.CASCADE, related_name='appointments')
    message = models.CharField(max_length=255)
    cancellation_reason = models.CharField(max_length=255, null=True, blank=True)
    date_of_appointment = models.DateField()
    status = models.CharField(
        max_length=8,
        choices=AppointmentStatus.choices,
        default=AppointmentStatus.PENDING,
    )
    appointment_mode = models.CharField(
        max_length=8,
        choices=AppointmentMode.choices,
        default=AppointmentMode.ONLINE,
    )
