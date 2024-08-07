from game.consumers import *
# from user_management.consumers import NotificationConsumer
from django.urls import path, re_path
from user_management.consumers import *
from chat .consumers import ChatConsumer



websocket_urlpatterns = [
    path('ws/game/', GameConsumer.as_asgi()),
    path('ws/notifications/', NotificationConsumer.as_asgi()),
    path('ws/chat/', ChatConsumer.as_asgi())
    # path('ws/test/', EchoConsumer.as_asgi()),
]