from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

from apps.profiles.models import DoctorProfile, PatientProfile
from apps.core.models import TimeStampedModel

class Review(TimeStampedModel):
    doctor = models.ForeignKey(DoctorProfile, on_delete=models.CASCADE, related_name='reviews')
    patient = models.ForeignKey(PatientProfile, on_delete=models.CASCADE, related_name='reviews')
    comment = models.TextField(blank=True)
    rating = models.PositiveIntegerField(
        null=True, 
        blank=True,
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )

    class Meta:
        unique_together= ['doctor', 'patient']
