from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from channels.db import database_sync_to_async
import json
import asyncio
import math
from django.db.models import Q
import time
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from asyncio import create_task, TimeoutError

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
                'speed': 5,
                'color': "WHITE"
            },
            'net': {
                'x': (1384 - 2) / 2,
                'y': 0,
                'height': 10,
                'width': 2,
                'color': "#2C3143"
            },
            'players': {},
            'game_over': False,
            'game_running': True,
            'keep_running': True,
            'game_started': False,
            'match_data': False,
            'player_connects': False,
        }
        self.player_canvas_sizes = {}
        self.player_movement_states = {}
        self.last_update_time = time.time()

    async def get_player_connects(self):
        return self.state['player_connects']

    async def update_player_connects(self, status):
        print("update_player_connects")
        self.state['player_connects'] = status
    
    async def get_match_data(self):
        return self.state['match_data']

    async def update_match_data(self, status):
        self.state['match_data'] = status 

    async def get_game_started(self):
        return self.state['game_started']

    async def update_game_started(self, status):
        self.state['game_started'] = status
    
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
            if player['score'] >= 11:
                self.state['game_over'] = True
                self.state['winner'] = player['username']
                return True
        return False

    def get_winner_loser(self):
        try:
            players = list(self.state['players'].values())
            if len(players) != 2:
                return None, None
            player1, player2 = players
            if not isinstance(player1.get('score'), (int, float)) or not isinstance(player2.get('score'), (int, float)):
                return None, None
            if player1['score'] > player2['score']:
                return player1.get('username'), player2.get('username')
            elif player2['score'] > player1['score']:
                return player2.get('username'), player1.get('username')
            else:
                return None, None
        except KeyError as e:
            pass
        except Exception as e:
            pass
        return None, None 

    def winner_score(self, winner):
        return self.state['players'][winner]['score']

    def loser_score(self, loser):
        return self.state['players'][loser]['score']

    async def add_player_for_tournament(self, username1, username2, game_setting1, game_setting2):
        try :
            player1 = {
                'username': username1,
                'id': 1,
                'score': 0,
                'x': 20,
                'y': (self.state['canvas']['height'] - 140) / 2,
                'width': 10,
                'height': 140,
                'color': game_setting1.paddle if game_setting1 else 'WHITE',
                'disconnect': 0,
                'status': True,
            }
            player2 = { 
                'username': username2,
                'id': 2,
                'score': 0,
                'x': self.state['canvas']['width'] - 30,
                'y': (self.state['canvas']['height'] - 140) / 2,
                'width': 10,
                'height': 140,
                'color': game_setting2.paddle if game_setting2 else 'WHITE', 
                'disconnect': 0,
                'status': True,
            } 
            self.state['players'][username1] = player1
            self.state['players'][username2] = player2
        except Exception as e:
            print(e)
            return
 
    async def add_player(self, username, room):
        try :
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
                'disconnect': 0,
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
                'disconnect': 0,
                'status': True,
            } 
            self.state['players'][player1_username] = player1
            self.state['players'][player2_username] = player2
        except Exception as e:
            print(e)
            return

    async def reconnect_player(self, username, room): 
        player = self.state['players'][username]
        player['status'] = True
    
    async def get_game_players_status(self):
        players = self.state['players']
        player_statuses = {}
        for username, player in players.items():
            player_statuses[username] = player['status']
        return player_statuses

    async def update_player_status(self, username, status):
        if username not in self.state['players']:
            print(f"Error: Username {username} not found in players")
            return
        print(f"Updating player status: {username}, {status}")
        player = self.state['players'][username]
        player['status'] = status
        print(f"Player status updated: {self.state['players']}")

    async def get_self_player_status(self, username):
        return self.state['players'][username]["status"]

    async def get_players_status(self):
        players = self.state['players']
        player1 = list(players.values())[0]
        player2 = list(players.values())[1]
        player1_status = player1['status']
        player2_status = player2['status']
        if player1_status and player2_status:
            await self.update_game_started(False)
            return True
        else:
            return False

    async def get_player_username(self, player):
        return await sync_to_async(lambda: player.user.username)()

    async def get_player_settings(self, player):
        from .models import GameSettings
        try:
            return await sync_to_async(lambda: GameSettings.objects.filter(user=player).first())()
        except Exception as e:
            print(e)
 
    def player_mouvement(self, user, direction, canvas_size):
        if user in self.state['players']:
            self.player_canvas_sizes[user] = canvas_size
            if direction == 'stop':
                self.player_movement_states.pop(user, None)
            else:
                self.player_movement_states[user] = direction
 
    def update_player_positions(self):  
        current_time = time.time()
        delta_time = current_time - self.last_update_time
        self.last_update_time = current_time

        for user, direction in self.player_movement_states.items():
            if user in self.state['players']:
                player = self.state['players'][user]
                canvas_size = self.player_canvas_sizes.get(user, {'height': self.state['canvas']['height']})
                
                move_amount = 300 * (canvas_size['height'] / self.state['canvas']['height']) * delta_time

                if direction == "up":
                    player['y'] = max(0, player['y'] - move_amount)
                elif direction == "down":
                    player['y'] = min(self.state['canvas']['height'] - player['height'], player['y'] + move_amount)

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

    def get_state(self):
        return self.state

    def to_json(self):
        return json.dumps(self.state)
    def update_game_state(self):
        self.update_player_positions()
        self.update_ball_position()
    async def check_game_over(self):
        print("heloo from check players")
        player_statuses = await self.get_game_players_status()
        print("heloo from check players 2")
        print(f"{player_statuses}")
        if all(status == False for status in player_statuses.values()):
            print("heloo from check players 3")
            return True
        return False

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
            self.reconnection_task = None
            self.player = await self.get_player(self.scope['user'])
            self.keep_running = True
            self.room_name = None
            self.room_group_name = None
            self.game_state = None
            self.room = None
            self.room_id = None
            self.game_mode = None
            await self.accept()
            asyncio.sleep(3)
            await self.send(text_data=json.dumps({
                'action': 'connected',
                'message': 'Connection established',
            }))

    async def disconnect(self, close_code):
        from user_management.models import TournamentParticipants
        player_str = await self.get_player_str()
        self.game_state.update_game_running(False)
        is_game_over = await self.game_state.get_game_over()
        is_game_started = await self.game_state.get_game_started()
        player_connects = await self.game_state.get_player_connects()
        if self.reconnection_task and not self.reconnection_task.done():
            self.reconnection_task.cancel()
            try:
                await self.reconnection_task
            except asyncio.CancelledError:
                return
        if is_game_over:
            await self.leave_room("game_over")
            return
        if not player_connects and not is_game_started:
            await self.left_before_launch()
            await self.leave_room("game_canceled")
            return
        if not is_game_started:
            await self.leave_room("game_canceled")
            return
        elif self.game_state.remove_player(player_str):
            current_player_username = await self.game_state.get_player_username(self.player)
            opponent_username = next(
                username for username in self.game_state.state['players'].keys() 
                if username != current_player_username
            )
            await self.update_xp_and_save_history(opponent_username, current_player_username, self.room)
            await self.channel_layer.group_send(
                self.room_group_name,{
                    'type': 'send_message',
                    'message': {
                        'action': 'game_canceled',
                        'winner': opponent_username,
                        'game_state': self.game_state.get_state(),
                    }
                }
            )
            await self.leave_room("game_canceled")
            return
        else:
            await self.updating_status()
            if await self.game_state.check_game_over():
                await self.leave_room("game_canceled")
                return
            print("hello2")
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'send_message',
                    'message': {'action': 'opponent_disconnected'},
                }
            )
            return

    async def updating_status(self):
        player = self.get_player_str()
        await self.game_state.update_player_status(player, False)

    @database_sync_to_async
    def get_user_id(self, player_str):
        from user_management.models import Player
        player = Player.objects.get(user__username=player_str)
        return player.user.id

    async def assign_tournament_match(self):
        from .models import TournamentGameRoom
        from user_management.models import TournamentParticipants
        game_over = await self.game_state.get_game_over()
        if game_over:
            tournament_obj = await sync_to_async(
                lambda: TournamentParticipants.objects.filter(
                    Q(player1=self.player) | Q(player2=self.player)
                ).first()
            )()
            if tournament_obj:
                tournament_obj.assign_winner()
            else:
                print("tournament_obj not found") 
                return
            await self.leave_room("game_over")
            
    async def receive(self, text_data):
        data = json.loads(text_data)
        action = data.get('action')
        if action == "random":
            self.game_mode = action
            await self.handle_random_action()
        elif action == "invite":
            self.game_mode = action
            await self.handle_invite_action()
        elif action == "invite-game-reconnection":
            self.game_mode = "invite"
            await self.handle_invite_reconnection()
        elif action == "tournament":
            self.game_mode = action
            await self.handle_tournament_action()
        elif action == "player_movement":
            if self.game_state:
                username = data.get('user')
                direction = data.get('direction')
                canvas_size = data.get('canvasSize')
                self.game_state.player_mouvement(username, direction, canvas_size)
        elif action == "got_it":
            if self.reconnection_task and not self.reconnection_task.done():
                self.reconnection_task.cancel()
                await self.game_state.update_game_started(False)
                try:
                    await self.reconnection_task
                except asyncio.CancelledError:
                    return
            match_status = await self.game_state.get_game_started()
            if not match_status:
                await self.game_state.update_game_started(True)
                asyncio.create_task(self.start_game_loop(self.room))
        elif action == "im_waiting":
            room = self.get_game_room()
            self.reconnection_task = create_task(self.waiting_for_reconnection(room))

    async def left_before_launch(self):
        current_player_username = await self.game_state.get_player_username(self.player)
        opponent_username = next(
            username for username in self.game_state.state['players'].keys() 
            if username != current_player_username
        )
        await self.update_xp_and_save_history(opponent_username, current_player_username, self.room)
        await self.channel_layer.group_send(
            self.room_group_name,{
                'type': 'send_message',
                'message': {
                    'action': 'game_canceled_befor_launch',
                }
            }
        )
    
    async def waiting_for_reconnection(self, room):
        from .models import GameRoom, InviteGameRoom, TournamentGameRoom
        if self.game_mode == "random":
            room = await sync_to_async(
                lambda: GameRoom.objects.filter(
                        Q(player1=self.player) | Q(player2=self.player)
                ).first()
            )()
        elif self.game_mode == "invite":
            room = await sync_to_async(
                lambda: InviteGameRoom.objects.filter(
                        Q(player1=self.player) | Q(player2=self.player)
                ).first()
            )() 
        elif self.game_mode == "tournament":
            room = await sync_to_async(
                lambda: TournamentGameRoom.objects.filter(
                        Q(player1=self.player) | Q(player2=self.player)
                ).first()
            )()
        timeout = 15
        interval = 1 
        total_time_waited = 0
        winner = await self.game_state.get_player_username(self.player)
        current_player_username = await self.game_state.get_player_username(self.player)
        opponent_username = next(
            username for username in self.game_state.state['players'].keys() 
            if username != winner 
        )
        if self.game_mode != "tournament":
            while total_time_waited < timeout:
                if await self.game_state.get_players_status():
                    return
                await asyncio.sleep(interval)
                total_time_waited += interval
        await self.update_xp_and_save_history(winner, opponent_username, room)
        await self.send(text_data=json.dumps({
            'action': 'you_won',
            'winner': winner
        }))

    async def handle_invite_reconnection(self):
        player_str = await self.get_player_str()
        invite_game_room = await self.check_for_invite_reconnection(player_str)
        if invite_game_room:
            self.room = invite_game_room
            self.room_name = f"game_room_{invite_game_room.id}"
            self.room_id = invite_game_room.id
            self.room_group_name = self.room_name
            await self.channel_layer.group_add(self.room_group_name, self.channel_name)
            self.game_state = game_state_manager.get_or_create_game_state(self.room_id)
            await self.game_state.reconnect_player(player_str, invite_game_room)
            await self.notify_reconnection(player_str, invite_game_room)
            await self.send_reconnection_info(invite_game_room)


    @database_sync_to_async
    def delete_room(self):
        room = self.get_game_room()
        self.room.delete()

    def send_winner_message(self, event): 
        self.send(text_data=json.dumps(event['message']))

    async def handle_invite_action(self):
        from .models import InviteGameRoom
        try:
            invite_game_room = await sync_to_async(
                lambda: InviteGameRoom.objects.filter(
                    Q(player1=self.player) | Q(player2=self.player)
                ).first()
            )()
            if invite_game_room:
                self.room = invite_game_room
                self.room_name = f"game_room_{invite_game_room.id}"
                self.room_id = invite_game_room.id
                self.room_group_name = self.room_name
                await self.channel_layer.group_add(self.room_group_name, self.channel_name)
                await sync_to_async(invite_game_room.set_player_connected)(self.player)
                await sync_to_async(invite_game_room.check_and_update_status)()
                self.game_state = game_state_manager.get_or_create_game_state(self.room_id)
                if not invite_game_room.is_waiting:
                    self.game_state.update_player_connects(True)
                    await self.game_state.add_player("", invite_game_room)
                    await self.notify_players(invite_game_room)
        except Exception as e:
            return

    async def handle_tournament_action(self):
        from .models import TournamentGameRoom, GameSettings
        try:
            room = await sync_to_async(
                lambda: TournamentGameRoom.objects.filter(
                    Q(player1=self.player) | Q(player2=self.player)
                ).first()
            )()

            if room:
                self.room = room
                self.room_name = f"game_room_{room.id}"
                self.room_id = room.id
                self.room_group_name = self.room_name

                await self.channel_layer.group_add(self.room_group_name, self.channel_name)
                await sync_to_async(room.set_player_connected)(self.player)
                await sync_to_async(room.check_and_update_status)()
                self.game_state = game_state_manager.get_or_create_game_state(self.room_id)
                if not room.is_waiting:
                    game_setting1 = await sync_to_async(lambda: GameSettings.objects.filter(user=room.player1).first())()
                    game_setting2 = await sync_to_async(lambda: GameSettings.objects.filter(user=room.player2).first())()
                    player1_username = await self.game_state.get_player_username(room.player1)
                    player2_username = await self.game_state.get_player_username(room.player2)
                    print(f"player1_username: {player1_username}")
                    print(f"player2_username: {player2_username}")
                    self.game_state.update_player_connects(True)
                    await self.game_state.add_player_for_tournament(player1_username, player2_username, game_setting1, game_setting2)
                    await self.notify_players(room)
            else:
                print(f"No tournament game room found for player {self.player}")
        except Exception as e:
            print(f"Error in handle_tournament_action: {e}")


    async def handle_random_action(self): 
        from .models import GameRoom 
        player_str = await self.get_player_str() 
        room = await self.check_for_random_reconnection(player_str)
        if room:
            self.room = room
            await self.handle_reconnection(player_str, room)
            return
        room = await self.find_or_create_room(player_str)
        self.room = room
        if not room.is_waiting:
            self.game_state.update_player_connects(True)
            await self.game_state.add_player(player_str, room)
            await self.notify_players(room)
        else:
            await self.notify_waiting_player(room)
    
    async def check_for_tournament_reconnection(self, player_str):
        from .models import TournamentGameRoom
        try :
            room = await sync_to_async(
                lambda: TournamentGameRoom.objects.filter(
                    Q(player1=self.player) | Q(player2=self.player)
                ).first()
            )()
            if room:
                self.game_state = game_state_manager.get_or_create_game_state(self.room_id)
                if not self.game_state.get_self_player_status(player_str):
                    self.room_name = f"game_room_{room.id}"
                    self.room_id = room.id
                    self.room_group_name = self.room_name
                    await self.channel_layer.group_add(self.room_group_name, self.channel_name)
                else:
                    return None
            return room if room else None
        except TournamentGameRoom.DoesNotExist:
            return None

    async def check_for_invite_reconnection(self, player_str):
        from .models import InviteGameRoom
        try :
            room = await sync_to_async(
                lambda: InviteGameRoom.objects.filter(
                    Q(player1=self.player) | Q(player2=self.player)
                ).first()
            )()
            if room:
                self.room_name = f"game_room_{room.id}"
                self.room_id = room.id
                self.room_group_name = self.room_name
            return room if room else None
        except InviteGameRoom.DoesNotExist:
            return None

    async def check_for_random_reconnection(self, player_str):
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
        self.game_state.update_player_connects(False)
        frame_duration = 1 / 120
        while self.game_state.get_running():
            start_time = time.time()
            self.game_state.update_game_state()
            if self.game_state.check_winning_condition():
                winner , loser = self.game_state.get_winner_loser()
                await self.game_state.update_game_over(True)
                match_data = await self.game_state.get_match_data()
                if not match_data:
                    await self.update_xp_and_save_history(winner, loser, self.room)
                    await self.game_state.update_match_data(True)
                if self.game_mode == "tournament":
                    print("tournament from start_game_loop")
                    self.assign_tournament_match()
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


    @sync_to_async
    def update_xp_and_save_history(self, winner, loser, room):
        print("hello from update_xp") 
        from user_management.models import Player
        from .models import GameHistory
        from user_management.models import TournamentParticipants, Tournament
        try:
            print("1")
            player1 = room.player1.user.username
            print("2")
            player2 = room.player2.user.username
            print("3")
            if player1 == winner:
                print("4")
                winner_user = room.player1
                print("5")
                loser_user = room.player2
            else:
                print("6")
                winner_user = room.player2
                print("7")
                loser_user = room.player1
            print("8")
            winner_user.update_xp(True)
            print("9")
            loser_user.update_xp(False)
            print("10")
        
            if self.game_mode == "tournament": 
                print("11") 
                print("tournament from update_xp_and_save_history")
                tournament_obj = TournamentParticipants.objects.filter(
                    (Q(player1=self.player.user) & Q(player2=room.player2.user)) |
                    (Q(player2=self.player.user) & Q(player1=room.player1.user))
                ).first()
                if tournament_obj:
                    print(tournament_obj)
                    tournament_obj.assign_winner(winner_user.user, loser_user.user)
                    tournament = Tournament.objects.get(id=tournament_obj.tournament.id)
                    if tournament.tournament_stage != 'FINALS':
                        tournament.level_tournament_to_finals()
                else:
                    print("tournament_obj not found")
                match_type = "tournament"
            else: 
                match_type = "single"

            GameHistory.objects.create(
                winner_user=winner_user,
                loser_user=loser_user,
                winner_score=self.game_state.winner_score(str(winner)),
                loser_score=self.game_state.loser_score(str(loser)),
                game_type='pingpong',
                match_type=match_type
            )
        except Player.DoesNotExist:
            return
        except Exception as e:
            return

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
        await self.channel_layer.group_send(
            self.room_group_name, {
                'type': 'send_message',
                'message': message
            }
        )

    async def send_message(self, event):
        message = event['message']
        await self.send(text_data=json.dumps(message))

    @database_sync_to_async
    def get_game_room(self):
        from .models import GameRoom
        game_room = GameRoom.objects.filter(Q(player1=self.player) | Q(player2=self.player)).first()
        return game_room

    async def leave_room(self, status):
        player = self.player
        await self.update_game_room(self.room, player, status)

    @sync_to_async
    def update_game_room(self, game_room, player, status):
        if status in ["game_over", "game_canceled"]:
            print("game_over")
            game_room.delete()
            game_state_manager.remove_game_state(self.room_id)
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