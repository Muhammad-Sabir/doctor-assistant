from django_filters import FilterSet, DateFilter, NumberFilter, CharFilter

from apps.appointments.models import Appointment, DoctorSchedule, DoctorDateOverride


class AppointmentFilter(FilterSet):
    status = CharFilter(field_name='status', lookup_expr='iexact')
    

    class Meta:
        model = Appointment
        fields = ['status']


class DoctorScheduleFilter(FilterSet):
    hospital_id = NumberFilter(field_name='hospital')
    day_of_week = NumberFilter(field_name='day_of_week')

    class Meta:
        model = DoctorSchedule
        fields = ['hospital_id', 'day_of_week']


class DoctorDateOverrideFilter(FilterSet):
    hospital_id = NumberFilter(field_name='hospital')
    date = DateFilter(field_name='date')
    date_from = DateFilter(field_name='date', lookup_expr='gte')
    date_to = DateFilter(field_name='date', lookup_expr='lte')

    class Meta:
        model = DoctorDateOverride
        fields = ['hospital_id', 'date', 'date_from', 'date_to']
