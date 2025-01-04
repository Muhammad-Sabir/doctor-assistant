import requests
from django.db.models import F, FloatField
from django.db.models.expressions import RawSQL
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from django_filters.rest_framework import DjangoFilterBackend

from apps.core.mixins import FileUploadMixin
from apps.core.viewsets import BaseReadOnlyViewSet
from apps.facilities.models import Hospital
from apps.profiles.models import Speciality, Degree, Disease, DoctorProfile
from apps.profiles.serializers import (
    DoctorProfileSerializer,
    SpecialitySerializer,
    DegreeSerializer,
    DiseaseSerializer,
    PMDCVerificationSerializer
)
from apps.profiles.filters import (
    SpecialityFilter, 
    DegreeFilter, 
    DiseaseFilter,
    DoctorProfileFilter
)
from apps.profiles.permissions import IsDoctorOrOwner


class SpecialityViewSet(BaseReadOnlyViewSet):
    queryset = Speciality.objects.all()
    serializer_class = SpecialitySerializer
    filterset_class = SpecialityFilter


class DegreeViewSet(BaseReadOnlyViewSet):
    queryset = Degree.objects.all()
    serializer_class = DegreeSerializer
    filterset_class = DegreeFilter


class DiseaseViewSet(BaseReadOnlyViewSet):
    queryset = Disease.objects.all()
    serializer_class = DiseaseSerializer
    filterset_class = DiseaseFilter


class VerifyPMDCView(APIView):
    def post(self, request):
        serializer = PMDCVerificationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        response = self.verify_pmdc(serializer.validated_data['pmdc_no'])
        if not response.get('status') and 'data' not in response:
            return Response(
                {"error": "Invalid PMDC number or verification failed."},
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response(
            {
                "message": "PMDC number is valid.",
                "details": response['data']
            },
            status=status.HTTP_200_OK
        )

    def verify_pmdc(self, pmdc_no):
        url = "https://pmc.gov.pk/api/DRC/GetQualifications"
        try:
            response = requests.post(url, json={"RegistrationNo": pmdc_no})
            response.raise_for_status()
            return response.json()
        except requests.RequestException:
            return {"status": False}
        

class DoctorProfileViewSet(FileUploadMixin, ModelViewSet):
    serializer_class = DoctorProfileSerializer
    permission_classes = [IsDoctorOrOwner]
    parser_classes = [MultiPartParser, FormParser]
    filter_backends = [DjangoFilterBackend]
    filterset_class = DoctorProfileFilter
    
    def get_queryset(self):
        queryset = DoctorProfile.objects.with_reviews_data().prefetch_related(
            'specialities', 
            'degrees', 
            'diseases',
            'hospitals',
        )
        
        if self.action in ['retrieve', 'me']:
            queryset = queryset.prefetch_related('reviews')
        
        location_params = self._get_location_params()
        if location_params:
            latitude, longitude, radius = location_params
            queryset = self._filter_by_location(queryset, latitude, longitude, radius)
        
        return queryset

    @action(detail=False, methods=['get', 'put', 'patch'], url_path='me')
    def me(self, request):
        doctor_profile = self.get_queryset().get(user=request.user)

        if request.method in ['PUT', 'PATCH']:
            serializer = self.get_serializer(doctor_profile, data=request.data, partial=request.method == 'PATCH')
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            return Response(serializer.data)

        serializer = self.get_serializer(doctor_profile)
        return Response(serializer.data)

    def perform_create(self, serializer):
        doctor_instance = serializer.save(user=self.request.user)
        self.request.user.is_profile_completed = True
        self.request.user.save(update_fields=['is_profile_completed'])
        self.handle_file_upload(doctor_instance)

    def perform_update(self, serializer):
        doctor_instance = serializer.save()
        
        if doctor_instance:
            self.handle_file_upload(doctor_instance)

    def handle_file_upload(self, doctor_instance):
        file = self.request.FILES.get('image_file')
        if file:
            doctor_instance.save_file(file)
    
    def _get_location_params(self):
        params = self.request.query_params
        latitude = params.get('latitude')
        longitude = params.get('longitude')
        radius = params.get('radius', 5)
        
        if not all([latitude, longitude]):
            return None
            
        try:
            latitude = float(latitude)
            longitude = float(longitude)
            radius = float(radius)
            return latitude, longitude, radius
        except ValueError:
            return None

    def _filter_by_location(self, queryset, latitude, longitude, radius_km=5):
        EARTH_RADIUS_KM = 6371.0

        distance_formula = """
            %s * acos(
                cos(radians(%s)) * cos(radians(latitude)) *
                cos(radians(longitude) - radians(%s)) +
                sin(radians(%s)) * sin(radians(latitude))
            )
        """

        hospitals = Hospital.objects.annotate(
            distance=RawSQL(
                distance_formula,
                (EARTH_RADIUS_KM, latitude, longitude, latitude),
                output_field=FloatField()
            )
        ).filter(distance__lte=radius_km)

        return queryset.filter(hospitals__in=hospitals).distinct()
