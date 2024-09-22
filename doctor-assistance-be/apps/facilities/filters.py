from django_filters import FilterSet
from django_filters import CharFilter

from apps.facilities.models import Hospital


class HospitalFilter(FilterSet):
    name = CharFilter(lookup_expr='icontains')
    city = CharFilter(lookup_expr='istartswith')
    street_address = CharFilter(lookup_expr='icontains')

    class Meta:
        model = Hospital
        fields = ['name', 'city', 'street_address']
