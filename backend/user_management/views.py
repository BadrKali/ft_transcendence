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
from .serializers import FriendInvitation
from django.conf import settings
from authentication .models import User
from authentication .serializers import CurrentUserSerializer
from django.db.models import Q


class FriendRequestManagementView(APIView):
    
    def get_friendship_status(self, player_sender, player_receiver):
        return FriendInvitation.objects.filter(
                                                Q(player_sender=player_sender, player_receiver=player_receiver) |
                                                Q(player_sender=player_receiver, player_receiver=player_sender)).exists()
    
    def get(self, request, receiver_id):
        player_sender = request.user
        player_receiver = get_object_or_404(User, id=receiver_id)
        request_exists = self.get_friendship_status(player_sender, player_receiver)
        if request_exists:
            return Response({"message": "Friend request exists."}, status=status.HTTP_200_OK)
        else:
            return Response({"message": "Friend request does not exist."}, status=status.HTTP_200_OK)
    
    def post(self, request, receiver_id):
        player_sender = request.user
        player_receiver = get_object_or_404(User, id=receiver_id)
        
        if self.get_friendship_status(player_sender, player_receiver):
            return Response({'error': 'Friend request already exists.'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            friend_request = FriendInvitation(player_sender=player_sender, player_receiver=player_receiver)
            friend_request.save()
            return Response({'message': 'Friend request sent successfully.'}, status=status.HTTP_201_CREATED)
        except ValidationError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, receiver_id):
        player_sender = request.user
        player_receiver = get_object_or_404(User, id=receiver_id)

        try:
            invitation = get_object_or_404(FriendInvitation, player_sender=player_sender, player_receiver=player_receiver)
            invitation.delete()
            return Response({'message': 'Friend request canceled.'}, status=status.HTTP_202_ACCEPTED)
        except FriendInvitation.DoesNotExist:
            return Response({'error': 'Friend request not found.'}, status=status.HTTP_404_NOT_FOUND)
    



            
class FriendRequestResponse(APIView):
    def patch(self, request, sender_id):
        player_sender = get_object_or_404(User, id=sender_id)
        player_receiver = request.user
        friend_request = get_object_or_404(FriendInvitation, player_sender=player_sender, player_receiver=player_receiver)
        if friend_request.invite_status != 'P':
            return Response({'error': 'Invalid status.'}, status=status.HTTP_400_BAD_REQUEST)
        action = request.data.get('status')
        if action not in ['accept', 'reject']:
            return Response({'error': 'Invalid action. Choose "accept" or "reject".'}, status=status.HTTP_400_BAD_REQUEST)
        if action == 'accept':
            friend_request.invite_status = 'A'
            friendship = Friendship(player=player_sender, friend=player_receiver)
            friendship.save()
            friend_request.save()
            return Response({'message': 'Friend request accepted.'}, status=status.HTTP_200_OK)
        elif action == 'reject':
            return Response({'message': 'Friend request rejected.'}, status=status.HTTP_200_OK)


class FriendManagementView(APIView):
    def get(self, request, friend_id):
        currentUser = request.user
        friend = get_object_or_404(User, id=friend_id)
        is_friend = Friendship.objects.filter(Q(player=currentUser, friend=friend) | Q(player=friend, friend=currentUser)).exists()
        if is_friend:
            return Response({"message": f"{friend} is a friend."}, status=status.HTTP_200_OK)
        else:
            return Response({"message": f"{friend} is not a friend."}, status=status.HTTP_404_NOT_FOUND)
        
    def detete(self, request, friend_id):
        currentUser = request.user
        friend = friend = get_object_or_404(User, id=friend_id)
        friendship = Friendship.objects.filter(Q(player=currentUser, friend=friend) | Q(player=friend, friend=currentUser))
        if friendship.exists():
            friendship.delete()
            return Response({"message": f"Successfully unfriended {friend}."}, status=status.HTTP_202_ACCEPTED)
        else:
            return Response({"error": "Friendship does not exist."}, status=status.HTTP_404_NOT_FOUND)


class BlockUnblockView(APIView):
    pass


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


# class DeleteFriendshipView(APIView):

#     def delete(self, request, player_id, friend_id):
#         try:
#             friendship = Friendship.objects.get(player_id=player_id, friend_id=friend_id)
#             reverse_friendship = Friendship.objects.get(player_id=friend_id, friend_id=player_id)
            
#             friendship.delete()
#             reverse_friendship.delete()
            
#             return Response({"message": "Friendship deleted successfully."}, status=status.HTTP_202_ACCEPTED)
#         except Friendship.DoesNotExist:
#             return Response({"error": "Friendship does not exist."}, status=status.HTTP_404_NOT_FOUND)

class CurrentFriendsListView(generics.ListAPIView):
    serializer_class = FriendshipSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Friendship.objects.filter(player=self.request.user)

class FriendsListView(generics.ListAPIView):
    serializer_class = FriendshipSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        player_id = self.kwargs['player_id']
        return Friendship.objects.filter(player_id=player_id)

# class BlockFriendView(APIView):
#     def post(self, request, player_id, friend_id):
#         player = get_object_or_404(Player, id=player_id)
#         friend = get_object_or_404(Player, id=friend_id)
#         try:
#             friendship = Friendship.objects.get(player=player, friend=friend)
#             friendship.blocked = True
#             friendship.save()
#             return Response({'status': 'friend blocked'}, status=status.HTTP_200_OK)
#         except Friendship.DoesNotExist:
#             return Response({'error': 'friendship does not exist'}, status=status.HTTP_404_NOT_FOUND)
        

# class UnblockFriendView(APIView):
#     def post(self, request,player_id, friend_id):
#         player = get_object_or_404(Player, id=player_id)
#         friend = get_object_or_404(Player, id=friend_id)
#         try:

#             friendship = Friendship.objects.get(player=player, friend=friend)
#             friendship.blocked = False
#             friendship.save()
#             return Response({'status': 'friend unblocked'}, status=status.HTTP_200_OK)
#         except Friendship.DoesNotExist:
#             return Response({'error': 'friendship does not exist'}, status=status.HTTP_404_NOT_FOUND)

 
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

class OtherPlayerView(APIView):
    def get(self, request, player_id):
        player = get_object_or_404(Player, user_id=player_id)
        serializer = PlayerSerializer(player)
        return(Response(serializer.data, status=status.HTTP_200_OK))
    

class GamePlayersView(APIView):
    def get(self, request, player_id):
        player = get_object_or_404(Player, user_id=player_id)
        serializer = PlayerSerializer(player)
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