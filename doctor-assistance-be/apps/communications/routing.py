from django.urls import path
from apps.communications.consumers import ConsultationConsumer, CallConsumer, ChatConsumer


websocket_urlpatterns = [
    path("ws/consultation/<int:consultation_id>/", ConsultationConsumer.as_asgi()),
    path("ws/call/", CallConsumer.as_asgi()),
    path("ws/chat/", ChatConsumer.as_asgi()),
]
