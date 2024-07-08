from django.db import models
from django.conf import settings
# Create your models here.
from django.core.exceptions import ValidationError
from django.shortcuts import get_object_or_404

def user_avatar_upload_path(instance, filename):
    return f"player/{instance.id}/user_avatar/{filename}"

class Player(models.Model):
    PLAYER_RANK_BRONZE = 'B'
    PLAYER_FIRST_RANK_PROGRESS = 0
    PLAYER_FIRST_GAMES_PLAYED = 0
    PLAYER_FIRST_GAMES_WON = 0
    PLAYER_FIRST_GAMES_XP = 0


    rank = models.CharField(max_length=1,default=PLAYER_RANK_BRONZE)
    rank_progress = models.DecimalField(max_digits=5, decimal_places=2, default=PLAYER_FIRST_RANK_PROGRESS)
    games_played = models.IntegerField(default=PLAYER_FIRST_GAMES_PLAYED)
    games_won = models.IntegerField(default=PLAYER_FIRST_GAMES_WON)
    xp = models.IntegerField(default=PLAYER_FIRST_GAMES_XP)
    updated_at = models.DateTimeField(auto_now=True)
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE )

    def __str__(self) -> str:
        return self.user.username
    
    def save(self, *args, **kwargs):
        if self.id:
            existing = get_object_or_404(Player, id=self.id)
            if existing.avatar != self.avatar:
                existing.avatar.delete(save=False)
        super(Player, self).save(*args, **kwargs)
    def category_delete_files(sender, instance, **kwargs):
        for field in instance._meta.fields:
            if field.name == "avatar":
                file = getattr(instance, field.name)
                if file:
                    file.delete(save=False)
                    



class FriendInvitation(models.Model):
    INVITATION_CHOICES = [
        ('A', 'ACCEPTED'),
        ('P', 'PENDING'),
        ('D', 'DECLINED')
    ]
    player_sender = models.ForeignKey(settings.AUTH_USER_MODEL,related_name='sent_invitations', on_delete=models.CASCADE)
    player_receiver = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='receive_invitations',on_delete=models.CASCADE)
    invite_status = models.CharField(max_length=1,choices=INVITATION_CHOICES, default='P')
    send_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ["player_sender", "player_receiver"]

    def __str__(self) -> str:
        return f"invitation from {self.player_sender.username} to {self.player_receiver.username} - status : {self.invite_status}"
    
    def save(self, *args, **kwargs):
        if self.player_sender == self.player_receiver:
            raise ValidationError("A Player cannot send an invitation to themselves")
        super().save(*args, **kwargs)


class Notifications(models.Model):
    to_player = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='to_player' ,on_delete=models.CASCADE)
    type = models.CharField(max_length=100)
    notification_link = models.URLField(max_length=200)
    # isRead = check what is is for
    date_sent = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"notification sent to {self.to_player.username}"
    
class Friendship(models.Model):
    player = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='friendships', on_delete=models.CASCADE)
    friend = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='friends_with', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    blocked = models.BooleanField(default=False)

    class Meta:
        unique_together = ('player', 'friend')

    def clean(self):
        if self.player == self.friend:
            raise ValidationError("A player cannot be friends with themselves.")
        
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if not Friendship.objects.filter(player=self.friend, friend=self.player).exists():
            Friendship.objects.create(player=self.friend, friend=self.player)

    def delete(self, *args, **kwargs):
        super().delete(*args, **kwargs)
        Friendship.objects.filter(player=self.friend, friend=self.player).delete()
        
    def __str__(self):
        return f"{self.player.username} is friends with {self.friend.username}"
    

