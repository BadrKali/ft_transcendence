from asgiref.sync import sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
import json
import logging

logger = logging.getLogger(__name__)

class GameConsumer(AsyncWebsocketConsumer):
    async def connect(self):
       self.user = self.scope['user']
       print("tconnectinaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
       await self.accept()

    async def disconnect(self, close_code):
        print("hello bb")
        pass 

    async def receive(self, text_data):
        data = json.loads(text_data)
        # action = data.get('action')
        # if action == 'random':
        #     await self.handle_random_mode()

    # async def handle_random_mode(self):
    #     room = await sync_to_async(self.find_or_create_room)()
    #     if room.player1 == self.user:
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
    #         player = Player.objects.get(user_id=self.scope['user'].id)
    #     except Player.DoesNotExist:
    #         print("No player with that name exists")
    #         pass
    #     player = Player.objects.get(user_id=self.user.id)
    #     room = GameRoom.objects.filter(is_waiting=True).first()
    #     if room:
    #         room.player2 = self.user
    #         room.is_waiting = False
    #         room.save()
    #     else:
    #         room = GameRoom.objects.create(player1=player, is_waiting=True)
    #     return room

    # async def start_game(self, event):
    #     room_id = event['room_id']
    #     await self.send(text_data=json.dumps({
    #         'action': 'start_game',
    #         'room_id': room_id,
    #     }))
