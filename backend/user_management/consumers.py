from channels.generic.websocket import AsyncWebsocketConsumer
import json
class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        if self.scope['user'].is_anonymous:
            await self.close()
        else:
            self.user = self.scope['user']
            self.room_group_name = f'notifications_{self.user.id}'
            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )
            await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, content):
        message = content['message']
        await self.send(text_data=json.dumps({
            'message': message
        }))

    async def notification_message(self, event):
        message = event['message']
        await self.send(text_data=json.dumps({
            'message': message
        }))

class EchoConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        if self.scope['user'].is_anonymous:
            await self.close()
        else:
            await self.accept()
            
            print(f"User connected: {self.scope['user']}")

    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data):
        print(text_data)
        await self.send(text_data=json.dumps({
            'message': text_data
        }))
