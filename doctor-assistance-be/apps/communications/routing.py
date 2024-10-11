from django.urls import path
from apps.communications.consumers import ConsultationConsumer


websocket_urlpatterns = [
    path("ws/consultation/<int:consultation_id>/", ConsultationConsumer.as_asgi()),
]