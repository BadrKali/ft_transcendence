from django.shortcuts import render
from django.db import models
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from .models import GameHistory, Achievement, PlayerAchievement
from .serializers import GameHistorySerializer, AchievementSerializer, PlayerAchievementSerializer

class PlayerGameHistoryView(generics.ListAPIView):
    serializer_class = GameHistorySerializer

    def get_queryset(self):
        player_id = self.kwargs['player_id']
        return GameHistory.objects.filter(models.Q(winner_user_id=player_id) | models.Q(loser_user_id=player_id))

class AchievementListView(APIView):
    def get(self, request):
        achievements = Achievement.objects.all()
        serializer = AchievementSerializer(achievements, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class PlayerAchievementListView(APIView):
    def get(self, request, player_id):
        player_achievements = PlayerAchievement.objects.filter(player_id=player_id)
        serializer = PlayerAchievementSerializer(player_achievements, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)