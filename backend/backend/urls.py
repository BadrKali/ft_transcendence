from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
# from user_management.views import FriendsListView, CreateFriendshipView, DeleteFriendshipView,BlockFriendView, UnblockFriendView
from authentication.views import UserRegistrationView
from rest_framework_simplejwt.views import TokenObtainPairView , TokenRefreshView



admin.site.site_header = "ft_transcendence Admin"
urlpatterns = [
    path('admin/', admin.site.urls),


    path("auth/user/register/", UserRegistrationView.as_view(), name="register"),
    path("auth/token/", TokenObtainPairView.as_view(), name="get_token"),
    path("auth/token/refresh", TokenRefreshView.as_view(), name="refresh_token"),
    path("user-auth/", include("rest_framework.urls")),


    path("user_management/", include("user_management.urls"))
]

if settings.DEBUG:
     urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)