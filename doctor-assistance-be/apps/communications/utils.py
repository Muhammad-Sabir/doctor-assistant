from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from django.utils import timezone


def send_contact_update(user_id, doctor_id, doctor_name, appointment_date):
    channel_layer = get_channel_layer()
    
    data = {
        'id': doctor_id,
        'name': doctor_name,
        'last_message_preview': "No message yet",
        'last_message_created_at': appointment_date.isoformat()
    }
    
    async_to_sync(channel_layer.group_send)(
        f'chat_{user_id}',
        {
            'type': 'broadcast_group',
            'source': 'contact_list_update',
            'data': data
        }
    )
