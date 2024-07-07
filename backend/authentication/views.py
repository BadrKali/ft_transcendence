from django.shortcuts import render
from .models import User
from rest_framework import generics
from .serializers import UserRegistrationSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from .serializers import CurrentUserSerializer
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
# Create your views here.


class UserView(APIView):
    def get(self ,request, user_id):
        user = get_object_or_404(User, pk=user_id)
        serializer = CurrentUserSerializer(user)
        return(Response(serializer.data))


class CurrentUserView(APIView):
    def get(self, request):
        id = request.user.id
        user = get_object_or_404(User, pk=id)
        serializer = CurrentUserSerializer(user)
        return(Response(serializer.data))



class UserRegistration(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            avatar_type = request.data.get('avatar_type')
            avatar_file = request.FILES.get('avatar')
            if avatar_file:
                serializer.validated_data['avatar'] = avatar_file
            else:
                serializer.validated_data['avatar'] = f'avatars/{avatar_type}.png'
            serializer.save()
            return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == status.HTTP_200_OK:
            refreshToken = response.data['refresh']
            response.set_cookie(
                key = 'refresh',
                value = refreshToken,
                httponly = True,
                #more options to add when nedded 
            )
            del response.data["refresh"]
        return response

class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get('refresh')
        # print(f"this is ref from cocokie {refresh_token}")
        if not refresh_token:
            return Response({'error': 'Refresh token not found in cookies'}, status=status.HTTP_400_BAD_REQUEST)
        serializer = self.get_serializer(data={'refresh': refresh_token})
        serializer.is_valid(raise_exception=True)
        response = Response(serializer.validated_data, status=status.HTTP_200_OK)
        response.set_cookie(
            key='refresh',
            value=refresh_token,
            httponly = True,
            #more options to add when nedded 
        )
        return response