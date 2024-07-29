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
    minute = {True:date.minute , False: f'0{date.minute}'} [date.minute > 10]
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
                  "unreadMessages": message.UnreadMessageBeetwen(request.user.id, contact["id"]),
                  "lastMessage": message.getLastMessage(request.user.id, contact["id"]).content,
                  "lastTime": format_date(message.getLastMessage(request.user.id, contact["id"]).created_at),
                } for contact in ContactSerializer.data 
                ]
    return Response(ChatList)
