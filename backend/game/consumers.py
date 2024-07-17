from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
import json
import jwt
from django.conf import settings
from django.contrib.auth import get_user_model

class GameConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        query_string = self.scope['query_string'].decode()
        token = None
        for param in query_string.split('&'):
            if param.startswith('token='):
                token = param.split('=')[1]
                break

        if not token:
            print("Token not provided")
            await self.close()
            return

        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            user_id = payload.get('user_id')
            if not user_id:
                raise jwt.InvalidTokenError("User ID not found in token")

            User = get_user_model()
            self.user = await sync_to_async(User.objects.get)(id=user_id)

            if self.user.is_authenticated:
                print(f"Authenticated User: {self.user.username}, User ID: {self.user.id}")
                await self.accept()
            else:
                print("User is not authenticated")
                await self.close()
        except User.DoesNotExist:
            print("User does not exist")
            await self.close()

    async def disconnect(self, close_code):
        print("User disconnected")
        pass

    async def receive(self, text_data):
        data = json.loads(text_data)
        action = data.get('action')
    #     if action == 'random':
    #         await self.handle_random_mode()

    # async def handle_random_mode(self):
    #     room = await sync_to_async(self.find_or_create_room)()

    #     player = await sync_to_async(self.get_player)()

    #     if room.player1 == player:
    #         await self.send(text_data=json.dumps({
    #             'message': 'Waiting for another player...'
    #         }))
    #     else:
    #         await self.channel_layer.group_add(f"room_{room.id}", self.channel_name)
    #         await self.channel_layer.group_send(
    #             f"room_{room.id}",
    #             {
    #                 'type': 'start_game',
    #                 'room_id': room.id
    #             }
    #         )
        
    # def find_or_create_room(self):
    #     from .models import GameRoom
    #     from user_management.models import Player

    #     try:
    #         player_instance = self.get_player()

    #         room = GameRoom.objects.filter(is_waiting=True).first()
    #         if room:
    #             room.player2 = player_instance
    #             room.is_waiting = False
    #             room.save()
    #         else:
    #             room = GameRoom.objects.create(player1=player_instance, is_waiting=True)

    #         return room
    #     except Exception as e:
    #         logger.error(f"Error finding or creating room: {e}")
    #         raise

    # def get_player(self):
    #     from user_management.models import Player
    #     player, created = Player.objects.get_or_create(user_id=self.user.id)
    #     if created:
    #         print("Player created with id {self.user.id}")

    #     return player

    # def start_game(self, event):
    #     room_id = event['room_id']
    #     self.send(text_data=json.dumps({
    #         'action': 'start_game',
    #         'room_id': room_id,
    #     }))
