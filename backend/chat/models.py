from django.db import models
from django.conf import settings
from authentication.models import User
from django.db.models import F

# Create your models here.

class Message(models.Model):
    TEXT = 'T'
    IMAGE = 'IMG'

    messsage_types = [
        (TEXT, 'TEXT'),
        (IMAGE, 'IMAGE')
    ]
    sender_id = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='message_sender', on_delete=models.CASCADE)
    receiver_id = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='message_receiver', on_delete=models.CASCADE)
    content = models.TextField(null=False)
    content_type = models.CharField(max_length=3, choices=messsage_types)
    seen = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self) -> str:
        return f'from : {self.sender_id} to {self.receiver_id}'
    class Meta:
        ordering = ['-created_at']

