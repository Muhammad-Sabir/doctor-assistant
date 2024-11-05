from django.db.models import Q
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated, SAFE_METHODS
from rest_framework.exceptions import ValidationError
from django_filters.rest_framework import DjangoFilterBackend

from apps.core.viewsets import BaseReadOnlyViewSet
from apps.profiles.models import PatientProfile, PatientAllergy, Allergy
from apps.appointments.models import AppointmentStatus
from apps.profiles.serializers import (
    PatientProfileSerializer,
    DependentProfileSerializer,
    PatientAllergySerializer,
    AllergySerializer
)
from apps.profiles.permissions import IsPatientOrOwner, IsDoctor
from apps.profiles.filters import AllergyFilter, PatientAllergyFilter


class PrimaryPatientViewSet(ModelViewSet):
    # queryset = PatientProfile.objects.filter(primary_patient__isnull=True)
    serializer_class = PatientProfileSerializer
    permission_classes = [IsPatientOrOwner]

    def get_queryset(self):
        if self.request.user.role == 'patient':
            return PatientProfile.objects.filter(user_id=self.request.user.id)
        return self.get_approved_patients_for_doctor(self.request.user.doctor.id)
    
    def perform_create(self, serializer):
        if PatientProfile.objects.filter(user=self.request.user).exists():
            raise ValidationError("User already has a primary patient profile.")
        
        serializer.save(user=self.request.user)
        self.request.user.is_profile_completed = True
        self.request.user.save(update_fields=['is_profile_completed'])
    
    def get_approved_patients_for_doctor(self, doctor_id):
        patient_profiles = PatientProfile.objects.prefetch_related('appointments') \
                                                .filter(appointments__doctor_id=doctor_id,
                                                        appointments__status=AppointmentStatus.APPROVED) \
                                                .distinct()
        return patient_profiles


class DependentProfileViewSet(ModelViewSet):
    serializer_class = DependentProfileSerializer
    permission_classes = [IsPatientOrOwner]

    def get_queryset(self):
        primary_patient = PatientProfile.objects.filter(user=self.request.user).first()
        if primary_patient:
            return PatientProfile.objects.filter(primary_patient=primary_patient)
        return PatientProfile.objects.none()

    def perform_create(self, serializer):
        primary_patient = PatientProfile.objects.filter(user=self.request.user).first()
        if not primary_patient:
            raise ValidationError("Primary patient profile not found.")
        serializer.save(primary_patient=primary_patient)


class PatientAllergyViewSet(ModelViewSet):
    serializer_class = PatientAllergySerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = PatientAllergyFilter

    def get_permissions(self):
        if self.request.method in SAFE_METHODS:
            return [IsAuthenticated()]
        
        return [IsDoctor()]

    def get_queryset(self):
        if self.request.user.role == 'doctor':
            return PatientAllergy.objects.all()
        
        return PatientAllergy.objects.filter(
                    Q(patient__user=self.request.user) |
                    Q(patient__primary_patient__user=self.request.user)
                )

class AllergyViewSet(BaseReadOnlyViewSet):
    queryset = Allergy.objects.all()
    serializer_class = AllergySerializer
    filterset_class = AllergyFilter
