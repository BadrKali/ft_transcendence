import json
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from authentication .models import User
from channels.db import database_sync_to_async
from chat.models import message

class ChatConsumer(WebsocketConsumer):
    def connect(self):
        self.sender_id = self.scope['user'].id
        self.room_name = None
        self.accept()

    def disconnect(self, __quitcode__):
        if (self.room_name):
            async_to_sync(self.channel_layer.group_discard(
                self.room_name,
                self.channel_name
            ))

    def receive(self, text_data=None):
        self.extracted_msg = json.loads(text_data)
        self.receiver_id = self.extracted_msg.get('receiver_id')
        self.room_name = f'chat_{min(self.sender_id, self.receiver_id)}_{max(self.sender_id, self.receiver_id)}'
        print( str(self.scope['user'].id) + " > " + self.room_name)
        async_to_sync(self.channel_layer.group_add)(
            self.room_name,
            self.channel_name
        )
        
        self.save_to_db();
        async_to_sync(self.channel_layer.group_send)(
            self.room_name,{
                'type': 'chat.message',
                'message': self.extracted_msg
            }
        )

    def chat_message(self, event):
        async_to_sync(self.send(
            text_data=json.dumps(event['message']) ))
    
    def save_to_db(self):
        Usersender = User.objects.get(id=self.extracted_msg.get('sender_id'))
        UserReceiver = User.objects.get(id=self.extracted_msg.get('receiver_id'))
        message.objects.create(
                           sender_id=Usersender,
                           receiver_id = UserReceiver,
                           content= self.extracted_msg.get('content'),
                           seen = self.extracted_msg.get('seen'),
                           created_at=self.extracted_msg.get('created_at')
                        )