from rest_framework.viewsets import ModelViewSet
from django_filters.rest_framework import DjangoFilterBackend


class BaseReadOnlyViewSet(ModelViewSet):
    filter_backends = [DjangoFilterBackend]
    http_method_names = ['get']
