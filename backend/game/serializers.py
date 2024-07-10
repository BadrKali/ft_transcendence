from rest_framework import serializers
from .models import GameHistory, Achievement, PlayerAchievement, GameSettings
from user_management.serializers import PlayerSerializer

class GameHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = GameHistory
        fields = '__all__'

class AchievementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Achievement
        fields = ['id', 'title', 'description', 'image', 'task']


class PlayerAchievementSerializer(serializers.ModelSerializer):
    player = serializers.PrimaryKeyRelatedField(read_only=True)
    achievement = AchievementSerializer()

    class Meta:
        model = PlayerAchievement
        fields = ['player', 'achievement', 'achieved_at']

class GameSettingsSerializer(serializers.ModelSerializer):
    user_name = serializers.ReadOnlyField(source='user.user.username')
    class Meta:
        model = GameSettings
        fields = ['id', 'user_name', 'background', 'paddle', 'keys' ,'gameMode']
        read_only_fields = ['user']
