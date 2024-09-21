from rest_framework.viewsets import ModelViewSet
from django_filters.rest_framework import DjangoFilterBackend

from apps.profiles.models import Speciality
from apps.profiles.serializers import SpecialitySerializer
from apps.profiles.filters import SpecialityFilter


class SpecialityViewSet(ModelViewSet):
    queryset = Speciality.objects.all()
    serializer_class = SpecialitySerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = SpecialityFilter
    http_method_names = ['get']
