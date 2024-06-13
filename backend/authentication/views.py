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
            serializer.save()
            return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


