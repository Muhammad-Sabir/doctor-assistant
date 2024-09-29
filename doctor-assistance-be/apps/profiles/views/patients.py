from rest_framework.viewsets import ModelViewSet
from rest_framework.exceptions import ValidationError

from apps.profiles.models import PatientProfile
from apps.profiles.serializers import PatientProfileSerializer, DependentProfileSerializer
from apps.profiles.permissions import IsPatientOrOwner


class PrimaryPatientViewSet(ModelViewSet):
    queryset = PatientProfile.objects.filter(primary_patient__isnull=True)
    serializer_class = PatientProfileSerializer
    permission_classes = [IsPatientOrOwner]

    def get_queryset(self):
        if self.request.user.role == 'patient':
            return PatientProfile.objects.filter(user_id=self.request.user.id)
        return super().get_queryset()
    
    def perform_create(self, serializer):
        if PatientProfile.objects.filter(user=self.request.user).exists():
            raise ValidationError("User already has a primary patient profile.")
        
        serializer.save(user=self.request.user)
        self.request.user.is_profile_completed = True
        self.request.user.save(update_fields=['is_profile_completed'])


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
