from rest_framework import serializers

from apps.consultations.models import Consultation, SOAPNotes, Prescription, Transcription


class ConsultationSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='appointment.patient.name', read_only=True)
    patient = serializers.CharField(source='appointment.patient.id', read_only=True)
    doctor_name = serializers.CharField(source='appointment.doctor.name', read_only=True)
    appointment_mode = serializers.CharField(source='appointment.appointment_mode', read_only=True)
    appointment_date = serializers.DateField(source='appointment.date_of_appointment', read_only=True)
    appointment_time = serializers.TimeField(source='appointment.time_slot.start_time', read_only=True)

    class Meta:
        model = Consultation
        fields = ['id', 'appointment', 'title', 'patient_name', 'patient', 'doctor_name', 
                 'appointment_mode', 'appointment_date', 'appointment_time', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

    def validate_appointment(self, value):
        user = self.context['request'].user
        if hasattr(user, 'doctor') and value.doctor != user.doctor:
            raise serializers.ValidationError(
                "You can only create consultations for your own appointments."
            )
        return value


class BaseConsultationSerializer(serializers.ModelSerializer):
    def validate_consultation(self, value):
        user = self.context['request'].user
        if hasattr(user, 'doctor') and value.appointment.doctor != user.doctor:
            raise serializers.ValidationError(
                "You can only create SOAP notes or prescriptions for your own consultations."
            )
        return value


class SOAPNotesSerializer(BaseConsultationSerializer):
    class Meta:
        model = SOAPNotes
        fields = '__all__'


class TranscriptionSerializer(BaseConsultationSerializer):
    class Meta:
        model = Transcription
        fields = '__all__'


class PrescriptionSerializer(BaseConsultationSerializer):
    medicines = serializers.ListField(
        child=serializers.DictField(
            child=serializers.CharField()
        ),
        required=True
    )
    
    class Meta:
        model = Prescription
        fields = ['id', 'consultation', 'medicines', 'additional_info', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

    def validate_medicines(self, value):
        if not value:
            raise serializers.ValidationError("At least one medicine must be provided")
        
        required_keys = {'medicine_name', 'instruction'}
        for medicine in value:
            if not isinstance(medicine, dict):
                raise serializers.ValidationError("Each medicine must be a dictionary")
            if not all(key in medicine for key in required_keys):
                raise serializers.ValidationError(
                    f"Each medicine must contain {', '.join(required_keys)}"
                )
        return value
