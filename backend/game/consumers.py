from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
import json
import jwt
from django.conf import settings
from django.contrib.auth import get_user_model
from jwt.exceptions import ExpiredSignatureError, InvalidTokenError

class GameConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        query_string = self.scope['query_string'].decode()
        token = None
        for param in query_string.split('&'):
            if param.startswith('token='):
                token = param.split('=')[1]
                break

        if not token:
            await self.close()
            return

        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            user_id = payload.get('user_id')
            if not user_id:
                raise InvalidTokenError("User ID not found in token")
            User = get_user_model()
            self.user = await sync_to_async(User.objects.get)(id=user_id)
            if self.user.is_authenticated:
                await self.accept()
                self.player = await self.get_player(self.user)
            else:
                await self.close()
        except (ExpiredSignatureError, InvalidTokenError, User.DoesNotExist) as e:
            print(f"Connection error: {e}")
            await self.close()

    async def disconnect(self, close_code):
        # await self.leave_room()
        print("User disconnected")

    async def receive(self, text_data):
        data = json.loads(text_data)
        action = data.get('action')

        if action == "random":
            await self.handle_random_action()

    async def handle_random_action(self):
        room = await self.find_or_create_room()
        if room and not room.is_waiting:
            await self.notify_players(room)

    @sync_to_async
    def get_player(self, user):
        from user_management.models import Player
        return Player.objects.get(user=user)

    async def find_or_create_room(self):
        from .models import GameRoom
        room = await sync_to_async(GameRoom.objects.filter(is_waiting=True).first)()
        if room:
            self.room_id = room.id
            await sync_to_async(room.add_player)(self.player)
            self.room_name = f"game_room_{room.id}"
        else:
            room = await sync_to_async(GameRoom.objects.create)(player1=self.player)
            self.room_name = f"game_room_{room.id}"
            self.room_id = room.id

        self.room_group_name = self.room_name
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        print(f"{room}")
        return room

    async def notify_players(self, room):
        message = {
            'type': 'game.start',
            'message': 'Both players are connected. The game can start now!'
        }
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'send_message',
                'message': message
            }
        )

    async def send_message(self, event):
        message = event['message']
        await self.send(text_data=json.dumps(message))

    # async def leave_room(self):
    #     from .models import GameRoom
    #     room = await sync_to_async(GameRoom.objects.get)(id=self.room_id)
    #     if room.player1 == self.player:
    #         room.player1 = None
    #     elif room.player2 == self.player:
    #         room.player2 = None

    #     if room.player1 is None and room.player2 is None:
    #         await sync_to_async(room.delete)()

    #     await sync_to_async(room.save)()

    #     await self.channel_layer.group_discard(
    #         self.room_group_name,
    #         self.channel_name
    #     )

    #     self.room_id = None
    #     await self.save_state()