from game.consumers import GameConsumer
from user_management.consumers import NotificationConsumer
from chat.consumers import ChatConsumer, ChatBotConsumer

from django.urls import path

websocket_urlpatterns = [
    path('wss/game/', GameConsumer.as_asgi()),
    path('wss/notifications/', NotificationConsumer.as_asgi()),
    path('wss/chat/', ChatConsumer.as_asgi()),
    path('wss/chatbot/', ChatBotConsumer.as_asgi()),
]