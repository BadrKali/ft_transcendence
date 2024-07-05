from channels.generic.websocket import AsyncWebsocketConsumer
import json

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
