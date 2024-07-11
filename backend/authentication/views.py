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

# Create your views here.


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