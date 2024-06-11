from django.shortcuts import render
from django.db import models
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import GameHistory
from .serializers import GameHistorySerializer

class PlayerGameHistoryView(generics.ListAPIView):
    serializer_class = GameHistorySerializer

    def get_queryset(self):
        player_id = self.kwargs['player_id']
        return GameHistory.objects.filter(models.Q(winner_user_id=player_id) | models.Q(loser_user_id=player_id))

