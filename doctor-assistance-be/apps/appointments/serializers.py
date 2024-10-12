from rest_framework import serializers
from django.utils import timezone

from apps.appointments.models import Appointment


class AppointmentSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.name', read_only=True)
    doctor_name = serializers.CharField(source='doctor.name', read_only=True)
    
    class Meta:
        model = Appointment
        fields = '__all__'
  

    def get_fields(self):
        fields = super().get_fields()
        user = self.context['request'].user

        if user.role == 'patient':
            fields['status'].read_only = True
            fields['cancellation_reason'].read_only = True
        elif user.role == 'doctor':
            fields['patient'].read_only = True
            fields['message'].read_only = True
            fields['doctor'].read_only = True
            fields['appointment_mode'].read_only=True

        return fields

    def validate_patient(self, value):
        user = self.context['request'].user
        if user.role == 'patient' and value != user.patient and value.primary_patient != user.patient:
            raise serializers.ValidationError(
                "You can only create appointments for yourself or your dependents."
            )
        return value

    def validate_date_of_appointment(self, value):
        if value < timezone.now().date():
            raise serializers.ValidationError("The appointment date cannot be in the past.")
        return value
