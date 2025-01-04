from datetime import datetime

from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied

from apps.profiles.permissions import IsPatient, IsDoctor
from apps.facilities.models import Hospital
from apps.appointments.permissions import IsDoctorOrPatientOfAppointment
from apps.appointments.models import (
    Appointment,  
    DoctorSchedule, 
    DoctorDateOverride,
    AppointmentStatus
)
from apps.appointments.serializers import (
    AppointmentSerializer,
    TimeSlotSerializer,
    DoctorScheduleSerializer,
    DoctorDateOverrideSerializer
)
from apps.appointments.filters import AppointmentFilter, DoctorDateOverrideFilter


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

    @action(detail=False, methods=['get'])
    def available_slots(self, request):
        """Get available slots for a specific doctor and date, optionally filtered by hospital."""
        doctor_id = request.query_params.get('doctor_id')
        hospital_id = request.query_params.get('hospital_id')
        date_str = request.query_params.get('date')

        if not all([doctor_id, date_str]):
            return Response(
                {"error": "doctor_id and date are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            date = datetime.strptime(date_str, '%Y-%m-%d').date()
            day_of_week = date.weekday()
            print(date, day_of_week)
            hospitals_query = Hospital.objects.filter(doctors__id=doctor_id)
            
            if hospital_id:
                hospitals_query = hospitals_query.filter(id=hospital_id)

            hospitals_data = []
            
            for hospital in hospitals_query:
                override = DoctorDateOverride.objects.filter(
                    doctor_id=doctor_id,
                    hospital_id=hospital.id,
                    date=date,
                    is_available=True
                ).first()
                
                if override:
                    available_slots = override.time_slots.all()
                else:
                    schedule = DoctorSchedule.objects.filter(
                        doctor_id=doctor_id,
                        hospital_id=hospital.id,
                        day_of_week=day_of_week,
                        is_available=True
                    ).first()
                    
                    if not schedule:
                        available_slots = []
                    else:
                        available_slots = schedule.time_slots.all()
                
                if available_slots:
                    booked_slot_ids = Appointment.objects.filter(
                        doctor_id=doctor_id,
                        hospital_id=hospital.id,
                        date_of_appointment=date,
                        status=AppointmentStatus.APPROVED
                    ).values_list('time_slot_id', flat=True)
                    
                    available_slots = available_slots.exclude(id__in=booked_slot_ids)
                    
                    booked_slots = Appointment.objects.filter(
                        doctor_id=doctor_id,
                        hospital_id=hospital.id,
                        date_of_appointment=date,
                        status=AppointmentStatus.APPROVED
                    ).values_list('time_slot__start_time', 'time_slot__end_time')

                    if available_slots.exists():
                        hospitals_data.append({
                            'hospital_id': hospital.id,
                            'hospital_name': hospital.name,
                            'available_slots': TimeSlotSerializer(available_slots, many=True).data,
                            'booked_slots': [
                                {'start_time': start, 'end_time': end} 
                                for start, end in booked_slots
                            ]
                        })

            return Response(hospitals_data)

        except ValueError:
            return Response(
                {"error": "Invalid date format. Use YYYY-MM-DD"},
                status=status.HTTP_400_BAD_REQUEST
            )


class DoctorScheduleViewSet(ModelViewSet):
    serializer_class = DoctorScheduleSerializer
    filter_backends = [DjangoFilterBackend]
    permission_classes = [IsDoctor]
    
    def get_queryset(self):
        if self.request.user.role == 'doctor':
            return DoctorSchedule.objects.filter(doctor=self.request.user.doctor)
        return DoctorSchedule.objects.none()

    def get_serializer_context(self):
        context = super().get_serializer_context()
        if self.request.user.role == 'doctor':
            context['doctor'] = self.request.user.doctor
        return context
    
    def perform_create(self, serializer):
        serializer.save(doctor=self.request.user.doctor)

    @action(detail=False, methods=['post'])
    def copy_schedule(self, request):
        """Copy schedule from one day to other selected days."""
        source_day = request.data.get('source_day')
        target_days = request.data.get('target_days', [])
        hospital_id = request.data.get('hospital_id')

        if source_day is None or not target_days or not hospital_id:
            return Response(
                {"error": "source_day, target_days, and hospital_id are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            source_schedule = DoctorSchedule.objects.get(
                doctor=request.user.doctor,
                hospital_id=hospital_id,
                day_of_week=source_day
            )

            for target_day in target_days:
                schedule, created = DoctorSchedule.objects.get_or_create(
                    doctor=request.user.doctor,
                    hospital_id=hospital_id,
                    day_of_week=target_day,
                    defaults={'is_available': source_schedule.is_available}
                )
                schedule.time_slots.set(source_schedule.time_slots.all())

            return Response({"message": "Schedule copied successfully"})

        except DoctorSchedule.DoesNotExist:
            return Response(
                {"error": "Source schedule not found"},
                status=status.HTTP_404_NOT_FOUND
            )


class DoctorDateOverrideViewSet(ModelViewSet):
    serializer_class = DoctorDateOverrideSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = DoctorDateOverrideFilter
    permission_classes = [IsDoctor]
    
    def get_queryset(self):
        if self.request.user.role == 'doctor':
            return DoctorDateOverride.objects.filter(doctor=self.request.user.doctor)
        return DoctorDateOverride.objects.none()

    def get_serializer_context(self):
        context = super().get_serializer_context()
        if self.request.user.role == 'doctor':
            context['doctor'] = self.request.user.doctor
        return context
    
    def perform_create(self, serializer):
        serializer.save(doctor=self.request.user.doctor)

    def perform_update(self, serializer):
        instance = self.get_object()
        if instance.doctor != self.request.user.doctor:
            raise PermissionDenied("You can only update your own schedule overrides")
        serializer.save()

    def perform_destroy(self, instance):
        if instance.doctor != self.request.user.doctor:
            raise PermissionDenied("You can only delete your own schedule overrides")
        instance.delete()
