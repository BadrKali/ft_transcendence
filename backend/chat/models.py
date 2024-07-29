from django.db import models
from django.conf import settings
from django.db.models import Q

# Create your models here.
class message(models.Model):
    sender_id = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='message_sender', on_delete=models.CASCADE)
    receiver_id = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='message_receiver', on_delete=models.CASCADE)
    content = models.TextField(null=False)
    seen = models.BooleanField(default=False)
    created_at =models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f'from : {self.sender_id} to {self.receiver_id}'
    class Meta:
        ordering = ['-created_at']

    def GetUnreadmessages(currentUserId):
        return message.objects.filter(receiver_id=currentUserId, seen=False)

    def UnreadMessageBeetwen( currentUserID, user2_Id):
        return message.objects.filter(receiver_id=currentUserID, sender_id=user2_Id, seen=False).count()
    
    def getLastMessage(currentUserId, user2_Id):
        return message.objects.filter((Q(sender_id=currentUserId) & Q(receiver_id=user2_Id)) |
                                      (Q(sender_id=user2_Id) & Q(receiver_id=currentUserId))).order_by('-created_at').first()
        # .order_by('-created_at').first().content
# Funniest Implementation ever
# class ChatRoom(models.Model):
#     Messages = ArrayField(
#         models.ForeignKey( message, on_delete=models.CASCADE),
#         default=[]
#     )
# class Conversation(models.Model):
#     first_user  = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='first_member', on_delete=models.CASCADE)
#     second_user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='second_member', on_delete=models.CASCADE)
#     chatRoom_id = models.OneToOneField(ChatRoom, related_name='roomId', on_delete=models.PROTECT, null=True)
#     created_at  = models.DateTimeField(auto_now_add=True)
#     def __str__(self) -> str:
#         return f'beetwen : {self.first_user} And {self.second_user}'
#     class Meta:
#         unique_together = ['first_user', 'second_user']