from django.urls import path, include
from rest_framework.routers import DefaultRouter

from apps.consultations.views import (
    ConsultationsViewSet,
    SOAPNotesViewSet,
    PrescriptionViewSet,
    TranscriptionViewSet
)

router = DefaultRouter()
router.register('consultations', ConsultationsViewSet, basename='consultations')
router.register('soap-notes', SOAPNotesViewSet, basename='soap-note')
router.register('transcriptions', TranscriptionViewSet, basename='transcription')
router.register('prescriptions', PrescriptionViewSet, basename='prescription')

urlpatterns = [
    path('', include(router.urls)),
]
