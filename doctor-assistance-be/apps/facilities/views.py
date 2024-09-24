from apps.core.viewsets import BaseReadOnlyViewSet
from apps.facilities.models import Hospital
from apps.facilities.serializers import HospitalSerializer
from apps.facilities.filters import HospitalFilter


class HospitalViewSet(BaseReadOnlyViewSet):
    queryset = Hospital.objects.all()
    serializer_class = HospitalSerializer
    filterset_class = HospitalFilter
