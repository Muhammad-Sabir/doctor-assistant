from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser

from apps.core.mixins import FileUploadMixin
from apps.core.viewsets import BaseReadOnlyViewSet
from apps.profiles.models import Speciality, Degree, Disease, DoctorProfile
from apps.profiles.serializers import (
    DoctorProfileSerializer,
    SpecialitySerializer,
    DegreeSerializer,
    DiseaseSerializer,
)
from apps.profiles.filters import SpecialityFilter, DegreeFilter, DiseaseFilter


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
    queryset = DoctorProfile.objects.all()
    serializer_class = DoctorProfileSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        doctor_instance = serializer.save(user=self.request.user)
        
        user = self.request.user
        user.is_profile_completed = True
        user.save(update_fields=['is_profile_completed'])
        
        self.handle_file_upload(doctor_instance)

    def perform_update(self, serializer):
        doctor_instance = serializer.save()
        self.handle_file_upload(doctor_instance)

    def handle_file_upload(self, doctor_instance):
        file = self.request.FILES.get('image_file')
        if file:
            self.handle_file_upload(doctor_instance, file)
