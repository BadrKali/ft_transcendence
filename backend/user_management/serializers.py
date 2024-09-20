from rest_framework import serializers
from .models import Player, Friendship, FriendInvitation, Notification
from authentication.serializers import CurrentUserSerializer
from .models import Tournament, TournamentInvitation, TournamentParticipants, LocalTournament

class FriendshipSerializer(serializers.ModelSerializer):
    friend = serializers.SerializerMethodField()

    class Meta:
        model = Friendship
        fields = [
            'friend', 
            'blocked'
            ]

    def get_friend(self, obj):
        return PlayerSerializer(obj.friend).data






class PlayerSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username')
    avatar = serializers.ImageField(source='user.avatar')
    is_2fa_enabled = serializers.BooleanField(source='user.is_2fa_enabled')
    rank_progress = serializers.IntegerField(source='get_rank_progress')

    class Meta:
        model = Player
        fields = [
            'user_id',
            'is_2fa_enabled',
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
    sender_username = serializers.CharField(source='sender.username')
    sender_avatar = serializers.CharField(source='sender.avatar.url')

    class Meta:
        model = Notification
        fields = [
            'id', 
            'sender_id',
            'sender_username',
            'sender_avatar',
            'message', 
            'title', 
            'description', 
            'timestamp', 
            'is_read'
        ]



class TournamentSerializer(serializers.ModelSerializer):
    tournament_participants = CurrentUserSerializer(many=True, read_only=True)

    class Meta:
        model = Tournament
        fields = [
            'id', 
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
    tournament = TournamentSerializer()
    class Meta:
        model = TournamentInvitation
        fields = [
            'id', 
            'tournament', 
            'player', 
            'invitation_status', 
            'invitation_date'
        ]

class TournamentCreateSerializer(serializers.ModelSerializer):
    invitedUsers = serializers.ListField(child=serializers.IntegerField())

    class Meta:
        model = Tournament
        fields = ['tournament_name', 'tournament_map', 'invitedUsers']

    def validate(self, data):
        maps = ['undergroundHell', 'undergroundForest', 'undergroundGraveyard']
        currentUser = self.context['request'].user
        if data['tournament_map'] not in maps:
            raise serializers.ValidationError({"tournament_map": "Invalid map name"})
        if len(data['invitedUsers']) != 3:
            raise serializers.ValidationError({"invitedUsers": "The number of invited players must be 3"})
        if Tournament.objects.filter(tournament_participants=currentUser).exists():
            raise serializers.ValidationError({"invitedUsers": "You are already present in a tournament"})
        if len(data['invitedUsers']) != len(set(data['invitedUsers'])):
            raise serializers.ValidationError({"invitedUsers": "Duplicate user IDs detected in the invited players list"})
        for user_id in data['invitedUsers']:
            if user_id == currentUser.id:
                raise serializers.ValidationError({"invitedUsers": "You cannot invite yourself to the tournament"})
            if Tournament.objects.filter(tournament_participants=user_id).exists():
                raise serializers.ValidationError({"invitedUsers": f"User with ID {user_id} is already present in another tournament"})

        return data


class TournamentParticipantsSerializer(serializers.ModelSerializer):

    class Meta:
        model = TournamentParticipants
        fields = '__all__'


class LocalTournamentCreateSerializer(serializers.ModelSerializer):
    invitedUsers = serializers.ListField(child=serializers.IntegerField())

    class Meta:
        model = LocalTournament
        fields = ['tournament_name', 'tournament_map', 'invitedUsers']

    def validate(self, data):
        pass
        # maps = ['undergroundHell', 'undergroundForest', 'undergroundGraveyard']
        # currentUser = self.context['request'].user
        # if data['tournament_map'] not in maps:
        #     raise serializers.ValidationError({"tournament_map": "Invalid map name"})
        # if len(data['invitedUsers']) != 3:
        #     raise serializers.ValidationError({"invitedUsers": "The number of invited players must be 3"})
        # if LocalTournament.objects.filter(tournament_participants=currentUser).exists():
        #     raise serializers.ValidationError({"invitedUsers": "You are already present in a tournament"})
        # if len(data['invitedUsers']) != len(set(data['invitedUsers'])):
        #     raise serializers.ValidationError({"invitedUsers": "Duplicate user IDs detected in the invited players list"})
        # for user_id in data['invitedUsers']:
        #     if user_id == currentUser.id:
        #         raise serializers.ValidationError({"invitedUsers": "You cannot invite yourself to the tournament"})
        #     if LocalTournament.objects.filter(tournament_participants=user_id).exists():
        #         raise serializers.ValidationError({"invitedUsers": f"User with ID {user_id} is already present in another tournament"})

        # return data



class LocalTournamentSerializer(serializers.ModelSerializer):
    pass
    # tournament_participants = CurrentUserSerializer(many=True, read_only=True)

    # class Meta:
    #     model = LocalTournament
    #     fields = [
    #         'id', 
    #         'tournament_creator',
    #         'tournament_name',
    #         'tournament_map',
    #         'created_at',
    #         'tournament_date',
    #         'tournament_status',
    #         'tournament_stage',
    #         'tournament_participants',
    #     ]


