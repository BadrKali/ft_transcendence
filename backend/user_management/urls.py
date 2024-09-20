from django.urls import path,include
from .views import *

urlpatterns = [

    path('friends-request/<int:receiver_id>/', FriendRequestManagementView.as_view(), name='manage_friend_request_detail'),
    path('friends-request/<int:sender_id>/response/', FriendRequestResponse.as_view(), name='friend_request_response'),
    path('friend/<int:friend_id>/', FriendManagementView.as_view(), name='friend_management'),
    path('<int:blocked_id>/block-unblock/', BlockUnblockView.as_view(), name='block_unblock_user'),
    path('block-unblock/', BlockUnblockView.as_view(), name='block_unblock_user_list'),
    path('stats/', PlayerView.as_view(), name='player_view'),
    path('globalstats/', GlobalStatsView.as_view(), name='global_stats'),
    path('stats/<int:player_id>', OtherPlayerView.as_view(), name='player_view'),
    path('stats/username/<str:username>', OtherPlayerView.as_view(), name='player_view'),
    path('search/', SearchAPIView.as_view(), name='search-api'),
    path('friends/list/', ListFriendsView.as_view(), name='friends_list'),
    path('notifications/', NotificationListView.as_view(), name='notifications_list'),
    path('missed-notifications/', MissedNotificationsAPIView.as_view(), name='notifications_list'),
    path('tournament/', TournamentsManagementView.as_view(), name='tournament_management'),
    path('tournament/start/', StartTournamentView.as_view(), name='tournament_start'),
    path('tournament/<str:stage>', TournamentByStageView.as_view(), name='tournament_management'),
    path('tournament/invitations/', TournamentInvitationView.as_view(), name='tournament_management'),
    path('tournament/invitations/<int:tournament_id>', TournamentInvitationView.as_view(), name='tournament_invitation_handler'),
    path('tournament/invitation/<>int:tournament_id/response', TournamentInvitationResponse.as_view(), name="tournament_invitation_response"),
    path('xp-history/', XPHistoryView.as_view(), name='xp-history'),
    path('leaderboard/', LeaderboardView.as_view(), name='leaderboard'),
    path('local-tournament/', LocalTournamentView.as_view(), name='local-tournament'),
    # path('friends/create/<int:friend_id>/', CreateFriendshipView.as_view(), name='create_friendship'),
    # path('friends/delete/<int:player_id>/<int:friend_id>/', DeleteFriendshipView.as_view(), name='delete_friendship'),
    # path('friends/list/<int:player_id>/', FriendsListView.as_view(), name='friends_list'),
    # path('friends/block/<int:player_id>/<int:friend_id>/', BlockFriendView.as_view(), name='block_friend'),
    # path('friends/unblock/<int:player_id>/<int:friend_id>/', UnblockFriendView.as_view(), name='unblock_friend'),
    # path('player/', PlayerView.as_view(), name='player_view'),
]