import json

from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.core.exceptions import ObjectDoesNotExist

from apps.consultations.models import Consultation


class CallConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        user = self.scope['user']

        if not user.is_authenticated:
            await self.close()
            return
        
        self.room_group_name = self.get_room_group_name(user.id)
        print(f"WebSocket connected for user: {user}")

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        user = self.scope['user']
        data = json.loads(text_data)
        message = data.get('message')
        consultation_id = message.get('consultationId')

        consultation, receiver_id = await self.get_consultation_and_receiver(user, consultation_id)
        
        if consultation:
            if user.role == 'doctor':
                message['sender'] = await self.get_doctor_details(user)
            await self.channel_layer.group_send(
                self.get_room_group_name(receiver_id),
                {
                    'type': 'webrtc_message',
                    'message': message,
                }
            )

    async def webrtc_message(self, event: dict) -> None:
        await self.send(json.dumps({
            'message': event['message'],
        }))

    def get_room_group_name(self, user_id):
        return f'webrtc_{user_id}'

    @database_sync_to_async
    def get_consultation_and_receiver(self, user, consultation_id: int):
        try:
            consultation = Consultation.objects.get(id=consultation_id)
            receiver_id = consultation.doctor.user.id if user.role == 'patient' else consultation.patient.user.id
            return consultation, receiver_id
        except ObjectDoesNotExist:
            print(f"Consultation with id {consultation_id} does not exist")
            return None, None
    
    @database_sync_to_async
    def get_doctor_details(self, user):
        return {
            'name': user.doctor.name,
            'id': user.doctor.id
        }

