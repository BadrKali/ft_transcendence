from rest_framework import serializers
from .models import GameHistory, Achievement, UserAchievement, GameSettings, GameRoom
from user_management.serializers import PlayerSerializer

class GameHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = GameHistory
        fields = '__all__'

class AchievementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Achievement
        fields = ['id', 'title', 'description', 'image', 'task']


class UserAchievementSerializer(serializers.ModelSerializer):
    player = serializers.PrimaryKeyRelatedField(read_only=True)
    achievement = AchievementSerializer()

    class Meta:
        model = UserAchievement
        fields = ['player', 'achievement', 'achieved_at']

class GameSettingsSerializer(serializers.ModelSerializer):
    user_name = serializers.ReadOnlyField(source='user.user.username')
    class Meta:
        model = GameSettings
        fields = '__all__'
        read_only_fields = ['user']

class GameRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = GameRoom
        fields = ['id', 'player1', 'player2', 'is_waiting', 'created_at']