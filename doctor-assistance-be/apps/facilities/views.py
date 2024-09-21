from rest_framework.viewsets import ModelViewSet

from apps.facilities.models import Hospital
from apps.facilities.serializers import HospitalSerializer


class HospitalViewSet(ModelViewSet):
    queryset = Hospital.objects.all()
    serializer_class = HospitalSerializer
    http_method_names = ['get']
