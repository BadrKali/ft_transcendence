from rest_framework import serializers
from .models import message
from django.conf import settings
from django.db import models
from authentication .models import User

class __user_serializer__(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'avatar', 'username']

class __messageSerializer__(serializers.ModelSerializer):
    # sender_id = __user_serializer__();
    # receiver_id = __user_serializer__();
    class Meta:
        model  = message
        fields = ['id', 'sender_id', 'receiver_id', 'content', 'seen', 'created_at']
