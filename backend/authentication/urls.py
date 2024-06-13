from django.urls import path,include
from rest_framework_simplejwt.views import TokenObtainPairView , TokenRefreshView
from .views import UserRegistration,CurrentUserView, UserView

urlpatterns = [
    path("token/", TokenObtainPairView.as_view(), name="get_token"),
    path("token/refresh", TokenRefreshView.as_view(), name="refresh_token"),
    path("user-auth/", include("rest_framework.urls")),
    path("user/register/", UserRegistration.as_view(), name="register"),
    path("user/me/", CurrentUserView.as_view(), name="get_user_info"),
    path("user/me/<int:user_id>", UserView.as_view(), name="get_user_info"),
]