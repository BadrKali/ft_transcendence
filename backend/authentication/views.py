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
import os
import random
from game.models import  Achievement,UserAchievement
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from user_management.models import Notification
import pyotp
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
            user = serializer.save()
            # self.unlock_first_register_achievement(user)
            return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def unlock_first_register_achievement(self, user):
        achievement, _ = Achievement.objects.get_or_create(
            title="Welcome Aboard",
            defaults={'description': "Create your first account."}
        )
   
        UserAchievement.objects.create(
            user=user,
            achievement=achievement,
            unlocked=True
        )
        Notification.objects.create(
            recipient=user,
            sender=user,
            message='You Got a new Achievment',
            title='Welcome Aboard',
            description='Create your first account.',
        )

        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f'notifications_{user.id}',
            {
                'type': 'notification_message',
                'message': 'Got a new Achievment'
            }
        )

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
        print(f"code: {code}")
        if not code:
            print("you touched my tralala")
            return Response({"error": "No code provided"}, status=400)
        data = {
            'grant_type'  : 'authorization_code',
            'client_id'    : os.getenv('CLIENT_ID'),
            'client_secret': os.getenv('CLIENT_SECRET'),
            "code"         : code,
            "redirect_uri" : os.getenv('REDIRECT_URI')
        }
        print(f"code: {data}")
        response = requests.post(token_url, data=data)
        if response.status_code != 200:
            print(response.status_code)
            return Response({"error": "Failed to fetch token"}, status=response.status_code)
        access_token = response.json().get('access_token')
        headers = {'Authorization': f'Bearer {access_token}'}
        user_info_response = requests.get(user_info_url, headers=headers)

        if user_info_response.status_code != 200:
            return Response({"error": "Failed to fetch user data"}, status=user_info_response.status_code)
        user_info = user_info_response.json()
        api_42_id = user_info['id']
        username = user_info['login']
        email = user_info.get('email', '')
        avatar = user_info['image']['link']
        # avatarList = [0, 1, 2, 4]
        user, created = User.objects.get_or_create(api_42_id=api_42_id, defaults={'username': f"{username}{api_42_id}", 'avatar' : avatar,'email': email})
        if created:
            user.set_avatar_from_url(avatar)
            user.save()
        # khasni nzid wa7ed check ila ken l user already exist 
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


class Enable2FA(APIView):

    def get(self, request):
        request.user.generate_otp_secret()
        otp_uri = request.user.get_otp_uri()
        return Response({"otp_uri": otp_uri}, status=status.HTTP_200_OK)
    
    def post(self, request):
        user = request.user
        otp = request.data.get('otp')
        if not otp:
            return Response({"error": "OTP is required"}, status=status.HTTP_400_BAD_REQUEST)
        if pyotp.TOTP(user.otp_secret).verify(otp):
            user.is_2fa_verified = True
            user.is_2fa_enabled = True
            user.save()
            return Response({"message": "2FA has been verified"}, status=status.HTTP_200_OK)
        return Response({"error": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST)
    

class Disable2FA(APIView):
    def post(self, request):
        user = request.user
        user.otp_secret = None
        user.is_2fa_enabled = False
        user.is_2fa_verified = False
        user.save()
        return Response({"message": "2FA has been disabled"}, status=status.HTTP_200_OK)
    
