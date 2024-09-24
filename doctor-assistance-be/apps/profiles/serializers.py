from rest_framework import serializers

from apps.profiles.models import Speciality, Disease, Degree, DoctorProfile


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
    class Meta(BaseSerializer.Meta):
        model = DoctorProfile
        read_only_fields = ['user'] 
