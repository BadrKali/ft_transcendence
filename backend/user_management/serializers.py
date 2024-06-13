from rest_framework import serializers
from .models import Player, Friendship, FriendInvitation

class FriendshipSerializer(serializers.ModelSerializer):
    friend = serializers.SerializerMethodField()

    class Meta:
        model = Friendship
        fields = ['friend', 'blocked']

    def get_friend(self, obj):
        return PlayerSerializer(obj.friend).data
    
    
class PlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player
        fields = ['id', 'rank', 'rank_progress', 'games_played', 'games_won', 'xp']
    

class FriendInvitationsSerializer(serializers.ModelSerializer):
    class Meta:
        model = FriendInvitation
        fields = ['id', 'player_sender', 'player_receiver', 'invite_status', 'send_at']

    



