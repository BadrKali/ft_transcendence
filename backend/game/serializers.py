from rest_framework import serializers
from .models import GameHistory, Achievement, UserAchievement, GameSettings, GameRoom, GameChallenge, InviteGameRoom
from user_management.serializers import PlayerSerializer

class GameHistorySerializer(serializers.ModelSerializer):
    is_winner = serializers.SerializerMethodField()

    class Meta:
        model = GameHistory
        fields = ['id', 'winner_user', 'loser_user', 'winner_score', 'loser_score', 'game_type', 'match_type', 'played_at', 'is_winner']

    def get_is_winner(self, obj):
        player_id = self.context.get('player_id')
        return obj.winner_user_id == player_id

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

class GameChallengeSerializer(serializers.ModelSerializer):
    class Meta:
        model = GameChallenge
        fields = '__all__'

class InviteGameRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = InviteGameRoom
        fields = '__all__'