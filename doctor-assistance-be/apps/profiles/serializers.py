from rest_framework import serializers

from apps.core.utils import update_or_create_related_fields
from apps.profiles.models import (
    Speciality, 
    Disease, 
    Degree, 
    DoctorProfile, 
    PatientProfile,
    Allergy,
    PatientAllergy
)
from apps.facilities.models import Hospital
from apps.facilities.serializers import HospitalSerializer


class BaseSerializer(serializers.ModelSerializer):
    class Meta:
        fields = '__all__'


class SpecialitySerializer(BaseSerializer):
    class Meta(BaseSerializer.Meta):
        model = Speciality


class DegreeSerializer(BaseSerializer):
    class Meta(BaseSerializer.Meta):
        model = Degree


class DiseaseSerializer(BaseSerializer):
    class Meta(BaseSerializer.Meta):
        model = Disease


class DoctorProfileSerializer(BaseSerializer):
    specialities = SpecialitySerializer(many=True, read_only=True)
    degrees = DegreeSerializer(many=True, read_only=True)
    diseases = DiseaseSerializer(many=True, read_only=True)
    hospitals = HospitalSerializer(many=True, read_only=True)

    related_fields = {
            'specialities': Speciality,
            'degrees': Degree,
            'diseases': Disease,
            'hospitals': Hospital
    }

    class Meta(BaseSerializer.Meta):
        model = DoctorProfile
        read_only_fields = ['user']


    def create(self, validated_data):
        doctor_profile = DoctorProfile.objects.create(**validated_data)
        update_or_create_related_fields(doctor_profile, self.initial_data, self.related_fields)
        return doctor_profile

    def update(self, instance, validated_data):
        instance = super().update(instance, validated_data)
        update_or_create_related_fields(instance, self.initial_data, self.related_fields)
        return instance


class DependentProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = PatientProfile
        fields = ['id', 'name', 'date_of_birth', 'gender']


class PatientProfileSerializer(serializers.ModelSerializer):
    dependents = DependentProfileSerializer(many=True, read_only=True)

    class Meta:
        model = PatientProfile
        fields = ['id', 'name', 'date_of_birth', 'gender', 'dependents']


class PatientProfileSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = PatientProfile
        fields = ['id', 'name']


class AllergySerializer(serializers.ModelSerializer):
    class Meta:
        model = Allergy
        fields = ['id', 'name']


class PatientAllergySerializer(serializers.ModelSerializer):
    allergy = AllergySerializer(read_only=True)
    patient = PatientProfileSummarySerializer(read_only=True)

    class Meta:
        model = PatientAllergy
        fields = ['id', 'allergy', 'patient']

    def create(self, validated_data):
        patient, allergy, updated_by = self._get_related_objects()
        
        return PatientAllergy.objects.create(
            allergy=allergy,
            patient=patient,
            updated_by=updated_by
        )

    def update(self, instance, validated_data):
        patient, allergy, updated_by = self._get_related_objects()

        instance.allergy = allergy
        instance.patient = patient
        instance.updated_by = updated_by
        
        return super().update(instance, validated_data) 

    def _get_related_objects(self):
        patient_id = self.initial_data.get('patient')
        allergy = self.initial_data.get('allergy', {}).get('name')

        if not patient_id or not allergy:
            raise serializers.ValidationError("Patient ID and Allergy name must be provided.")

        try:
            patient = PatientProfile.objects.get(id=patient_id)
            allergy, _ = Allergy.objects.get_or_create(name=allergy)
            updated_by = DoctorProfile.objects.get(user=self.context['request'].user)
            return patient, allergy, updated_by
        except PatientProfile.DoesNotExist:
            raise serializers.ValidationError("Patient not found.")
    

class AllergySerializer(BaseSerializer):
    class Meta(BaseSerializer.Meta):
        model = Allergy
