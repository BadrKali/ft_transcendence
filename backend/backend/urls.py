from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
# from user_management.views import FriendsListView, CreateFriendshipView, DeleteFriendshipView,BlockFriendView, UnblockFriendView
from rest_framework_simplejwt.views import TokenObtainPairView , TokenRefreshView



admin.site.site_header = "ft_transcendence Admin"
urlpatterns = [
    path('admin/', admin.site.urls),
    path("user_management/", include("user_management.urls")),
    path("auth/", include("authentication.urls")),
]

if settings.DEBUG:
     urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)