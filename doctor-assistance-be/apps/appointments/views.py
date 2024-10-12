from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend

from apps.profiles.permissions import IsPatient
from apps.appointments.permissions import IsDoctorOrPatientOfAppointment
from apps.appointments.models import Appointment
from apps.appointments.serializers import AppointmentSerializer
from apps.appointments.filters import AppointmentFilter


class AppointmentViewSet(ModelViewSet):
    serializer_class = AppointmentSerializer
    queryset = Appointment.objects.all()
    filter_backends = [DjangoFilterBackend]
    filterset_class = AppointmentFilter

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsPatient()]
        elif self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [IsDoctorOrPatientOfAppointment()]
        
        return [IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'doctor'):
            return self._get_doctor_appointments(user)
        elif hasattr(user, 'patient'):
            return self._get_patient_appointments(user)
        return Appointment.objects.none()

    def _get_doctor_appointments(self, user):
        return (Appointment.objects
                .filter(doctor=user.doctor)
                .select_related('doctor', 'patient'))

    def _get_patient_appointments(self, user):
        dependents = user.patient.dependents.all()
        return (Appointment.objects
                .filter(patient__in=[user.patient] + list(dependents))
                .select_related('doctor', 'patient'))
