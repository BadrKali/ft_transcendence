import json
from channels.generic.websocket import AsyncWebsocketConsumer
from authentication .models import User
from channels.db import database_sync_to_async
from asgiref.sync import sync_to_async
from asgiref.sync import async_to_sync
from chat.models import message
from .Serializers import __messageSerializer__ ,__user_serializer__
from django.core.exceptions import ObjectDoesNotExist
from dateutil.parser import parse
from django.utils import timezone
from django.db.models import Q


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        if self.scope['user'].is_anonymous:
            await self.close()
        self.sender_id = self.scope['user'].id
        self.room_group_name = f'room_{self.sender_id}'
        await (self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, __quitcode__):
        await (self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
        ))

    async def receive(self, text_data=None):
        self.extracted_msg = json.loads(text_data)

        # 2 cases already Existing ChatList - Create new Conversation !
        if (self.extracted_msg.get('type') == '_start_chat_'):
            await self.start_chat()
        
        if (self.extracted_msg.get('type') == 'Update_msgStatus'):
            await self.update_unique_msg_status()
        
        if (self.extracted_msg.get('type') == '_mark_msgs_asRead_'):
            await self.processRead_Event(self.sender_id, self.extracted_msg.get('messageData').get('With'))
        # add if users are blocked or not !
        if (self.extracted_msg.get('type') == 'newchat.message'):
            await self.Broadcast_newMsg()
    async def start_chat(self):
        Isconversation_exist = await self.get_record_if_exist()
        if (Isconversation_exist):
            await self.channel_layer.group_send(
            f"room_{self.sender_id}",{
                  'type': 'Pick_existed_conv',
                  'message': self.extracted_msg.get('messageData')
            }
            )
        else:
            print('=-=-=- We never Talked=-=-=-')
    
    async def Pick_existed_conv(self, event):
        await (self.send( text_data=json.dumps(event) ))
        
    @database_sync_to_async
    def get_record_if_exist(self):
        profil_Id = self.extracted_msg.get('messageData').get('user_id')
        print('Profil user_id is :' +  str(profil_Id) + 'requester :' + str(self.sender_id))
        totalRecord = message.objects.filter((Q(sender_id=profil_Id) & Q(receiver_id=self.sender_id)) |
                                      (Q(sender_id=self.sender_id) & Q(receiver_id=profil_Id))).count()
        if (totalRecord):
            return True
        return False

    async def processRead_Event(self, currentUserId, FriendUsername):
        try:
            FriendId = await self.get_user_id(FriendUsername)
        except ObjectDoesNotExist:
            print(f"User with username {FriendUsername} does not exist")
        # all records where friendId is the sender and I'm the receiver !
        await self.update_messages(FriendId, currentUserId)

        await self.channel_layer.group_send(
          f"room_{currentUserId}",{
                  'type': 'msgs.areReaded',
                  'message': {
                        "all_readed_From" : FriendUsername
                  }
           }
        )
    
    async def Broadcast_newMsg(self):
        self.receiver_id = self.extracted_msg.get('messageData').get('receiver_id')
        await self.save_to_db();
        try :
            await (self.channel_layer.group_send)(
            f'room_{self.receiver_id}',{
                'type': 'newchat.message',
                'message': self.extracted_msg.get('messageData')
            }
            )
            if (self.receiver_id != self.extracted_msg.get('messageData').get('sender_id')):
                await (self.channel_layer.group_send)(
                f"room_{self.extracted_msg.get('messageData').get('sender_id')}",{
                        'type': 'newchat.message',
                        'message': self.extracted_msg.get('messageData')
                 }
                )
                await (self.channel_layer.group_send)(
                    f"room_{self.extracted_msg.get('messageData').get('sender_id')}",{
                          'type': 'last.message',
                        'message': self.extracted_msg.get('messageData')
                    }
                )
        # Trigger event last Message !
            await (self.channel_layer.group_send)(
            f'room_{self.receiver_id}',{
                'type': 'last.message',
                'message': self.extracted_msg.get('messageData')
            }
            )
        except Exception as e:
            print(f"An error occurred: {e}")
    

    @database_sync_to_async
    def get_user_id(self, username):
        return User.objects.get(username=username).id
    
    @database_sync_to_async
    def update_messages(self, sender_id, receiver_id):
        allrecord = message.objects.filter(sender_id=sender_id, receiver_id=receiver_id, seen=False)
        allrecord.update(seen=True)

    @database_sync_to_async
    def update_unique_msg_status(self):
        self.msgcontent = self.extracted_msg.get('messageData').get('content')
        self.createdAt  = self.extracted_msg.get('messageData').get('created_at')
        created_at = parse(self.createdAt)
        created_at = created_at.replace(microsecond=0)
        requiredMsg = message.objects.filter(content=self.msgcontent, created_at__second=created_at.second)
        requiredMsg.update(seen=True)
        print(requiredMsg)


    async def msgs_areReaded(self, event):
        await (self.send( text_data=json.dumps(event) ))
        
    async def newchat_message(self, event):
        await (self.send(
            text_data=json.dumps(event) ))
        

    async def last_message(self, event):
        await (self.send(
            text_data=json.dumps(event) ))
        
    @database_sync_to_async
    def save_to_db(self):
        self.msgDetails = self.extracted_msg.get('messageData')
        Usersender = User.objects.get(id=self.msgDetails.get('sender_id'))
        UserReceiver = User.objects.get(id=self.msgDetails.get('receiver_id'))
        message.objects.create(
                           sender_id=Usersender,
                           receiver_id = UserReceiver,
                           content= self.msgDetails.get('content'),
                           seen = self.msgDetails.get('seen'),
                           created_at=self.msgDetails.get('created_at')
                        )