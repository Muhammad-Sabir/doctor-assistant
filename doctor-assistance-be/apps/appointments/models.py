from django.db import models
from django.core.exceptions import ValidationError
from django.utils import timezone
from datetime import datetime, date

from apps.profiles.models import DoctorProfile, PatientProfile
from apps.core.models import TimeStampedModel


class AppointmentStatus(models.TextChoices):
        PENDING = 'pending', 'Pending'
        APPROVED = 'approved', 'Approved'
        REJECTED = 'rejected', 'Rejected'


class AppointmentMode(models.TextChoices):
        ONLINE = 'online', 'Online'
        PHYSICAL = 'physical', 'Physical'


class TimeSlot(models.Model):
    start_time = models.TimeField()
    end_time = models.TimeField()
    duration = models.IntegerField(help_text="Duration in minutes")
    
    class Meta:
        ordering = ['start_time']

    def __str__(self):
        return f"{self.start_time.strftime('%H:%M')} - {self.end_time.strftime('%H:%M')}"

    def clean(self):
        if self.start_time >= self.end_time:
            raise ValidationError("Start time must be before end time")
        
        # Validate that duration matches time difference
        time_diff = datetime.combine(date.min, self.end_time) - datetime.combine(date.min, self.start_time)
        if time_diff.seconds // 60 != self.duration:
            raise ValidationError("Duration must match the time difference between start and end time")


class DoctorSchedule(TimeStampedModel):
    DAYS_OF_WEEK = [
        (0, 'Monday'),
        (1, 'Tuesday'),
        (2, 'Wednesday'),
        (3, 'Thursday'),
        (4, 'Friday'),
        (5, 'Saturday'),
        (6, 'Sunday'),
    ]

    doctor = models.ForeignKey('profiles.DoctorProfile', on_delete=models.CASCADE)
    hospital = models.ForeignKey('facilities.Hospital', on_delete=models.CASCADE)
    day_of_week = models.IntegerField(choices=DAYS_OF_WEEK)
    time_slots = models.ManyToManyField(TimeSlot)
    is_available = models.BooleanField(default=True)

    class Meta:
        unique_together = ['doctor', 'hospital', 'day_of_week']

    def __str__(self):
        return f"{self.doctor.name} - {self.hospital.name} - {self.get_day_of_week_display()}"


class DoctorDateOverride(TimeStampedModel):
    doctor = models.ForeignKey('profiles.DoctorProfile', on_delete=models.CASCADE)
    hospital = models.ForeignKey('facilities.Hospital', on_delete=models.CASCADE)
    date = models.DateField()
    time_slots = models.ManyToManyField(TimeSlot)
    is_available = models.BooleanField(default=True)
    reason = models.CharField(max_length=255, blank=True)

    class Meta:
        unique_together = ['doctor', 'hospital', 'date']

    def __str__(self):
        return f"{self.doctor.name} - {self.date}"


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
    time_slot = models.ForeignKey(
        TimeSlot,
        on_delete=models.CASCADE,
        related_name='appointments'
    )
    hospital = models.ForeignKey(
        'facilities.Hospital',
        on_delete=models.CASCADE,
        related_name='appointments'
    )
    completed = models.BooleanField(default=False)

    class Meta:
        unique_together = ['doctor', 'date_of_appointment', 'time_slot']

