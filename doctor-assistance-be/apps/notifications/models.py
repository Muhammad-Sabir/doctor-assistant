from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class NotificationType(models.TextChoices):
    APPOINTMENT = 'appointment', 'Appointment'
    CONSULTATION = 'consultation', 'Consultation'


class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notifications")
    message = models.TextField()
    notification_type = models.CharField(
        max_length=15,
        choices=NotificationType.choices,
        default=NotificationType.APPOINTMENT
    )
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.email} - {self.notification_type}: {self.message[:20]}..."
