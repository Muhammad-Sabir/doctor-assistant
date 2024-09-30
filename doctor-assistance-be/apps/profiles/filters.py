from django_filters import FilterSet
from django_filters import CharFilter

from apps.profiles.models import Speciality, Degree, Disease, Allergy


class BaseFilter(FilterSet):
    name = CharFilter(field_name='name', lookup_expr='icontains')


class SpecialityFilter(BaseFilter):
    class Meta:
        model = Speciality
        fields = ['name']


class DegreeFilter(BaseFilter):
    class Meta:
        model = Degree
        fields = ['name']


class DiseaseFilter(BaseFilter):
    class Meta:
        model = Disease
        fields = ['name']


class AllergyFilter(BaseFilter):
    class Meta:
        model = Allergy
        fields = ['name']
