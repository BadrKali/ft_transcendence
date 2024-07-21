from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from channels.db import database_sync_to_async
import json
import jwt
from django.conf import settings
from django.contrib.auth import get_user_model
from jwt.exceptions import ExpiredSignatureError, InvalidTokenError

class GameConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        if self.scope['user'].is_anonymous:
            await self.close()
        else:
            await self.accept()
            self.player = await self.get_player(self.scope['user'])
            await self.send(text_data=json.dumps({
                'action': 'connected',
                'message': 'Connection established'
            }))

    async def disconnect(self, close_code):
        await self.leave_room()
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
        return room
    async def notify_players(self, room):

        message = {
            'type': 'game.start',
            'message': 'start_game',
            'action': 'start_game',
            'room_id': room.id
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

    async def leave_room(self):
            player = self.player
            game_room = await self.get_game_room(player)
            
            if game_room:
                await self.update_game_room(game_room, player)
        
    @database_sync_to_async
    def get_game_room(self, player):
        from .models import GameRoom
        try:
            game_room = GameRoom.objects.filter(player1=player).first()
        except GameRoom.DoesNotExist:
            try:
                game_room = GameRoom.objects.filter(player2=player).first()
            except GameRoom.DoesNotExist:
                return None
        return game_room

    @database_sync_to_async
    def update_game_room(self, game_room, player):
        if game_room.player1 == player:
            print(f"{player} has quit {game_room}")
            game_room.player1 = None
        elif game_room.player2 == player:
            print(f"{player} has quit {game_room}")
            game_room.player2 = None
        if not game_room.player1 and not game_room.player2:
            game_room.delete()
            print(f"{game_room} deleted")
        else:
            game_room.save()