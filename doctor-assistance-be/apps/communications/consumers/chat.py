import json

from django.db.models import Q
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async

from apps.profiles.models import DoctorProfile, PatientProfile
from apps.communications.models import ChatMessage
from apps.appointments.models import Appointment
from apps.communications.serializers import ChatMessageSerializer, ContactSerializer


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        user = self.scope['user']
        self.room_group_name = f'chat_{user.id}'

        if not user.is_authenticated:
            await self.close()
        
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
        data = json.loads(text_data)
        data_source = data.get('source')

        print('recieving_data_chat', data)
        
        if data_source == 'message_send':
            await self.receive_message_send(data)
        elif data_source == 'message_list':
            await self.receive_message_list(data)
        elif data_source == 'contact_list':
            await self.receive_contact_list(data)

    async def receive_message_send(self, data):
        user = self.scope['user']
        receiver_id = data.get('receiver_id')
        message = data.get('message')

        receiver_user = await self.get_user_by_profile(receiver_id, user.role)

        if not receiver_user:
            print(f"No user found for profile ID: {receiver_id}")
            return 

        chat_message = await self.create_chat_message(user, receiver_user, message)

        message_serializer = ChatMessageSerializer(
            chat_message,
            context={
                'user': receiver_user,
                'user_role': user.role
            }
        )

        sender_profile_id = await self.get_sender_profile_id(user)
        
        response_data = {
            'sender': sender_profile_id,
            'message': message_serializer.data,
        }

        print(f'Sending to channel: chat_{receiver_user.id}')
        await self.send_group(
            group=f'chat_{receiver_user.id}',
            source='message_send',
            data=response_data
        )

    async def receive_message_list(self, data):
        user = self.scope['user']
        receiver_id = data.get('receiver_id')
        
        receiver_user = await self.get_user_by_profile(receiver_id, user.role)

        messages = await self.get_chat_messages(user, receiver_user)
        
        serialized_messages = await self.serialize_chat_messages(messages=messages, user=user)
        
        data = {
            'messages': serialized_messages,
        }
    
        await self.send_group(f'chat_{user.id}', 'message_list', data)

    async def receive_contact_list(self, data):
        user = self.scope['user']
        
        profile = await self.get_profile(user, user.role)
        
        appointments = await self.get_approved_appointments(profile)
        
        serialized_contacts = await self.serialize_contact_list(appointments, user)

        data = {
            'contacts': serialized_contacts
        }

        await self.send_group(f'chat_{user.id}', 'contact_list', data)            
                    
    @database_sync_to_async
    def get_approved_appointments(self, profile):
        profile_filter = Q(doctor=profile) if isinstance(profile, DoctorProfile) else Q(patient=profile)

        appointments = Appointment.objects.filter(
            profile_filter, status='approved'
        ).select_related('doctor__user', 'patient__user').distinct('doctor', 'patient', 'status')

        return appointments
    
    @database_sync_to_async
    def serialize_contact_list(self, appointments, user):
        return ContactSerializer(
            appointments,
            context={'user': user},
            many=True
        ).data
    
    @database_sync_to_async
    def get_chat_messages(self, user, receiver_user):
        return ChatMessage.objects.filter(
            Q(sender=user, receiver=receiver_user) |
            Q(sender=receiver_user, receiver=user)
        ).order_by('created_at')

    @database_sync_to_async
    def serialize_chat_messages(self, messages, user):
        return ChatMessageSerializer(
            messages,
            context={
                'user': user,
                'user_role': 'patient' if user.role == 'doctor' else 'doctor'
            }, 
            many=True
        ).data

    @database_sync_to_async
    def get_user_by_profile(self, receiver_id, sender_role):
        """
        Fetch the user by DoctorProfile or PatientProfile. This function is run in a separate thread using database_sync_to_async.
        """
        ProfileModel = PatientProfile if sender_role == 'doctor' else DoctorProfile
        try:
            return ProfileModel.objects.select_related('user').get(id=receiver_id).user
        except ProfileModel.DoesNotExist:
            return None

    @database_sync_to_async
    def create_chat_message(self, sender, receiver, message):
        """
        Create a ChatMessage instance in the database. This function is run in a separate thread using database_sync_to_async.
        """
        print(f"Creating message: {message} from {sender} to {receiver}")
        try:
            return ChatMessage.objects.create(sender=sender, receiver=receiver, message=message)
        except Exception as e:
            print(f"Error creating ChatMessage: {e}")
            return None
   
    @database_sync_to_async
    def get_sender_profile_id(self, user):
        """
        Fetch the sender profile ID based on the user role (doctor or patient). 
        This function is wrapped in `database_sync_to_async`.
        """
        if hasattr(user, 'doctor'):
            return user.doctor.id
        elif hasattr(user, 'patient'):
            return user.patient.id
        return None
    
    @database_sync_to_async
    def get_profile(self, user, role):
        """
        Fetch the profile based on the user role (doctor or patient). 
        This function is wrapped in `database_sync_to_async`.
        """
        return getattr(user, role)        

    async def send_group(self, group, source, data):
        response = {
            'type': 'broadcast_group',
            'source': source,
            'data': data
        }
        await self.channel_layer.group_send(
            group, response
        )

    async def broadcast_group(self, data):
        '''
        data:
            - type: 'broadcast_group'
            - source: where it originated from
            - data: what ever you want to send as a dict
        '''
        data.pop('type')
        '''
        return data:
            - source: where it originated from
            - data: what ever you want to send as a dict
        '''
        print('sending_data_chat', data)
        await self.send(text_data=json.dumps(data))
