from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import message
from .Serializers import __messageSerializer__ ,__user_serializer__
from django.db.models import Q
from django.conf import settings
from authentication .models import User
from authentication .serializers import CurrentUserSerializer
# Create your views here.

def format_date(date)-> str:
    minute = {True:date.minute , False: f'0{date.minute}'} [date.minute >= 10]
    return f'{date.hour}:{minute}'

@api_view(['GET'])
def RetreiveContacts(request):
    Mycontacts = message.objects.filter(Q(sender_id=request.user.id) | Q(receiver_id=request.user.id));
    serializers = __messageSerializer__(Mycontacts, many=True)
    evaluatedData = serializers.data
    contactIDs = {elem.get('receiver_id') if elem.get('receiver_id') != request.user.id else elem.get('sender_id') for elem in evaluatedData}
    contacts = User.objects.filter(id__in=contactIDs)
    ContactSerializer = __user_serializer__(contacts, many=True)
    ChatList = [{ **contact,
                  "unreadMessages": message.UnreadMessageBeetwen(request.user.id, contact.get("id")),
                  "lastMessage": message.getLastMessage(request.user.id, contact.get("id")).content,
                  "lastTime": format_date(message.getLastMessage(request.user.id, contact.get("id")).created_at),
                  "status": message.GetUserStatus(contact.get("id"))
                } for contact in ContactSerializer.data 
                ]
    return Response(ChatList)
# I may should Sort conversation using created att when Displaying it on frontend! 

# username is the target 


@api_view(['GET'])
def getMessageswith (request, username):
    current_user = request.user
    chat_partner = User.objects.get(username=username)

    allRecords = message.objects.\
        select_related('sender_id', 'receiver_id').\
        filter((Q(sender_id__username=request.user.username) & Q(receiver_id__username=username)) |
               (Q(sender_id__username=username) & Q(receiver_id__username=request.user.username))).order_by('created_at')
    serialiser = __messageSerializer__(allRecords, many=True)
    OurMessages = [{**Singlemessage, "msg_type": "outgoing" if Singlemessage.get('sender_id') == request.user.id else "incoming",
                    "currentUserAvatar": current_user.avatar.url if current_user.avatar else None,
                    "chatPartnerAvatar": chat_partner.avatar.url if chat_partner.avatar else None
                    }
                      for Singlemessage in serialiser.data]
    return Response(OurMessages)

