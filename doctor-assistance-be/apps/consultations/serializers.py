from rest_framework import serializers

from apps.consultations.models import Consultation, SOAPNotes, Prescription


class ConsultationSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.name', read_only=True)
    doctor_name = serializers.CharField(source='doctor.name', read_only=True)

    class Meta:
        model = Consultation
        fields = '__all__'
        read_only_fields = ['doctor']


class BaseConsultationSerializer(serializers.ModelSerializer):
    def validate_consultation(self, value):
        user = self.context['request'].user
        if hasattr(user, 'doctor') and value.doctor != user.doctor:
            raise serializers.ValidationError(
                "You can only create SOAP notes or prescriptions for your own consultations."
            )
        return value


class SOAPNotesSerializer(BaseConsultationSerializer):
    class Meta:
        model = SOAPNotes
        fields = '__all__'


class PrescriptionSerializer(BaseConsultationSerializer):
    class Meta:
        model = Prescription
        fields = '__all__'
