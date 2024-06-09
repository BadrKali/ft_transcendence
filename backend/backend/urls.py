from django.contrib import admin
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from user_management.views import FriendsListView, CreateFriendshipView, DeleteFriendshipView,BlockFriendView, UnblockFriendView

admin.site.site_header = "ft_transcendence Admin"


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/friends/create/<int:player_id>/<int:friend_id>/', CreateFriendshipView.as_view(), name='create_friendship'),
    path('api/friends/delete/<int:player_id>/<int:friend_id>/', DeleteFriendshipView.as_view(), name='delete_friendship'),
    path('api/friends/list/<int:player_id>/', FriendsListView.as_view(), name='friends_list'),
    path('api/friends/block/<int:player_id>/<int:friend_id>/', BlockFriendView.as_view(), name='block_friend'),
    path('api/friends/unblock/<int:player_id>/<int:friend_id>/', UnblockFriendView.as_view(), name='unblock_friend'),
]

if settings.DEBUG:
     urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)