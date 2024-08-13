from rest_framework import serializers
from .models import Player, Friendship, FriendInvitation, Notification
from authentication.serializers import CurrentUserSerializer
from .models import Tournament, TournamentInvitation

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
        fields = [
            'user_id', 
            'username',
            'avatar', 
            'rank', 
            'rank_progress', 
            'games_played', 
            'games_won', 
            'xp'
        ]
    

class FriendInvitationsSerializer(serializers.ModelSerializer):
    class Meta:
        model = FriendInvitation
        fields = [
            'id', 
            'player_sender', 
            'player_receiver', 
            'invite_status', 
            'send_at']

    

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = [
            'id', 
            'sender', 
            'message', 
            'title', 
            'description', 
            'timestamp', 
            'is_read'
        ]


class TournamentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tournament
        fields = [
            'tournament_creator',
            'tournament_name',
            'tournament_prize',
            'tournament_map',
            'created_at',
            'tournament_date',
            'tournament_status',
            'tournament_stage',
            'tournament_participants',
        ]

#check if the user is not present with the invited users
class TournamentInvitationSerializer(serializers.ModelSerializer):
    class Meta:
        model = TournamentInvitation
        fields = ['id', 'tournament', 'player', 'invitation_status', 'invitation_date']

class TournamentCreateSerializer(serializers.ModelSerializer):
    invitedUsers = serializers.ListField(child=serializers.IntegerField())
    class Meta:
        model = Tournament
        fields = ['tournament_name', 'tournament_map', 'invitedUsers']
    def validate(self, data):
        maps = ['HELL', 'FIRE', 'ICE']
        if data['tournament_map'] not in maps:
            raise serializers.ValidationError({"tournament_map": "Invalid map name"})
        currentUser = self.context['request'].user
        if len(data['invitedUsers']) != 3:
            raise serializers.ValidationError({"invitedUsers": "The number of invited players must be 4"})
        if Tournament.objects.filter(tournament_creator=currentUser.id).exists():
            raise serializers.ValidationError({"invitedUsers": "You are already present in a tournament"})
        for user_id in data['invitedUsers']:
            print(user_id)
            if Tournament.objects.filter(tournament_participants=user_id).exists():
                raise serializers.ValidationError({"invitedUsers": "One of the invited players is already present at the tournament"})
        return data

    