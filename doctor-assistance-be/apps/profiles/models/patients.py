from django.db import models
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.utils import timezone

from apps.core.models import TimeStampedModel
from apps.profiles.models import DoctorProfile

User = get_user_model()


class PatientProfile(TimeStampedModel):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE, 
        related_name="patient", 
        null=True, 
        blank=True
    )
    name = models.CharField(max_length=255)
    date_of_birth = models.DateField()
    gender = models.CharField(max_length=1, choices=[('M', 'Male'), ('F', 'Female')])
    primary_patient = models.ForeignKey(
        'self', 
        null=True,
        blank=True, 
        on_delete=models.SET_NULL, 
        related_name='dependents'
    )

    def clean(self):
        if self.date_of_birth >= timezone.now().date():
            raise ValidationError("Date of birth must be in the past.")
        
        if self.primary_patient and self.user:
            raise ValidationError("Dependents cannot have a user assigned.")

    def __str__(self):
        return self.name


class Allergy(models.Model):
    name = models.CharField(max_length=255, unique=True)
    
    def __str__(self):
        return self.name


class PatientAllergy(TimeStampedModel):
    allergy = models.ForeignKey(Allergy, on_delete=models.CASCADE)
    patient = models.ForeignKey(PatientProfile, on_delete=models.CASCADE)
    updated_by = models.ForeignKey(DoctorProfile, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('allergy', 'patient') 

    def __str__(self):
        return f"{self.allergy.name} - {self.patient.name}"
