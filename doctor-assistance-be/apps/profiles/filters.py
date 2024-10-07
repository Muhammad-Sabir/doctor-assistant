from django_filters import FilterSet, CharFilter, NumberFilter, RangeFilter
from django.db.models import Q

from apps.profiles.models import Speciality, Degree, Disease, Allergy, DoctorProfile


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


class DoctorProfileFilter(FilterSet):
    name = CharFilter(field_name='name', lookup_expr='icontains')
    hospital_name = CharFilter(field_name='hospitals__name', lookup_expr='icontains')
    hospital_id = NumberFilter(field_name='hospitals__id')
    
    degree_name = CharFilter(method='filter_multi_field', field_name='degrees__name')
    speciality_name = CharFilter(method='filter_multi_field', field_name='specialities__name')
    disease_name = CharFilter(method='filter_multi_field', field_name='diseases__name')
    
    gender = CharFilter(field_name='gender', lookup_expr='iexact')
    average_rating = RangeFilter(field_name='average_rating')
    years_of_experience = NumberFilter(method='filter_years_of_experience', label="Years of Experience")

    class Meta:
        model = DoctorProfile
        fields = ['name', 'hospital_name', 'hospital_id', 'degree_name', 'speciality_name', 'disease_name', 'gender', 'average_rating']

    def filter_years_of_experience(self, queryset, name, value):
        return queryset.filter(date_of_experience__lte=self.get_date_of_experience_cutoff(value))

    def get_date_of_experience_cutoff(self, years):
        from datetime import date
        today = date.today()
        return today.replace(year=today.year - int(years))

    def filter_multi_field(self, queryset, name, value):
        values_list = value.split(',')
        q_objects = Q()
        for item in values_list:
            q_objects |= Q(**{f'{name}__icontains': item.strip()})
        return queryset.filter(q_objects).distinct()
