from django.urls import path,include
from rest_framework_simplejwt.views import TokenObtainPairView , TokenRefreshView
from .views import UserRegistrationView


urlpatterns = [
    path("token/", TokenObtainPairView.as_view(), name="get_token"),
    path("token/refresh", TokenRefreshView.as_view(), name="refresh_token"),
    path("user-auth/", include("rest_framework.urls")),
    path("user/register/", UserRegistrationView.as_view(), name="register"),
    # path("user/me/", UserView.as_view(), name="get_user_info"),
]