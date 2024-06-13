# urls.py
from django.urls import path
from .views import PlayerGameHistoryView, AchievementListView, PlayerAchievementListView

urlpatterns = [
    path('game-history/<int:player_id>/', PlayerGameHistoryView.as_view(), name='player-game-history'),
    path('achievements/', AchievementListView.as_view(), name='achievement_list'),
    path('achievements/player/<int:player_id>', PlayerAchievementListView.as_view(), name='player_achievements'),
]
