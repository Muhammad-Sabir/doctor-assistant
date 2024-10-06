from django.urls import path, include
from rest_framework.routers import DefaultRouter

from apps.consultations.views import (
    ConsultationsViewSet,
    SOAPNotesViewSet,
    PerscriptionViewSet,
)

router = DefaultRouter()
router.register('consultations', ConsultationsViewSet, basename='consultations')
router.register('soap-notes', SOAPNotesViewSet, basename='soap-note')
router.register('perscriptions', PerscriptionViewSet, basename='perscription')

urlpatterns = [
    path('', include(router.urls)),
]
