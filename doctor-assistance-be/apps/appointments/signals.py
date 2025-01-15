from django.dispatch import receiver
from django.db.models.signals import post_save

from apps.appointments.models import Appointment, AppointmentStatus
from apps.notifications.models import Notification, NotificationType
from apps.communications.utils import send_contact_update


def appointment_notification(sender, instance, created, **kwargs):
    if created:
        doctor_user = instance.doctor.user
        if doctor_user:
            Notification.objects.create(
                user=doctor_user,
                message=f"New appointment created by {instance.patient.name} on {instance.date_of_appointment}.",
                notification_type=NotificationType.APPOINTMENT
            )
    else:
        if instance.status in [AppointmentStatus.APPROVED, AppointmentStatus.REJECTED]:
            patient = instance.patient
            patient_user = patient.user if patient.user else patient.primary_patient.user
            status_message = "approved" if instance.status == AppointmentStatus.APPROVED else "rejected"
            Notification.objects.create(
                user=patient_user,
                message=f"Your appointment on {instance.date_of_appointment} is now {instance.status} by {instance.doctor.name}",
                notification_type=NotificationType.APPOINTMENT
            )
            if instance.status == AppointmentStatus.APPROVED:
                send_contact_update(
                    user_id=patient_user.id,
                    doctor_id=instance.doctor.id,
                    doctor_name=instance.doctor.name,
                    appointment_date=instance.date_of_appointment
                )

        if instance.completed:  # New condition added
            patient = instance.patient
            patient_user = patient.user if patient.user else patient.primary_patient.user
            Notification.objects.create(
                user=patient_user,
                message=f"Your appointment on {instance.date_of_appointment} with Dr. {instance.doctor.name} has been completed.",
                notification_type=NotificationType.APPOINTMENT
            )

post_save.connect(appointment_notification, sender=Appointment)
