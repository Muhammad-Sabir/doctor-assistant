from django.urls import path, include
from rest_framework.routers import DefaultRouter

from apps.profiles.views import SpecialityViewSet, DegreeViewSet, DiseaseViewSet, DoctorProfileViewSet

router = DefaultRouter()
router.register('specialities', SpecialityViewSet, basename='speciality')
router.register('degrees', DegreeViewSet, basename='degree')
router.register('diseases', DiseaseViewSet, basename='disease')
router.register('doctor-profile', DoctorProfileViewSet, basename='doctor-profile')


urlpatterns = [
    path('', include(router.urls)),
]