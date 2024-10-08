from rest_framework import serializers
from apps.reviews.models import Review


class ReviewSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.name', read_only=True)
    
    class Meta:
        model = Review
        fields = '__all__'
        
    def get_fields(self):
        fields = super().get_fields()

        request = self.context.get('request', None)
        
        if request and request.method == 'GET' and (
            not hasattr(request.user, 'role') or request.user.role != 'patient'
        ):
            fields.pop('patient', None)

        return fields
