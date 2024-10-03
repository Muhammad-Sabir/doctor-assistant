from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.viewsets import ModelViewSet

from apps.reviews.models import Review
from apps.reviews.serializers import ReviewSerializer
from apps.reviews.permissions import IsReviewOwnerOrReadOnly

class ReviewViewSet(ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [IsReviewOwnerOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(patient=self.request.user.patient)

    @action(detail=False, methods=['get'], url_path='me')
    def me(self, request):
        reviews = self.get_reviews_for_user(request.user)
        serializer = self.get_serializer(reviews, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def get_reviews_for_user(self, user):
        if not (hasattr(user, 'role') and
                (hasattr(user, 'patient') or hasattr(user, 'doctor'))):
            return []

        filter_kwargs = {'patient': user.patient} if user.role == 'patient' else {'doctor': user.doctor}
        related_name = 'doctor' if user.role == 'patient' else 'patient'
        return self.queryset.filter(**filter_kwargs).select_related(related_name)
