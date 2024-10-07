from rest_framework import permissions


class IsDoctorOrPatientOfAppointment(permissions.BasePermission):
    """
    Custom permission to allow only the doctor or the patient associated with the appointment to update it.
    """
    def has_object_permission(self, request, view, obj):
        user = request.user

        if hasattr(user, 'doctor') and obj.doctor == user.doctor:
            return True

        if hasattr(user, 'patient'):
            if obj.patient == user.patient or obj.patient in user.patient.dependents.all():
                return True

        return False
