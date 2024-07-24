from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from channels.db import database_sync_to_async
import json
import asyncio
from django.conf import settings
from django.contrib.auth import get_user_model
from jwt.exceptions import ExpiredSignatureError, InvalidTokenError

class GameState:
    def __init__(self):
        self.state = {
            'canvas': {
                'width': 1384,
                'height': 696,
            },
            'ball': {
                'x': 1384 / 2,
                'y': 696 / 2,
                'radius': 10,
                'velocityX': 5,
                'velocityY': 5,
                'speed': 7,
                'color': "WHITE"
            },
            'net': {
                'x': (1384 - 2) / 2,
                'y': 0,
                'height': 10,
                'width': 2,
                'color': "#D9D9D9"
            }
        }

    def update_ball_position(self):
        self.state['ball']['x'] += self.state['ball']['velocityX']
        self.state['ball']['y'] += self.state['ball']['velocityY']
        if self.state['ball']['y'] - self.state['ball']['radius'] < 0 or self.state['ball']['y'] + self.state['ball']['radius'] > self.state['canvas']['height']:
            self.state['ball']['velocityY'] = -self.state['ball']['velocityY']
        if self.state['ball']['x'] - self.state['ball']['radius'] < 0 or self.state['ball']['x'] + self.state['ball']['radius'] > self.state['canvas']['width']:
            self.state['ball']['velocityX'] = -self.state['ball']['velocityX']

    def get_state(self):
        return self.state

    def to_json(self):
        return json.dumps(self.state)

class GameConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        if self.scope['user'].is_anonymous:
            await self.close()
        else:
            await self.accept()
            self.game_state = GameState()
            self.player = await self.get_player(self.scope['user'])
            self.keep_running = True
            await self.send(text_data=json.dumps({
                'action': 'connected',
                'message': 'Connection established',
            }))

    async def disconnect(self, close_code):
        self.keep_running = False
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
            self.game_state = GameState()
            await self.notify_players(room)
            asyncio.create_task(self.start_game_loop())

    async def start_game_loop(self):
        frame_duration = 1 / 50
        while self.keep_running:
            self.game_state.update_ball_position()
            await self.channel_layer.group_send(
                self.room_group_name, 
                {
                    'type': 'send_message',
                    'message': {
                        'action': 'update_game_state',
                        'game_state': self.game_state.get_state(),
                    }
                }
            )
            await asyncio.sleep(frame_duration)

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
            'room_id': room.id,
            'game_state': self.game_state.get_state()
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
