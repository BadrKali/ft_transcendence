# chat/consumers.py

import json
from channels.generic.websocket import WebsocketConsumer

class ChatConsumer(WebsocketConsumer):
    def connect(self):
        super().connect()
        self.send(text_data=json.dumps({
            'type'   : 'connection_established',
            'message' : 'Yo are connected welcome !'
        }))
        
    def disconnect(self):
        pass
    def receive(self):
        pass