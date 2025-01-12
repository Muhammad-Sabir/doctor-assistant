from django.dispatch import receiver
from django.db.models.signals import post_save

from apps.consultations.models import Consultation
from apps.notifications.models import Notification, NotificationType


def consultation_notification(sender, instance, created, **kwargs):
    if created:
        patient = instance.appointment.patient
        patient_user = patient.user if patient.user else patient.primary_patient.user
        doctor_name = instance.appointment.doctor.name
        Notification.objects.create(
            user=patient_user,
            message=f"Your consultation '{instance.title}' has been created by Dr. {doctor_name}.",
            notification_type=NotificationType.CONSULTATION
        )


post_save.connect(consultation_notification, sender=Consultation)
