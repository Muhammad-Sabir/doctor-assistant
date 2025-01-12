from django_filters import FilterSet
from django_filters import CharFilter

from apps.consultations.models import Consultation, Prescription, Transcription, SOAPNotes


class ConsultationFilter(FilterSet):
    patient_id = CharFilter(field_name='patient', lookup_expr='exact')
    
    class Meta:
        model = Consultation
        fields = ['patient_id']

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
