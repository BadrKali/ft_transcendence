from django.contrib import admin
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from user_management.views import block_friend, unblock_friend, check_relationship, FriendsListView, CreateFriendshipView

admin.site.site_header = "ft_transcendence Admin"


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/friends/create/<int:player_id>/<int:friend_id>/', CreateFriendshipView.as_view(), name='create_friendship'),
    path('api/friends/list/<int:player_id>/', FriendsListView.as_view(), name='friends_list'),
    path('api/block-friend/<int:player_id>/<int:friend_id>/', block_friend, name='block_friend'),
    path('api/unblock-friend/<int:player_id>/<int:friend_id>/', unblock_friend, name='unblock_friend'),
    path('api/check-relationship/<int:player_id>/<int:friend_id>/', check_relationship, name='check_relationship'),
]

if settings.DEBUG:
     urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)