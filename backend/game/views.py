from django.shortcuts import render
from django.db import models
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from .models import GameHistory, Achievement, UserAchievement, GameSettings, GameRoom, GameChallenge
from .serializers import GameHistorySerializer, AchievementSerializer, UserAchievementSerializer, GameSettingsSerializer, GameRoomSerializer
from user_management.models import Player, Notification
from authentication .models import User
from django.shortcuts import get_object_or_404

class PlayerGameHistoryView(APIView):
    def get(self, request, player_id):
        queryset = GameHistory.objects.filter(
            models.Q(winner_user_id=player_id) | models.Q(loser_user_id=player_id)
        )
        serializer = GameHistorySerializer(queryset, many=True, context={'player_id': player_id})
        return Response(serializer.data, status=status.HTTP_200_OK)


class AchievementListView(APIView):
    def get(self, request):
        achievements = Achievement.objects.all()
        serializer = AchievementSerializer(achievements, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class CurrentUserAchievementListView(APIView):
    permission_classes = [IsAuthenticated]  
    
    def get(self, request):
        user_achievements = UserAchievement.objects.filter(user=request.user)
        serializer = UserAchievementSerializer(user_achievements, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class SpecificUserAchievementListView(APIView):
    def get(self, request, user_id):
        user_achievements = UserAchievement.objects.filter(user_id=user_id)
        serializer = UserAchievementSerializer(user_achievements, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class TriggerAchievementView(APIView):
    def post(self, request):
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            "achievements_group",
            {
                "type": "send_achievement",
                "achievement": {
                    "title": "Achievement Unlocked!",
                    "description": "You have completed 5 games."
                }
            }
        )
        return Response({"status": "Achievement sent"}, status=status.HTTP_200_OK)
    
class GameSettingsView(APIView):
    def post(self, request):
        try:
            print(f"{request.data}")
            player, createdPlayer = Player.objects.get_or_create(user_id=request.user.id)
            game_settings, created = GameSettings.objects.get_or_create(user=player)
            if created:
                print("A new GameSettings instance was created.")
            else:
                print("An existing GameSettings instance was retrieved.")
            serializer = GameSettingsSerializer(instance=game_settings, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Player.DoesNotExist:
            return Response({"error": "Player not found"}, status=status.HTTP_404_NOT_FOUND)
    def get(self, request):
        try:
            player = Player.objects.get(user_id=request.user.id)
            game_settings = GameSettings.objects.get(user=player)
            serializer = GameSettingsSerializer(game_settings)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Player.DoesNotExist:
            return Response({"error": "Player not found"}, status=status.HTTP_404_NOT_FOUND)
        except GameSettings.DoesNotExist:
            return Response({"error": "GameSettings not found"}, status=status.HTTP_404_NOT_FOUND)
        
class GameRoomView(APIView):
    def get(self, request, room_id):
        try:
            room = GameRoom.objects.get(id=room_id)
            print(f"{room.player1}")
            print(f"{room.player2}")
            serializer = GameRoomSerializer(room)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except GameRoom.DoesNotExist:
            return Response({"error": "Game room not found"}, status=status.HTTP_404_NOT_FOUND)

class SendChallengeView(APIView):
    def post(self, request):
        player_receiver_id = request.data.get('player_receiver_id')
        if not player_receiver_id:
            return Response({'error': 'player_receiver_id is required.'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            player_receiver = get_object_or_404(User, id=player_receiver_id)
            player_sender = request.user
            # friend_request = GameChallenge(player_sender=player_sender, player_receiver=player_receiver)
            # friend_request.save()
            Notification.objects.create(
                recipient=player_receiver,
                sender=player_sender,
                message='has challenged you to a game!'
            )
            channel_layer = get_channel_layer()
            async_to_sync(channel_layer.group_send)(
                f'notifications_{player_receiver.id}',
                {
                    'type': 'notification_message',
                    'message': f'{player_sender.username} has challenged you to a game!'
                }
            )
            return Response({'message': 'Challenge sent successfully.'}, status=status.HTTP_201_CREATED)

        except User.DoesNotExist:
            return Response({'error': 'Player not found.'}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class GameChallengeResponse(APIView):
    def patch(self, request, sender_id):
        print("hello World")
        player_sender = get_object_or_404(User, id=sender_id)
        player_receiver = request.user
        friend_request = get_object_or_404(GameChallenge, player_sender=player_sender, player_receiver=player_receiver)
        if friend_request.invite_status != 'P':
            return Response({'error': 'Invalid status.'}, status=status.HTTP_400_BAD_REQUEST)
        action = request.data.get('status')
        if action not in ['accepted', 'rejected']:
            return Response({'error': 'Invalid action. Choose "accept" or "reject".'}, status=status.HTTP_400_BAD_REQUEST)
        if action == 'accepted':
            friend_request.invite_status = 'A'
            friendship = GameChallenge(player=player_sender, friend=player_receiver)
            friendship.save()
            friend_request.delete()
            return Response({'message': 'Friend request accepted.'}, status=status.HTTP_200_OK)
        elif action == 'rejected':
            friend_request.delete()
        return Response({'message': 'Friend request rejected.'}, status=status.HTTP_200_OK)