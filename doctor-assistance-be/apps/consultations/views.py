from django.db.models import Max, Q
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import SAFE_METHODS, IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend

from apps.profiles.permissions import IsDoctor, IsDoctorOrOwner
from apps.consultations.models import Consultation, SOAPNotes, Prescription, Transcription
from apps.consultations.serializers import (
    ConsultationSerializer,
    SOAPNotesSerializer,
    PrescriptionSerializer,
    TranscriptionSerializer
)
from apps.consultations.filters import ConsultationFilter, PrescriptionFilter


class ConsultationsViewSet(ModelViewSet):
    serializer_class = ConsultationSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = ConsultationFilter

    def get_permissions(self):
        if self.request.method in SAFE_METHODS:
            return [IsAuthenticated()]
        
        return [IsDoctorOrOwner()]
    
    def get_queryset(self):
        return self.get_consultations(self.request.user)

    def perform_create(self, serializer):
        serializer.save(doctor=self.request.user.doctor)

    def get_consultations(self, user):
        if user.role == 'patient':
            return Consultation.objects.select_related(
                'doctor__user',
                'patient__user',
                'patient__primary_patient__user'
            ).filter(
                Q(patient__user=user) | Q(patient__primary_patient__user=user)
            )
        
        return Consultation.objects.select_related(
            'doctor__user',
            'patient__user',
            'patient__primary_patient__user'
        ).filter(
            doctor__user=user
        )

class SOAPNotesViewSet(ModelViewSet):
    serializer_class = SOAPNotesSerializer
    permission_classes = [IsDoctor]

    def get_queryset(self):
        user = self.request.user
        return SOAPNotes.objects.select_related('consultation')\
            .only('consultation', 'subject', 'description', 'created_at', 'updated_at')\
            .filter(consultation__doctor=user.doctor)


class TranscriptionViewSet(ModelViewSet):
    serializer_class = TranscriptionSerializer
    permission_classes = [IsDoctor]

    def get_queryset(self):
        user = self.request.user
        return Transcription.objects.select_related('consultation')\
            .only('consultation', 'transcription_text', 'created_at', 'updated_at')\
            .filter(consultation__doctor=user.doctor)


class PrescriptionViewSet(ModelViewSet):
    queryset = Prescription.objects.all()
    serializer_class = PrescriptionSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = PrescriptionFilter
    
    def get_permissions(self):
        if self.request.method in SAFE_METHODS:
            return [IsAuthenticated()]
        
        return [IsDoctor()]
    
    def get_queryset(self):
        user = self.request.user
        filters = (
            Q(consultation__patient__user=user) |
            Q(consultation__patient__primary_patient__user=user)
        ) if user.role == 'patient' else Q(consultation__doctor__user=user)

        return Prescription.objects.select_related(
            'consultation__patient__user',
            'consultation__patient__primary_patient__user',
            'consultation__doctor__user'
        ).filter(filters)
   