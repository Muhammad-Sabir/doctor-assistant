from rest_framework.viewsets import ModelViewSet
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend

from apps.core.mixins import FileUploadMixin
from apps.core.viewsets import BaseReadOnlyViewSet
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
        return DoctorProfile.objects.with_reviews_data().prefetch_related(
            'specialities', 
            'degrees', 
            'diseases',
            'hospitals',
        )
        
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
