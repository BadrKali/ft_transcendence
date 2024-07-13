from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError
from user_management.models import Player
from authentication.models import User

def achievment_image_upload_path(instance, filename):
    return f"Achievments/{filename}"

class GameHistory(models.Model):
    GAME_TYPES = [
        ('pingpong', 'Ping Pong'),
        ('xo', 'XO'),
    ]
    
    MATCH_TYPES = [
        ('single', 'Single Match'),
        ('tournament', 'Tournament Match'),
    ]
    
    winner_user = models.ForeignKey(
        Player,
        related_name='won_games',
        on_delete=models.CASCADE
    )
    loser_user = models.ForeignKey(
        Player,
        related_name='lost_games',
        on_delete=models.CASCADE
    )
    winner_score = models.IntegerField()
    loser_score = models.IntegerField()
    game_type = models.CharField(max_length=20, choices=GAME_TYPES)
    match_type = models.CharField(max_length=20, choices=MATCH_TYPES)
    played_at = models.DateTimeField(auto_now_add=True)
    
    # def clean(self):
    #     if self.winner_user == self.loser_user:
    #         raise ValidationError("A player cannot play a game against themselves.")
        
    def __str__(self):
        return f"{self.winner_user} vs {self.loser_user}"

class Achievement(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    image = models.ImageField(upload_to=achievment_image_upload_path)
    task = models.TextField()

    def __str__(self):
        return self.title

class PlayerAchievement(models.Model):
    player = models.ForeignKey(Player, on_delete=models.CASCADE)
    achievement = models.ForeignKey(Achievement, on_delete=models.CASCADE)
    achieved_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.player} - {self.achievement.title}"

class GameSettings(models.Model):
    user = models.ForeignKey(Player, on_delete=models.CASCADE, blank=True, null=True)
    background = models.CharField(max_length=255)
    paddle = models.CharField(max_length=255)
    keys = models.CharField(max_length=255, null=True)
    gameMode = models.CharField(max_length=255, default="flesh")
    def __str__(self):
        return f"{self.background} {self.paddle} {self.gameMode}"

class GameRoom(models.Model):
    player1 = models.ForeignKey(Player, related_name='player1', on_delete=models.CASCADE, null=True, blank=True)
    player2 = models.ForeignKey(Player, related_name='player2', on_delete=models.CASCADE, null=True, blank=True)
    is_waiting = models.BooleanField(default=True)
    creatred_at = models.DateTimeField(auto_now_add=True)
