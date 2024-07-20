from game.consumers import *
from django.urls import path, re_path
# from user_management.consumers import *



websocket_urlpatterns = [
    path('ws/game/', GameConsumer.as_asgi()),
    # path('ws/test/', EchoConsumer.as_asgi()),
]