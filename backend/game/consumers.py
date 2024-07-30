from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from channels.db import database_sync_to_async
import json
import asyncio

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
            },
            'players': {},
        }

    async def add_player(self, username, room):
        player1_settings = await self.get_player_settings(room.player1)
        player2_settings = await self.get_player_settings(room.player2)

        player1_username = await self.get_player_username(room.player1)
        player2_username = await self.get_player_username(room.player2)

        player1 = {
            'username': player1_username,
            'score': 0,
            'x': 20,
            'y': (self.state['canvas']['height'] - 140) / 2,
            'width': 10,
            'height': 140,
            'color': player1_settings.paddle if player1_settings else 'WHITE'
        }
        player2 = {
            'username': player2_username,
            'score': 0,
            'x': self.state['canvas']['width'] - 30,
            'y': (self.state['canvas']['height'] - 140) / 2,
            'width': 10,
            'height': 140,
            'color': player2_settings.paddle if player2_settings else 'WHITE'
        }

        self.state['players'][player1_username] = player1
        self.state['players'][player2_username] = player2

        print(f"Player 1: {player1}")
        print(f"Player 2: {player2}")
        print(f"Current players: {list(self.state['players'].keys())}")

    async def get_player_username(self, player):
        return await sync_to_async(lambda: player.user.username)()

    async def get_player_settings(self, player):
        from .models import GameSettings
        return await sync_to_async(lambda: GameSettings.objects.filter(user=player).first())()

    def player_mouvement(self, user, direction):
        player = self.state['players'][user]
        if direction == "up":
            if player['y'] > 0:
                player['y'] -= 20
        else:
            if player['y'] < self.state['canvas']['height'] - player['height']:
                player['y'] += 20
        print(f"{player['y']}")

    def remove_player(self, username):
        if username in self.state['players']:
            del self.state['players'][username]
            print(f"Player removed: {username}, Current players: {list(self.state['players'].keys())}")

    def reset_ball(self):
        self.state['ball']['x'] = self.state['canvas']['width'] / 2
        self.state['ball']['y'] = self.state['canvas']['height'] / 2
        self.state['ball']['velocityX'] = -self.state['ball']['velocityX']
        self.state['ball']['speed'] = 7

    def update_ball_position(self):
        if self.state['ball']['x'] - self.state['ball']['radius'] < 0 or self.state['ball']['x'] + self.state['ball']['radius'] > self.state['canvas']['width']:
            self.reset_ball()
        self.state['ball']['x'] += self.state['ball']['velocityX']
        self.state['ball']['y'] += self.state['ball']['velocityY']
        if self.state['ball']['y'] - self.state['ball']['radius'] < 0 or self.state['ball']['y'] + self.state['ball']['radius'] > self.state['canvas']['height']:
            self.state['ball']['velocityY'] = -self.state['ball']['velocityY']

    def get_state(self):
        return self.state

    def to_json(self):
        return json.dumps(self.state)

class GameConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        if self.scope['user'].is_anonymous:
            await self.close()
        else:
            self.player = await self.get_player(self.scope['user'])
            self.keep_running = True
            self.room_name = None
            self.room_group_name = None
            self.game_state = GameState()
            await self.accept()
            await self.send(text_data=json.dumps({
                'action': 'connected',
                'message': 'Connection established',
            }))

    async def disconnect(self, close_code):
        self.keep_running = False
        if self.room_group_name:
            await self.leave_room()

    async def receive(self, text_data):
        data = json.loads(text_data)
        action = data.get('action')

        if action == "random":
            await self.handle_random_action()
        elif action == "player_movement":
            username = data.get('user')
            direction = data.get('direction')
            self.game_state.player_mouvement(username, direction)
            await self.send_player_movement_update()

    async def send_player_movement_update(self):
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'send_message',
                'message': {
                    'action': 'update_player_movement',
                    'game_state': self.game_state.get_state(),
                }
            }
        )
    async def handle_random_action(self):
        player_str = await self.get_player_str()
        room = await self.find_or_create_room(player_str)

        if not room.is_waiting:
            print("hello")
            await self.game_state.add_player("hello", room)
            await self.notify_players(room)
            asyncio.create_task(self.start_game_loop())
        else:
            await self.notify_waiting_player(room)

    @database_sync_to_async
    def get_players(self, room):
        return room.player1, room.player2

    async def notify_waiting_player(self, room):
        await self.send(text_data=json.dumps({
            'action': 'update_game_state',
            'game_state': self.game_state.get_state(),
        }))

    async def start_game_loop(self):
        frame_duration = 1 / 30
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

    @database_sync_to_async
    def get_player(self, user):
        from user_management.models import Player
        return Player.objects.get(user=user)

    @database_sync_to_async
    def get_player_str(self):
        return str(self.player)

    async def find_or_create_room(self, player_str):
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
            self.game_state = GameState()

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
            self.game_state.remove_player(str(player))
            await self.update_game_room(game_room, player)

    @database_sync_to_async
    def get_game_room(self, player):
        from .models import GameRoom
        game_room = GameRoom.objects.filter(player1=player).first()
        if not game_room:
            game_room = GameRoom.objects.filter(player2=player).first()
        return game_room

    @database_sync_to_async
    def update_game_room(self, game_room, player):
        if game_room.player1 == player:
            game_room.player1 = None
        elif game_room.player2 == player:
            game_room.player2 = None
        if not game_room.player1 and not game_room.player2:
            game_room.delete()
        else:
            game_room.save()
