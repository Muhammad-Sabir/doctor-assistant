from django_filters import FilterSet
from django_filters import CharFilter

from apps.profiles.models import Speciality


class SpecialityFilter(FilterSet):
    name = CharFilter(field_name='name', lookup_expr='icontains')

    class Meta:
        model = Speciality
        fields = ['name']
