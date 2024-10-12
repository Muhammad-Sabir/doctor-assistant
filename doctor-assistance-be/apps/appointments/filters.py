from django_filters import FilterSet
from django_filters import CharFilter

from apps.appointments.models import Appointment


class AppointmentFilter(FilterSet):
    status = CharFilter(field_name='status', lookup_expr='iexact')
    

    class Meta:
        model = Appointment
        fields = ['status']
  