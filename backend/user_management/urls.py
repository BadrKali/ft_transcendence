from django.urls import path,include
from .views import *

urlpatterns = [

    path('friends-request/<int:receiver_id>/', FriendRequestManagementView.as_view(), name='manage_friend_request_detail'),
    path('friends-request/<int:sender_id>/response/', FriendRequestResponse.as_view(), name='friend_request_response'),
    path('friend/<int:friend_id>', FriendManagementView.as_view(), name='friend_management'),
    path('<int:friend_id>/block-unblock', BlockUnblockView.as_view(), name='bBlockUnblock_users'),



    path('friends/create/<int:friend_id>/', CreateFriendshipView.as_view(), name='create_friendship'),
    # path('friends/delete/<int:player_id>/<int:friend_id>/', DeleteFriendshipView.as_view(), name='delete_friendship'),
    path('friends/list/<int:player_id>/', FriendsListView.as_view(), name='friends_list'),
    path('friends/list/me/', CurrentFriendsListView.as_view(), name='friends_list'),
    # path('friends/block/<int:player_id>/<int:friend_id>/', BlockFriendView.as_view(), name='block_friend'),
    # path('friends/unblock/<int:player_id>/<int:friend_id>/', UnblockFriendView.as_view(), name='unblock_friend'),
    path('stats/', PlayerView.as_view(), name='player_view'),
    path('stats/<int:player_id>', OtherPlayerView.as_view(), name='player_view'),
    # path('player/', PlayerView.as_view(), name='player_view'),
    path('search/', SearchAPIView.as_view(), name='search-api'),
]