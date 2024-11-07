from django.dispatch import receiver
from django.db.models.signals import post_save

from apps.consultations.models import Consultation
from apps.notifications.models import Notification, NotificationType


def appointment_notification(sender, instance, created, **kwargs):
    if created:
        patient_user = instance.patient.user
        Notification.objects.create(
            user=patient_user,
            message=f"Your consultation {instance.title} has been created by {instance.doctor.name}.",
            notification_type=NotificationType.CONSULTATION
        )

post_save.connect(appointment_notification, sender=Consultation)
