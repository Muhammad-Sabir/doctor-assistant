from django.urls import path, include
from rest_framework.routers import DefaultRouter

from apps.profiles.views import (
    SpecialityViewSet, 
    DegreeViewSet, 
    DiseaseViewSet, 
    DoctorProfileViewSet,
    PrimaryPatientViewSet,
    DependentProfileViewSet,
    PatientAllergyViewSet,
    AllergyViewSet
)

router = DefaultRouter()
router.register('specialities', SpecialityViewSet, basename='speciality')
router.register('degrees', DegreeViewSet, basename='degree')
router.register('diseases', DiseaseViewSet, basename='disease')
router.register('doctors', DoctorProfileViewSet, basename='doctor')

router.register('allergies', AllergyViewSet, basename='allergy')
router.register('patient-allergies', PatientAllergyViewSet, basename='patient-allergy')
router.register('patients', PrimaryPatientViewSet, basename='patient')
router.register('dependents', DependentProfileViewSet, basename='dependent')

urlpatterns = [
    path('', include(router.urls)),
]
