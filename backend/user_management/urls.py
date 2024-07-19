from django.urls import path,include
from .views import FriendsListView, CreateFriendshipView, DeleteFriendshipView,BlockFriendView, UnblockFriendView,PlayerView, FrindInvitationsView, SearchAPIView, CurrentFriendsListView, OtherPlayersView

urlpatterns = [
    path('friends/create/<int:friend_id>/', CreateFriendshipView.as_view(), name='create_friendship'),
    path('friends/delete/<int:player_id>/<int:friend_id>/', DeleteFriendshipView.as_view(), name='delete_friendship'),
    path('friends/list/<int:player_id>/', FriendsListView.as_view(), name='friends_list'),
    path('friends/list/me/', CurrentFriendsListView.as_view(), name='friends_list'),
    path('friends/block/<int:player_id>/<int:friend_id>/', BlockFriendView.as_view(), name='block_friend'),
    path('friends/unblock/<int:player_id>/<int:friend_id>/', UnblockFriendView.as_view(), name='unblock_friend'),
    path('stats/', PlayerView.as_view(), name='player_view'),
    path('stats/<int:player_id>', OtherPlayersView.as_view(), name='player_view'),
    path('friends/invitations/', FrindInvitationsView.as_view(), name='player_invitations'),
    # path('player/', PlayerView.as_view(), name='player_view'),
    path('search/', SearchAPIView.as_view(), name='search-api'),
]