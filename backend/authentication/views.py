from django.shortcuts import render
from .models import User
from rest_framework import generics
from .serializers import UserRegistrationSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from .serializers import CurrentUserSerializer, CurrentUserSettingsSerializer
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
import requests
from user_management.models import Player
# Create your views here.

token_url = 'https://api.intra.42.fr/oauth/token'
user_info_url = 'https://api.intra.42.fr/v2/me'




class UserView(APIView):
    pass
    # def get(self ,request, user_id):
    #     user = get_object_or_404(User, pk=user_id)
    #     serializer = CurrentUserSerializer(user)
    #     return(Response(serializer.data))


class CurrentUserView(APIView):
    def patch(self, request):
        user = request.user
        serializer = CurrentUserSettingsSerializer(user, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response({"message" : "the user has been updated"}, status=status.HTTP_200_OK)
        return(Response(serializer.errors,  status=status.HTTP_400_BAD_REQUEST))
        



class UserRegistration(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            avatar_type = request.data.get('avatar_type')
            avatar_file = request.FILES.get('avatar')
            if avatar_file:
                serializer.validated_data['avatar'] = avatar_file
            elif avatar_type:
                serializer.validated_data['avatar'] = f'avatars/{avatar_type}.png'
            else:
                return Response({"message": "No avatar provided"}, status=status.HTTP_400_BAD_REQUEST)
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
        if not refresh_token:
            return Response({'error': 'Refresh token not found in cookies'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            refresh = RefreshToken(refresh_token)
            user_id = refresh['user_id']
            user = User.objects.get(id=user_id)
            #to do : catch specific error like Tokenerror and User.NotExist
        except:
            return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
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
    

class CallbackView(APIView):
    permission_classes = [AllowAny]
    def post(self, request, *args, **kwargs):
        code = request.data.get('code')
        if not code:
            return Response({"error": "No code provided"}, status=400)
        data = {
            'grant_type'  : 'authorization_code',
            'client_id'    : "",
            'client_secret': "",
            "code"         : code,
            "redirect_uri" : "http://localhost:3000/42_api/"
        }
        response = requests.post(token_url, data=data)
        if response.status_code != 200:
            return Response({"error": "Failed to fetch token"}, status=response.status_code)
        access_token = response.json().get('access_token')
        headers = {'Authorization': f'Bearer {access_token}'}
        user_info_response = requests.get(user_info_url, headers=headers)

        if user_info_response.status_code != 200:
            return Response({"error": "Failed to fetch user data"}, status=user_info_response.status_code)
        user_info = user_info_response.json()
        print(f"asdjaklsdjaslkdj {user_info}")
        api_42_id = user_info['id']
        username = user_info['login']
        email = user_info.get('email', '')
        user, created = User.objects.get_or_create(api_42_id=api_42_id, defaults={'username': username, 'email': email})
        # khasni nzid wa7ed check ila ken l user already exist 
        # player = Player.objects.create(user=user)
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)
        response_data = {
            'access': access_token
        }
        response = Response(response_data, status=status.HTTP_200_OK)
        response.set_cookie(
            key='refresh',
            value=refresh_token,
            httponly = True,
            #more options to add when nedded 
        )
        return response