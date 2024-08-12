from django.db import models
from django.conf import settings
# Create your models here.
from django.core.exceptions import ValidationError
from django.shortcuts import get_object_or_404

def user_avatar_upload_path(instance, filename):
    return f"player/{instance.id}/user_avatar/{filename}"

class Player(models.Model):
    PLAYER_RANK_BRONZE = 'BRONZE'
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
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, primary_key=True)

    def __str__(self) -> str:
        return self.user.username

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



class Notification(models.Model):
    recipient = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notifications')
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='sent_notifications')
    message = models.TextField()
    title = models.TextField(default='No description provided')
    description = models.TextField(default='No description provided')
    timestamp = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return f'Notification from {self.sender} to {self.recipient}'

class Friendship(models.Model):
    player = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='friendships', on_delete=models.CASCADE)
    friend = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='friends_with', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    blocked = models.BooleanField(default=False)

    class Meta:
        unique_together = ('player', 'friend')

    def __str__(self) -> str:
        return f"{self.player.username} is friends with {self.friend.username}"

    def clean(self):
        if self.player == self.friend:
            raise ValidationError("A player cannot be friends with themselves.")
        
    # def save(self, *args, **kwargs):
    #     super().save(*args, **kwargs)
    #     if not Friendship.objects.filter(player=self.friend, friend=self.player).exists():
    #         Friendship.objects.create(player=self.friend, friend=self.player)

    def delete(self, *args, **kwargs):
        super().delete(*args, **kwargs)
        Friendship.objects.filter(player=self.friend, friend=self.player).delete()

    def __str__(self):
        return f"{self.player.username} is friends with {self.friend.username}"
    

class BlockedUsers(models.Model):
    blocker = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='blocker_user', on_delete=models.CASCADE)
    blocked = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='blocked_user', on_delete=models.CASCADE)
    blocked_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('blocker', 'blocked')

    def __str__(self):
        return f"{self.blocker} blocked {self.blocked}"


class Tournament(models.Model):
    tournament_creator = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    tournament_name = models.CharField(max_length=100)
    tournament_prize = models.IntegerField(default=0) # khas n3amerha 3la 7ssab kola user dert haka gha for testing
    tournament_map = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True) 
    tournament_date = models.DateTimeField(auto_now_add=True) # hadi f ina date tournament hadi khasha t3awerd
    tournament_status = models.BooleanField(default=False) # hadi ghadi tbadelha b True lma ykono les places kamline
    tournament_stage = models.CharField(max_length=100) # hadi f ina stage wasla tournament

    def __str__(self):
        return self.tournament_name


class TournamentInvitation(models.Model):
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE)
    player = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    invitation_status = models.BooleanField(default=False)
    invitation_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.player} invited to {self.tournament}"

class TournamentParticipants(models.Model):
    pass
