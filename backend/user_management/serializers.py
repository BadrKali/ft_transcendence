from rest_framework import serializers
from .models import Player, Friendship, FriendInvitation, Notification
from authentication.serializers import CurrentUserSerializer


class FriendshipSerializer(serializers.ModelSerializer):
    friend = serializers.SerializerMethodField()

    class Meta:
        model = Friendship
        fields = ['friend', 'blocked']

    def get_friend(self, obj):
        return PlayerSerializer(obj.friend).data
    
    
class PlayerSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username')
    avatar = serializers.ImageField(source='user.avatar')

    class Meta:
        model = Player
        fields = ['user_id', 'username', 'avatar', 'rank', 'rank_progress', 'games_played', 'games_won', 'xp']
    

class FriendInvitationsSerializer(serializers.ModelSerializer):
    class Meta:
        model = FriendInvitation
        fields = ['id', 'player_sender', 'player_receiver', 'invite_status', 'send_at']

    



class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'sender', 'message', 'timestamp', 'is_read']