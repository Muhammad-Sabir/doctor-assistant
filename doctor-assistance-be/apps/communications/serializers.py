from django.db.models import Q
from rest_framework import serializers

from apps.profiles.models import PatientProfile, DoctorProfile
from apps.communications.models import ChatMessage
from apps.appointments.models import Appointment


class ContactSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()
    name = serializers.SerializerMethodField()
    last_message_preview = serializers.SerializerMethodField()
    last_message_created_at = serializers.SerializerMethodField()

    class Meta:
        model = Appointment
        fields = [
            'id',
            'name',
            'last_message_preview',
            'last_message_created_at',
        ]

    def get_id(self, obj):
        user = self.context['user']

        return obj.patient.id if user.role == 'doctor' else obj.doctor.id
    
    def get_name(self, obj):
        user = self.context['user']
        
        return obj.patient.name if user.role == 'doctor' else obj.doctor.name
        
    def get_last_message_preview(self, obj):
        last_message = ChatMessage.objects.filter(
            Q(sender=obj.patient.user, receiver=obj.doctor.user) | 
            Q(sender=obj.doctor.user, receiver=obj.patient.user)
        ).order_by('-created_at').first()
        
        return last_message.message if last_message else 'No messages'

    def get_last_message_created_at(self, obj):
        last_message = ChatMessage.objects.filter(
            Q(sender=obj.patient.user, receiver=obj.doctor.user) | 
            Q(sender=obj.doctor.user, receiver=obj.patient.user)
        ).order_by('-created_at').first()
        
        return last_message.created_at.isoformat() if last_message else None


class ChatMessageSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    created_at = serializers.SerializerMethodField()


    class Meta:
        model = ChatMessage
        fields = [
            'id',
            'user',
            'message',
            'created_at'
        ]
    
    def get_user(self, obj):
        if self.context['user'] == obj.sender:
            return 'You'
        
        role = self.context['user_role']
        return  getattr(obj.sender, role).name
    
    def get_created_at(self, obj):
        return obj.created_at.isoformat() 
