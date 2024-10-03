from rest_framework import serializers

from apps.profiles.serializers import PatientProfileSummarySerializer
from apps.reviews.models import Review


class ReviewSerializer(serializers.ModelSerializer):
    patient = PatientProfileSummarySerializer(read_only=True)
    
    class Meta:
        model = Review
        fields = '__all__'
