from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework import generics
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.core.exceptions import ValidationError
from .models import Friendship, Player, FriendInvitation
from .serializers import PlayerSerializer, FriendshipSerializer, FriendInvitationsSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.db.utils import IntegrityError
from game.models import Achievement
from game.serializers import AchievementSerializer
from django.conf import settings
from authentication .models import User
from authentication .serializers import CurrentUserSerializer



class CreateFriendshipView(APIView):
    def post(self, request, friend_id):
        player = request.user  
        friend = get_object_or_404(User, id=friend_id) 
        
        friendship = Friendship(player=player, friend=friend) 
        try:
            friendship.full_clean()  
            friendship.save()
            return Response({"message": "Friendship created successfully."}, status=status.HTTP_201_CREATED)
        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class DeleteFriendshipView(APIView):

    def delete(self, request, player_id, friend_id):
        try:
            friendship = Friendship.objects.get(player_id=player_id, friend_id=friend_id)
            reverse_friendship = Friendship.objects.get(player_id=friend_id, friend_id=player_id)
            
            friendship.delete()
            reverse_friendship.delete()
            
            return Response({"message": "Friendship deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
        except Friendship.DoesNotExist:
            return Response({"error": "Friendship does not exist."}, status=status.HTTP_404_NOT_FOUND)
             
class FriendsListView(generics.ListAPIView):
    serializer_class = FriendshipSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        player_id = self.kwargs['player_id']  
        return Friendship.objects.filter(player_id=player_id)

class BlockFriendView(APIView):
    def post(self, request, player_id, friend_id):
        player = get_object_or_404(Player, id=player_id)
        friend = get_object_or_404(Player, id=friend_id)
        try:
            friendship = Friendship.objects.get(player=player, friend=friend)
            friendship.blocked = True
            friendship.save()
            return Response({'status': 'friend blocked'}, status=status.HTTP_200_OK)
        except Friendship.DoesNotExist:
            return Response({'error': 'friendship does not exist'}, status=status.HTTP_404_NOT_FOUND)
        

class UnblockFriendView(APIView):
    def post(self, request,player_id, friend_id):
        player = get_object_or_404(Player, id=player_id)
        friend = get_object_or_404(Player, id=friend_id)
        try:

            friendship = Friendship.objects.get(player=player, friend=friend)
            friendship.blocked = False
            friendship.save()
            return Response({'status': 'friend unblocked'}, status=status.HTTP_200_OK)
        except Friendship.DoesNotExist:
            return Response({'error': 'friendship does not exist'}, status=status.HTTP_404_NOT_FOUND)








 
class PlayerView(APIView):
    def get(self, request):
        player_id = request.user.id
        player = get_object_or_404(Player, user_id=player_id)
        serializer = PlayerSerializer(player)
        return(Response(serializer.data, status=status.HTTP_200_OK))
    # def patch(self, request):
    #     player_id  = request.user.id
    #     player = get_object_or_404(Player, user_id=player_id)
    #     serializer = PlayerSerializer(player, data=request.data, partial=True)
    #     if serializer.is_valid():
    #         serializer.save()
    #         return Response({"message" : "sir 3la lah you can do it"}, status=status.HTTP_200_OK)
    #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        

class GamePlayersView(APIView):
    def get(self, request, player_id):
        player = get_object_or_404(Player, user_id=player_id)
        serializer = PlayerSerializer(player)
        return(Response(serializer.data, status=status.HTTP_200_OK))



class FrindInvitationsView(APIView):
    def get(self, request):
        invitation = FriendInvitation.objects.filter(player_receiver=request.user)
        serializer = FriendInvitationsSerializer(invitation, many=True)
        return(Response(serializer.data, status=status.HTTP_200_OK))
    




# test for search 
class SearchAPIView(APIView):
    def get(self, request, *args, **kwargs):
        query = request.query_params.get('q', '')
        if query:
            results = User.objects.filter(username__icontains=query)
            serializer = CurrentUserSerializer(results, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({"results": []}, status=status.HTTP_200_OK)