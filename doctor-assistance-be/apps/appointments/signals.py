from django.dispatch import receiver
from django.db.models.signals import post_save

from apps.appointments.models import Appointment, AppointmentStatus
from apps.notifications.models import Notification, NotificationType


def appointment_notification(sender, instance, created, **kwargs):
    if created:
        doctor_user = instance.doctor.user
        Notification.objects.create(
            user=doctor_user,
            message=f"New appointment created by {instance.patient.name} on {instance.date_of_appointment}.",
            notification_type=NotificationType.APPOINTMENT
        )
    else:
        if instance.status in [AppointmentStatus.APPROVED, AppointmentStatus.REJECTED]:
            patient_user = instance.patient.user
            status_message = "approved" if instance.status == AppointmentStatus.APPROVED else "rejected"
            Notification.objects.create(
                user=patient_user,
                message=f"Your appointment on {instance.date_of_appointment} is now {instance.status} by {instance.doctor.name}",
                notification_type=NotificationType.APPOINTMENT
            )

post_save.connect(appointment_notification, sender=Appointment)
