from django.db.models import F, FloatField
from django.db.models.expressions import RawSQL
from rest_framework.viewsets import ModelViewSet
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import action
from rest_framework.response import Response
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
        
        return queryset

    @action(detail=False, methods=['get'], url_path='nearby-doctors')
    def nearby_doctors(self, request):
        coordinates = self._validate_location_params(request)
        if isinstance(coordinates, Response):
            return coordinates
            
        latitude, longitude = coordinates
        doctors = self._get_nearby_doctors(latitude, longitude)
        
        return self._paginate_and_serialize_response(doctors)

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
    
    def _get_nearby_doctors(self, user_latitude, user_longitude, radius_km=5):
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
                (EARTH_RADIUS_KM, user_latitude, user_longitude, user_latitude),
                output_field=FloatField()
            )
        ).filter(distance__lte=radius_km)

        return self.get_queryset().filter(hospitals__in=hospitals).distinct()

    def _validate_location_params(self, request):
        """
        Validate location parameters from request.
        """
        latitude = request.query_params.get('latitude')
        longitude = request.query_params.get('longitude')
        
        if not all([latitude, longitude]):
            return Response(
                {'detail': 'Latitude and Longitude are required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            return float(latitude), float(longitude)
        except ValueError:
            return Response(
                {'detail': 'Invalid Latitude or Longitude format'},
                status=status.HTTP_400_BAD_REQUEST
            )

    def _paginate_and_serialize_response(self, queryset):
        """
        Handle pagination and serialization of queryset.
        """
        filtered_queryset = self.filter_queryset(queryset)

        page = self.paginate_queryset(filtered_queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(filtered_queryset, many=True)
        return Response(serializer.data)
