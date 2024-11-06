from rest_framework.serializers import ModelSerializer

from apps.notifications.models import Notification


class NotificationSerializer(ModelSerializer):
    
    class Meta:
        model = Notification
        fields = ['id', 'user', 'message', 'notification_type', 'created_at', 'is_read']
        read_only_fields = ['id', 'user', 'message', 'notification_type', 'created_at']
