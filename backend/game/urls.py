# urls.py
from django.urls import path
from .views import PlayerGameHistoryView

urlpatterns = [
    path('game-history/<int:player_id>/', PlayerGameHistoryView.as_view(), name='player-game-history'),
    
]
