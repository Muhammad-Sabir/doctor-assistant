from django_filters import FilterSet
from django_filters import CharFilter

from apps.consultations.models import Consultation


class ConsultationFilter(FilterSet):
    patient_id = CharFilter(field_name='patient', lookup_expr='exact')
    
    class Meta:
        model = Consultation
        fields = ['patient_id']
