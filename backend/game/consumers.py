from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from channels.db import database_sync_to_async
import json
import asyncio
import math
from django.db.models import Q


class GameState:
    # WINNING_SCORE = 2
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
            'game_over': False,
        }
    
    def check_winning_condition(self):
        for player in self.state['players'].values():
            if player['score'] >= 1:
                self.state['game_over'] = True
                self.state['winner'] = player['username']
                return True
        return False

    async def add_player(self, username, room):
        player1_settings = await self.get_player_settings(room.player1)
        player2_settings = await self.get_player_settings(room.player2)

        player1_username = await self.get_player_username(room.player1)
        player2_username = await self.get_player_username(room.player2)
        # print("")
        player1 = {
            'username': player1_username,
            'id': 1,
            'score': 0,
            'x': 20,
            'y': (self.state['canvas']['height'] - 140) / 2,
            'width': 10,
            'height': 140,
            'color': player1_settings.paddle if player1_settings else 'WHITE'
        }
        player2 = {
            'username': player2_username,
            'id': 2,
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
        print(f"Current players: {list(self.state['players'].keys())}")
        if user in self.state['players']:
            player = self.state['players'][user]
            if direction == "up":
                if player['y'] > 0:
                    player['y'] -= 20
            else:
                if player['y'] < self.state['canvas']['height'] - player['height']:
                    player['y'] += 20
            print(f"{user}'s new y position: {player['y']}")
        else:
            print(f"Error: User {user} not found in players.")

    def remove_player(self, username):
        if username in self.state['players']:
            del self.state['players'][username]
            print(f"Player removed: {username}, Current players: {list(self.state['players'].keys())}")

    def reset_ball(self):
        self.state['ball']['x'] = self.state['canvas']['width'] / 2
        self.state['ball']['y'] = self.state['canvas']['height'] / 2
        self.state['ball']['velocityX'] = -self.state['ball']['velocityX']
        self.state['ball']['speed'] = 7

    def collision(self, b, p):
        p_top = p['y']
        p_bottom = p['y'] + p['height']
        p_left = p['x']
        p_right = p['x'] + p['width']
        b_top = b['y'] - b['radius']
        b_bottom = b['y'] + b['radius']
        b_left = b['x'] - b['radius']
        b_right = b['x'] + b['radius']
        return p_left < b_right and p_top < b_bottom and p_right > b_left and p_bottom > b_top

    def update_ball_position(self):
        ball = self.state['ball']
        players = self.state['players']

        ball['x'] += ball['velocityX']
        ball['y'] += ball['velocityY']

        if ball['y'] - ball['radius'] < 0 or ball['y'] + ball['radius'] > self.state['canvas']['height']:
            ball['velocityY'] = -ball['velocityY']

        player1 = list(players.values())[0]
        player2 = list(players.values())[1]

        if ball['x'] - ball['radius'] < 0:
            player2['score'] += 1
            self.reset_ball()
        elif ball['x'] + ball['radius'] > self.state['canvas']['width']:
            player1['score'] += 1
            self.reset_ball()

        player = player1 if ball['x'] + ball['radius'] < self.state['canvas']['width'] / 2 else player2

        if self.collision(ball, player):
            collide_point = (ball['y'] - (player['y'] + player['height'] / 2)) / (player['height'] / 2)
            angle_rad = (math.pi / 4) * collide_point
            direction = 1 if ball['x'] + ball['radius'] < self.state['canvas']['width'] / 2 else -1
            ball['velocityX'] = direction * ball['speed'] * math.cos(angle_rad)
            ball['velocityY'] = ball['speed'] * math.sin(angle_rad)
            ball['speed'] += 0.1

    def get_state(self):
        return self.state

    def to_json(self):
        return json.dumps(self.state)


class GameStateManager:
    def __init__(self):
        self.game_states = {}

    def get_or_create_game_state(self, room_id):
        if room_id not in self.game_states:
            self.game_states[room_id] = GameState()
        return self.game_states[room_id]

    def remove_game_state(self, room_id):
        if room_id in self.game_states:
            del self.game_states[room_id]

game_state_manager = GameStateManager()

class GameConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        if self.scope['user'].is_anonymous:
            await self.close()
        else:
            self.player = await self.get_player(self.scope['user'])
            self.keep_running = True
            self.room_name = None
            self.room_group_name = None
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
        elif action == "invite":
            await self.handle_invite_action()
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
    
    async def handle_invite_action(self):
        from .models import InviteGameRoom
        try:
            invite_game_room = await sync_to_async(
                lambda: InviteGameRoom.objects.filter(
                    Q(player1=self.player) | Q(player2=self.player)
                ).first()
            )()

            if invite_game_room:
                self.room_name = f"game_room_{invite_game_room.id}"
                self.room_id = invite_game_room.id
                self.room_group_name = self.room_name
                self.channel_layer.group_add(self.room_group_name, self.channel_name)
                await sync_to_async(invite_game_room.set_player_connected)(self.player)
                await sync_to_async(invite_game_room.check_and_update_status)()
                if not invite_game_room.is_waiting:
                    self.game_state = game_state_manager.get_or_create_game_state(self.room_id)
                    self.game_state.add_player("", invite_game_room)
                    print("The game has started successfully.")
                    await self.notify_players(invite_game_room)
            else:
                print("InviteGameRoom not found")
        except Exception as e:
            print(f"{e}")


    @database_sync_to_async
    def get_invite_state(self, room):
        if room.player1 == self.player:
            room.player1_connected = True
            print("Player1 connected.")
        elif room.player2 == self.player:
            room.player2_connected = True
            print("Player2 connected.")
        if room.player1_connected and room.player2_connected:
            print("Both players are ready to play.")
            self.game_state = game_state_manager.get_or_create_game_state(self.room_id)
            room.is_waiting = False
        room.save()


    async def handle_random_action(self):
        player_str = await self.get_player_str()
        room = await self.find_or_create_room(player_str)

        if not room.is_waiting:
            await self.game_state.add_player(player_str, room)
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
            if self.game_state.check_winning_condition():
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        'type': 'send_message',
                        'message': {
                            'action': 'game_over',
                            'game_state': self.game_state.get_state(),
                        }
                    }
                )
                break
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
        print(f"{Player.objects.get(user=user)} ++++++++++++_________+_+_+_+_+___+)_+)_")
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
            self.game_state = game_state_manager.get_or_create_game_state(self.room_id)
        else:
            room = await sync_to_async(GameRoom.objects.create)(player1=self.player)
            self.room_name = f"game_room_{room.id}"
            self.room_id = room.id
            self.game_state = game_state_manager.get_or_create_game_state(self.room_id)
        self.room_group_name = self.room_name
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        return room

    async def notify_players(self, room):
        print(f"{room} ROOOOOOOOOOOOM")
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
            game_state_manager.remove_game_state(self.room_id)
        else:
            game_room.save()