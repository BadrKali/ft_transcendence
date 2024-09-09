from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from channels.db import database_sync_to_async
import json
import asyncio
import math
from django.db.models import Q
import time

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
                'speed': 5,
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
            'game_running': True,
            'keep_running': True,
        }

    def get_keep_running(self):
        return self.state['keep_running']

    async def update_game_over(self, is_over):
        self.state['game_over'] = is_over

    async def get_game_over(self):
        return self.state['game_over']

    def update_keep_running(self, status):
        self.state['keep_running'] = status

    def get_running(self):
        return self.state['game_running']
    
    def update_game_running(self, status):
        self.state['game_running'] = status

    def check_winning_condition(self):
        for player in self.state['players'].values():
            if player['score'] >= 3:
                self.state['game_over'] = True
                self.state['winner'] = player['username']
                return True
        return False

    async def get_winner_loser(self):
        try:
            players = list(self.state['players'].values())
            player1 = players[0]
            player2 = players[1]
            
            if player1['score'] > player2['score']:
                return player1['username'], player2['username']
            else:
                return player2['username'], player1['username']
        except:
            return;

    def winner_score(self, winner):
        return self.state['players'][winner]['score']

    def loser_score(self, loser):
        return self.state['players'][loser]['score']

    async def add_player(self, username, room):
        player1_settings = await self.get_player_settings(room.player1)
        player2_settings = await self.get_player_settings(room.player2)

        player1_username = await self.get_player_username(room.player1)
        player2_username = await self.get_player_username(room.player2)
        player1 = {
            'username': player1_username,
            'id': 1,
            'score': 0,
            'x': 20,
            'y': (self.state['canvas']['height'] - 140) / 2,
            'width': 10,
            'height': 140,
            'color': player1_settings.paddle if player1_settings else 'WHITE',
            'disconnect' : 0,
            'status': True,
        }
        player2 = {
            'username': player2_username,
            'id': 2,
            'score': 0,
            'x': self.state['canvas']['width'] - 30,
            'y': (self.state['canvas']['height'] - 140) / 2,
            'width': 10,
            'height': 140,
            'color': player2_settings.paddle if player2_settings else 'WHITE',
            'disconnect' : 0,
            'status': True,
        }

        self.state['players'][player1_username] = player1
        self.state['players'][player2_username] = player2

        print(f"Player 1: {player1}")
        print(f"Player 2: {player2}")
        print(f"Current players: {list(self.state['players'].keys())}")

    async def reconnect_player(self, username, room):
        player = self.state['players'][username]
        player['status'] = True
        print(f"Current players: {list(self.state['players'].keys())}")

    async def update_player_status(self, username, status):
        print(f"{username} status is {status}")
        player = self.state['players'][username]
        player['status'] = status
    
    async def get_players_status(self):
        players = self.state['players']
        player1 = list(players.values())[0]
        player2 = list(players.values())[1]
        player1_status = player1['status']
        player2_status = player2['status']
        if player1_status and player2_status:
            print("BOTH PLAYERS ARE CONNECTED ++++++++++++++++++++")
            return True
        else:
            print("SOMEONE HAS DISCONNECTED ++++++++++++++++++++")
            return False
    
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
            if self.state['players'][username]['disconnect'] == 1:
                return True
            else :
                self.state['players'][username]['disconnect'] += 1
                return False

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
            self.game_state = None
            self.room = None
            await self.accept()
            asyncio.sleep(3)
            await self.send(text_data=json.dumps({
                'action': 'connected',
                'message': 'Connection established',
            }))

    async def disconnect(self, close_code):
        player_str = await self.get_player_str()
        self.game_state.update_game_running(False)
        winner , loser = await self.game_state.get_winner_loser()
        is_game_over = await self.game_state.get_game_over()
        if is_game_over:
            print("Game is already over, handling disconnect accordingly")
            await self.leave_room("game_over")
            return
        elif self.game_state.remove_player(player_str):
            currentWinner = await self.game_state.get_player_username(self.player)
            disconnectedPlayer = loser
            await self.update_xp(self.player, disconnectedPlayer, self.room) 
            await self.save_game_history(currentWinner, disconnectedPlayer, self.room)
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'send_message',
                    'message': {
                        'action': 'game_canceled',
                        'winner': currentWinner,
                        'game_state': self.game_state.get_state(),
                    }
                }
            )
            await self.leave_room("game_canceled")
        else:
            await self.game_state.update_player_status(player_str, False)
            await self.channel_layer.group_send(
                self.room_group_name, {
                    'type': 'send_message',
                    'message': { 'action': 'opponent_disconnected' },
                }
            )

    async def receive(self, text_data):
        data = json.loads(text_data)
        action = data.get('action')
        if action == "random":
            await self.handle_random_action()
        elif action == "invite":
            await self.handle_invite_action()
        elif action == "player_movement":
            if self.game_state:
                username = data.get('user')
                direction = data.get('direction')
                self.game_state.player_mouvement(username, direction)
                await self.send_player_movement_update()
        elif action == "got_it":
            room = self.get_game_room()
            asyncio.create_task(self.start_game_loop(room))
        elif action == "im_waiting":
            room = self.get_game_room()
            await self.waiting_for_reconnection(room) 

    async def waiting_for_reconnection(self, room):
        timeout = 10
        interval = 1 
        total_time_waited = 0
        winner = await self.game_state.get_player_username(self.player)
        loser = None
        while total_time_waited < timeout:
            if await self.game_state.get_players_status():
                print("Player has reconnected.")
                return  

            await asyncio.sleep(interval)
            total_time_waited += interval

        await self.send(text_data=json.dumps({
            'action': 'you_won',
            'winner': winner
        }))

    @database_sync_to_async
    def delete_room(self):
        room = self.get_game_room()
        self.room.delete()

    def send_winner_message(self, event): 
        self.send(text_data=json.dumps(event['message']))

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
                await self.channel_layer.group_add(self.room_group_name, self.channel_name)
                await sync_to_async(invite_game_room.set_player_connected)(self.player)
                await sync_to_async(invite_game_room.check_and_update_status)()
                self.game_state = game_state_manager.get_or_create_game_state(self.room_id)
                if not invite_game_room.is_waiting:
                    await self.game_state.add_player("", invite_game_room)
                    await self.notify_players(invite_game_room)
                    asyncio.create_task(self.start_game_loop(invite_game_room))
            else:
                print("InviteGameRoom not found")
        except Exception as e:
            print(f"{e}")

    async def handle_random_action(self):
        from .models import GameRoom
        player_str = await self.get_player_str()
        room = await self.check_for_reconnection(player_str)
        if room:
            self.room = room
            await self.game_state.reconnect_player(player_str, room)
            await self.handle_reconnection(player_str, room)
            return
        room = await self.find_or_create_room(player_str)
        if not room.is_waiting:
            self.room = room
            await self.game_state.add_player(player_str, room)
            await self.notify_players(room)
        else:
            await self.notify_waiting_player(room)

    async def check_for_reconnection(self, player_str):
        from .models import GameRoom
        try :
            room = await sync_to_async(
                lambda: GameRoom.objects.filter(
                    Q(player1=self.player) | Q(player2=self.player)
                ).first()
            )()
            if room:
                self.room_name = f"game_room_{room.id}"
                self.room_id = room.id
                self.room_group_name = self.room_name
                await self.channel_layer.group_add(self.room_group_name, self.channel_name)
                self.game_state = game_state_manager.get_or_create_game_state(self.room_id)
            return room if room else None
        except GameRoom.DoesNotExist:
            return None

    async def handle_reconnection(self, player_str, room):
        self.room = room
        await self.game_state.reconnect_player(player_str, room)
        await self.notify_reconnection(player_str, room)
        await self.send_reconnection_info(room)

    async def send_reconnection_info(self, room):
        await self.send(text_data=json.dumps({
            'action': "reconnected",
            'room_id': room.id,
            'game_state': self.game_state.get_state(),
        }))

    async def notify_reconnection(self, player_str, room):
        self.game_state.update_game_running(True) 
        await self.channel_layer.group_send(
            self.room_group_name, {
                'type': 'send_message',
                'message': {
                    'action': 'opponent_connected',
                    'room_id': room.id,
                    'game_state': self.game_state.get_state()
                },
            }
        )

    @database_sync_to_async
    def get_players(self, room):
        return room.player1, room.player2

    async def notify_waiting_player(self, room):
        await self.send(text_data=json.dumps({
            'action': 'update_game_state',
            'game_state': self.game_state.get_state(),
        }))

    async def start_game_loop(self, room):
        frame_duration = 1 / 50
        while self.game_state.get_running():
            start_time = time.time()
            self.game_state.update_ball_position()
            if self.game_state.check_winning_condition():
                winner , loser = await self.game_state.get_winner_loser()
                await self.game_state.update_game_over(True)
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        'type': 'send_message',
                        'message': {
                            'action': 'game_over',
                            'game_state': self.game_state.get_state(),
                            'winner': winner,
                            'loser': loser
                        }
                    }
                )
                await self.update_xp(winner, loser, self.room)
                await self.save_game_history(winner, loser, self.room)
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
            elapsed_time = time.time() - start_time
            sleep_duration = max(0, frame_duration - elapsed_time)
            await asyncio.sleep(sleep_duration)
        print("Loop Stopped")

    @sync_to_async
    def update_xp(self, winner, loser, room):
        try:
            player1 = self.game_state.get_player_username(room.player1)
            if player1 == winner:
                room.player1.update_xp(True)
                room.player2.update_xp(False)
            else:
                room.player1.update_xp(False)
                room.player2.update_xp(True)
            print("XP Updated")
        except Player.DoesNotExist:
            print("Error: One of the players does not exist.")
    
    @sync_to_async
    def save_game_history(self, winner, loser, room):
        from .models import GameHistory
        from user_management.models import Player
        try:
            player1 = self.game_state.get_player_username(room.player1)
            if player1 == winner:
                winner_user = room.player1
                loser_user = room.player2
            else :
                winner_user = room.player2
                loser_user = room.player1
            GameHistory.objects.create(
                winner_user=winner_user,
                loser_user=loser_user,
                winner_score= self.game_state.winner_score(str(winner)),
                loser_score= self.game_state.loser_score(loser),
                game_type= 'pingpong',
                match_type= 'single'
            )
            print("Game History Saved")
        except Player.DoesNotExist:
            print("Error: One of the players does not exist.")
    
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
        message = {
            'type': 'game.start',
            'message': 'start_game',
            'action': 'start_game',
            'room_id': room.id,
            'game_state': self.game_state.get_state()
        }
        print(f"GROUP NAAME {self.channel_layer}")
        await self.channel_layer.group_send(
            self.room_group_name, {
                'type': 'send_message',
                'message': message
            }
        )

    async def send_message(self, event):
        message = event['message']
        await self.send(text_data=json.dumps(message))

    async def leave_room(self, status):
        player = self.player
        await self.update_game_room(self.room, player, status)

    @database_sync_to_async
    def get_game_room(self):
        from .models import GameRoom
        game_room = GameRoom.objects.filter(Q(player1=self.player) | Q(player2=self.player)).first()
        return game_room

    @sync_to_async
    def update_game_room(self, game_room, player, status):
        if status in ["game_over", "game_canceled"]:
            game_room.delete()
            game_state_manager.remove_game_state(self.room_id)
            print(f"ALL SHIT IS DELETD with status : {status}")
            return
        elif game_room.player1 == player:
            game_room.player1 = None
        elif game_room.player2 == player:
            game_room.player2 = None
        if not game_room.player1 and not game_room.player2: 
            game_room.delete()
            game_state_manager.remove_game_state(self.room_id)
        else:
            game_room.save()