import json
import tempfile

from channels.generic.websocket import AsyncWebsocketConsumer
from django.core.files.storage import default_storage


class ConsultationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.consultation_id = self.scope['url_route']['kwargs']['consultation_id']
        self.group_name = f"consultation_{self.consultation_id}"
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

        self.audio_file = tempfile.NamedTemporaryFile(delete=False, suffix=".webm")

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)
        self.audio_file.close()

        audio_path = f"audio/consultation_{self.consultation_id}.webm"
        with open(self.audio_file.name, 'rb') as f:
            default_storage.save(audio_path, f)


    async def receive(self, text_data=None, bytes_data=None):
        if bytes_data:
            self.audio_file.write(bytes_data)

            await self.channel_layer.group_send(self.group_name, {
                'type': 'audio_transcription',
                'message': 'Audio chunk received'
            })

    async def audio_transcription(self, event):
        await self.send(text_data=json.dumps({
            'message': event['message']
        }))

    async def connected(self, event):
        await self.send(text_data=json.dumps({
            'message': event['message']
        }))


class CallConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'webrtc_{self.room_name}'

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()
        
        await self.send(text_data=json.dumps({
            'channel_id': self.channel_name
        }))

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data.get('message')
       
        await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'webrtc_message',
                    'message': message,
                    'sender_channel': self.channel_name
                }
            )

    async def webrtc_message(self, event):
        await self.send(json.dumps({
            'message': event['message'],
            'sender_channel': event['sender_channel']
        }))
