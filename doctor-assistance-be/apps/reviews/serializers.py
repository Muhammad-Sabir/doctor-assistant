from rest_framework import serializers

from apps.appointments.models import Appointment
from apps.reviews.models import Review


class ReviewSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.name', read_only=True)
    
    class Meta:
        model = Review
        fields = '__all__'
        read_only_fields = ['patient']
    
    def validate(self, attrs):
        attrs['patient'] = self.context['request'].user.patient
        doctor = attrs['doctor']
        
        if Review.objects.filter(patient=attrs['patient'], doctor=doctor).exists():
            raise serializers.ValidationError("You have already submitted a review for this doctor.")
        
        appointment = Appointment.objects.filter(doctor=doctor, patient=attrs['patient'], completed=True).first()
        
        if not appointment:
            dependents = attrs['patient'].dependents.all()  # Assuming a reverse relation exists
            appointment = Appointment.objects.filter(doctor=doctor, patient__in=dependents, completed=True).first()
        
        if not appointment:
            raise serializers.ValidationError("You must have a completed appointment with this doctor to leave a review.")
        
        return attrs

    def get_fields(self):
        fields = super().get_fields()

        request = self.context.get('request', None)
        
        if request and request.method == 'GET' and (
            not hasattr(request.user, 'role') or request.user.role != 'patient'
        ):
            fields.pop('patient', None)

        return fields
