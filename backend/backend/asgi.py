import os
from django.core.asgi import get_asgi_application
from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
# from authentication.middleware import JWTAuthMiddleware  # Adjust import path as per your project structure
# import authentication.routing  # Adjust routing module as per your project structure
from .routing import websocket_urlpatterns

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django_asgi_app = get_asgi_application()


from channels.db import database_sync_to_async
from channels.middleware import BaseMiddleware
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import AccessToken
from urllib.parse import parse_qs
from django.contrib.auth.models import AnonymousUser

User = get_user_model()

@database_sync_to_async
def get_user(token):
    try:
        access_token = AccessToken(token)
        user = User.objects.get(id=access_token['user_id'])
        return user
    except Exception as e:
        return AnonymousUser()

class JWTAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        query_string = parse_qs(scope['query_string'].decode())
        token = query_string.get('token')
        print(token)
        if token:
            print(token[0])
            scope['user'] = await get_user(token[0])
            print(f"this is the scope for that token {scope['user']}")
        else:
            scope['user'] = AnonymousUser()
        return await super().__call__(scope, receive, send)



application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": AuthMiddlewareStack(
        JWTAuthMiddleware(
            URLRouter(
                websocket_urlpatterns
            )
        )
    ),
})


