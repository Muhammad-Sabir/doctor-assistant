from django.urls import path, include
from rest_framework.routers import DefaultRouter

from apps.appointments.views import (
    AppointmentViewSet,
    DoctorScheduleViewSet,
    DoctorDateOverrideViewSet
)

router = DefaultRouter()
router.register('appointments', AppointmentViewSet, basename='appointment')
router.register('schedules', DoctorScheduleViewSet, basename='schedule')
router.register('schedule-overrides', DoctorDateOverrideViewSet, basename='schedule-override')

urlpatterns = [
    path('', include(router.urls)),
]
