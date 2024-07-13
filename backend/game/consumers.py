from asgiref.sync import sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
import json
from .models import GameRoom

class TestConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.channel_layer.group_add("achievements_group", self.channel_name)
        await self.accept()
        await self.send(text_data=json.dumps({
            'message': 'WebSocket connection established!'
        }))
    
    async def disconnect(self, close_code):
        await self.channel_layer.group_discard("achievements_group", self.channel_name)
        pass

    async def receive(self, text_data):
        pass
    async def send_achievement(self, event):
        achievement = event["achievement"]
        await self.send(text_data=json.dumps({
            "achievement": achievement
        }))

class GameConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope['user']
        await self.accept()

    async def disconnect(self, close_code):
        pass 

    async def receive(self, text_data):
        data = json.loads(text_data)
        action = data.get('action')
        if action == 'random':
            await self.handle_random_mode()

    async def handle_random_mode(self):
        room = await sync_to_async(self.find_or_create_room)()
        if room.player1 == self.user:
            await self.send(text_data=json.dumps({
                'message': 'Waiting for another player...'
            }))
        else:
            await self.channel_layer.group_send(
                f"room_{room.id}",
                {
                    'type': 'start_game',
                    'room_id': room.id
                }
            )

    @sync_to_async
    def find_or_create_room(self):
        room = GameRoom.objects.filter(is_waiting=True).first()
        if room:
            room.player2 = self.user
            room.is_waiting = False
            room.save()
        else:
            room = GameRoom.objects.create(player1=self.user)
        return room

    async def start_game(self, event):
        room_id = event['room_id']
        await self.send(text_data=json.dumps({
            'action': 'start_game',
            'room_id': room_id,
        }))
