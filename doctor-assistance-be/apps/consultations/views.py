from django.db.models import Max, Q
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import SAFE_METHODS, IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend

from apps.profiles.permissions import IsDoctor, IsDoctorOrOwner
from apps.consultations.models import Consultation, SOAPNotes, Prescription
from apps.consultations.serializers import (
    ConsultationSerializer,
    SOAPNotesSerializer,
    PrescriptionSerializer
)
from apps.consultations.filters import ConsultationFilter

class ConsultationsViewSet(ModelViewSet):
    serializer_class = ConsultationSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = ConsultationFilter

    def get_permissions(self):
        if self.request.method in SAFE_METHODS:
            return [IsDoctor()]
        
        return [IsDoctorOrOwner()]
    
    def get_queryset(self):
        user = self.request.user
        return Consultation.objects.filter(doctor=user.doctor)

    def perform_create(self, serializer):
        serializer.save(doctor=self.request.user.doctor)


class SOAPNotesViewSet(ModelViewSet):
    serializer_class = SOAPNotesSerializer
    permission_classes = [IsDoctor]

    def get_queryset(self):
        user = self.request.user
        return SOAPNotes.objects.select_related('consultation')\
            .only('consultation', 'subject', 'description', 'created_at', 'updated_at')\
            .filter(consultation__doctor=user.doctor)


class PrescriptionViewSet(ModelViewSet):
    queryset = Prescription.objects.all()
    serializer_class = PrescriptionSerializer
    
    def get_permissions(self):
        if self.request.method in SAFE_METHODS:
            return [IsAuthenticated()]
        
        return [IsDoctor()]
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'doctor':
            return Prescription.objects.select_related('consultation')\
                .only('consultation', 'medicine_name', 'instruction', 'created_at', 'updated_at')\
                .filter(consultation__doctor=user.doctor)
        
        return self.get_latest_prescriptions(user.patient)
       
    def get_latest_prescriptions(self, patient):
        latest_consultations = Consultation.objects.filter(
            Q(patient=patient) | Q(patient__in=patient.dependents.all())
        ).order_by('patient', 'updated_at').distinct('patient').values_list('id', flat=True)

        return Prescription.objects.filter(
            consultation__id__in=latest_consultations
        )
   