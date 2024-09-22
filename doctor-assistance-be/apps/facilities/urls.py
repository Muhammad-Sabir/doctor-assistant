from django.urls import path, include
from rest_framework.routers import DefaultRouter

from apps.facilities.views import HospitalViewSet

router = DefaultRouter()
router.register(r'hospitals', HospitalViewSet, basename='hospital')


urlpatterns = [
    path('', include(router.urls)),
]
