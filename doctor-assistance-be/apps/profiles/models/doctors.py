from django.db import models
from django.db.models import Avg, Count
from django.contrib.auth import get_user_model

from apps.core.models import BaseFileUpload
from apps.facilities.models import Hospital
from apps.profiles.managers import DoctorProfileManager

User = get_user_model()


class Speciality(models.Model):
    name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.name


class Degree(models.Model):
    name = models.CharField(max_length=255, unique=True)
    
    def __str__(self):
        return self.name


class Disease(models.Model):
    name = models.CharField(max_length=255, unique=True)
    
    def __str__(self):
        return self.name


class DoctorProfile(BaseFileUpload):
    user = models.OneToOneField(User, on_delete=models.CASCADE, blank=True, null=True, related_name='doctor')
    name = models.CharField(max_length=255)
    date_of_birth = models.DateField(blank=True, null=True)
    date_of_experience = models.DateField(blank=True)
    pmdc_no = models.CharField(max_length=255, unique=True)
    gender = models.CharField(max_length=1, choices=[('M', 'Male'), ('F', 'Female')])

    hospitals = models.ManyToManyField(Hospital, related_name='doctors')
    specialities = models.ManyToManyField('Speciality', related_name='doctors')
    degrees = models.ManyToManyField('Degree', related_name='doctors')
    diseases = models.ManyToManyField('Disease', related_name='doctors')

    objects = DoctorProfileManager()
    
    def __str__(self):
        return self.name
