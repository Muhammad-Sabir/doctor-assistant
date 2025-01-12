from django_filters import FilterSet
from django_filters import CharFilter, BooleanFilter

from apps.consultations.models import Consultation, Prescription, Transcription, SOAPNotes


class ConsultationFilter(FilterSet):
    patient_id = CharFilter(field_name='appointment__patient', lookup_expr='exact')
    appointment_id = CharFilter(field_name='appointment', lookup_expr='exact')
    completed = BooleanFilter(field_name='appointment__completed', lookup_expr='exact')
    
    class Meta:
        model = Consultation
        fields = ['patient_id', 'appointment_id', 'completed']

class TranscriptionFilter(FilterSet):
    consultation_id = CharFilter(field_name='consultation', lookup_expr='exact')
    
    class Meta:
        model = Transcription
        fields = ['consultation_id']

class SOAPNotesFilter(FilterSet):
    consultation_id = CharFilter(field_name='consultation', lookup_expr='exact')
    
    class Meta:
        model = SOAPNotes
        fields = ['consultation_id']


class PrescriptionFilter(FilterSet):
    consultation_id = CharFilter(field_name='consultation', lookup_expr='exact')
    
    class Meta:
        model = Prescription
        fields = ['consultation_id']
