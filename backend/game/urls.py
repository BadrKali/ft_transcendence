# urls.py
from django.urls import path
from .views import PlayerGameHistoryView, AchievementListView, SpecificUserAchievementListView, TriggerAchievementView, GameSettingsView, GameRoomView, CurrentUserAchievementListView, SendChallengeView, GameChallengeResponse

urlpatterns = [
    path('game-history/<int:player_id>/', PlayerGameHistoryView.as_view(), name='player-game-history'),
    path('achievements/', AchievementListView.as_view(), name='achievement_list'),
    path('achievements/player/<int:user_id>', SpecificUserAchievementListView.as_view(), name='player_achievements'),
    path('achievements/me', CurrentUserAchievementListView.as_view(), name='player_achievements'),
    path('trigger-achievement/', TriggerAchievementView.as_view(), name='trigger_achievement'),
    path('game-settings/current-user/', GameSettingsView.as_view(), name='game_settings'),
    path('game-room/<int:room_id>', GameRoomView.as_view(), name='game_room'),
    path('send-challenge/', SendChallengeView.as_view(), name='send-challenge'),
    path('game-challenges/<int:sender_id>/response/', GameChallengeResponse.as_view(), name='game-challenge'),
]
