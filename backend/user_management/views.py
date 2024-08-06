from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework import generics
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.core.exceptions import ValidationError
from .models import Friendship, Player, FriendInvitation, BlockedUsers, Notification
from .serializers import PlayerSerializer, FriendshipSerializer, FriendInvitationsSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.db.utils import IntegrityError
from game.models import Achievement
from game.serializers import AchievementSerializer
from .serializers import FriendInvitation, NotificationSerializer
from django.conf import settings
from authentication .models import User
from authentication .serializers import CurrentUserSerializer
from django.db.models import Q
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.http import HttpResponseForbidden
from game.models import UserAchievement


class FriendRequestManagementView(APIView):
    
    def get_friendship_status(self, player_sender, player_receiver):
        return FriendInvitation.objects.filter(
                                                Q(player_sender=player_sender, player_receiver=player_receiver) |
                                                Q(player_sender=player_receiver, player_receiver=player_sender)).exists()
    
    def get(self, request, receiver_id):
        player_sender = request.user
        player_receiver = get_object_or_404(User, id=receiver_id)
        request_exists = self.get_friendship_status(player_sender, player_receiver)
        is_friend = Friendship.objects.filter(Q(player=player_sender, friend=player_receiver) | Q(player=player_receiver, friend=player_sender)).exists()
        if is_friend:
            return Response({'message': 'Friends'}, status=status.HTTP_200_OK)
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
            Notification.objects.create(
                recipient=player_receiver,
                sender=player_sender,
                message='sent you a friend request.'
            )

            channel_layer = get_channel_layer()
            async_to_sync(channel_layer.group_send)(
                f'notifications_{player_receiver.id}',
                {
                    'type': 'notification_message',
                    'message': f'{player_sender.username} sent you a friend request.'
                }
            )
            return Response({'message': 'Friend request sent successfully.'}, status=status.HTTP_201_CREATED)
        except:
            return Response({'error': "Some error happend"}, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, receiver_id):
        player_sender = request.user
        player_receiver = get_object_or_404(User, id=receiver_id)

        try:
            invitation = get_object_or_404(FriendInvitation, player_sender=player_sender, player_receiver=player_receiver)
            invitation.delete()
            return Response({'message': 'Friend request canceled.'}, status=status.HTTP_202_ACCEPTED)
        except FriendInvitation.DoesNotExist:
            return Response({'error': 'Friend request not found.'}, status=status.HTTP_400_BAD_REQUEST)
    

            
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
            friend_request.delete()
            self.check_and_award_friends_achievement(player_sender, player_receiver)
            return Response({'message': 'Friend request accepted.'}, status=status.HTTP_200_OK)
        elif action == 'reject':
            friend_request.delete()
            return Response({'message': 'Friend request rejected.'}, status=status.HTTP_200_OK)
        
    def check_and_award_friends_achievement(self, player_sender, player_receiver):
        sender_friend_count = Friendship.objects.filter(player=player_sender).count() + Friendship.objects.filter(friend=player_sender).count()
        receiver_friend_count = Friendship.objects.filter(player=player_receiver).count() + Friendship.objects.filter(friend=player_receiver).count()

        print(f"Sender friend count: {sender_friend_count}")
        print(f"Receiver friend count: {receiver_friend_count}")
        
        if sender_friend_count >= 1:
            self.unlock_five_friends_achievement(player_sender)
        if receiver_friend_count >= 1:
            self.unlock_five_friends_achievement(player_receiver)
    
    def unlock_five_friends_achievement(self, user):
        achievement, _ = Achievement.objects.get_or_create(
            title="Social Butterfly",
            defaults={'description': "Have more than 5 friends."}
        )
        user_achievement_exists = UserAchievement.objects.filter(user=user, achievement=achievement).exists()
        if not user_achievement_exists:
            UserAchievement.objects.create(
                user=user,
                achievement=achievement,
                unlocked=True
            )
            Notification.objects.create(
                recipient=user,
                sender=user,
                message='You Got a new Achievment',
                title='Social Butterfly',
                description='Have more than 5 friends.',
            )

            channel_layer = get_channel_layer()
            async_to_sync(channel_layer.group_send)(
                f'notifications_{user.id}',
                {
                    'type': 'notification_message',
                    'message': 'Got a new Achievment'
                }
            )


class FriendManagementView(APIView):
    def get(self, request, friend_id):
        currentUser = request.user
        friend = get_object_or_404(User, id=friend_id)
        is_friend = Friendship.objects.filter(Q(player=currentUser, friend=friend) | Q(player=friend, friend=currentUser)).exists()
        if is_friend:
            return Response({"message": f"{friend} is a friend."}, status=status.HTTP_200_OK)
        else:
            return Response({"message": f"{friend} is not a friend."}, status=status.HTTP_404_NOT_FOUND)
        
    def delete(self, request, friend_id):
        currentUser = request.user
        friend = friend = get_object_or_404(User, id=friend_id)
        friendship = Friendship.objects.filter(Q(player=currentUser, friend=friend) | Q(player=friend, friend=currentUser))
        if friendship.exists():
            friendship.delete()
            return Response({"message": f"Successfully unfriended {friend}."}, status=status.HTTP_202_ACCEPTED)
        else:
            return Response({"error": "Friendship does not exist."}, status=status.HTTP_400_BAD_REQUEST)


class BlockUnblockView(APIView):
    def post(self, request, blocked_id):
        blocker = request.user
        blocked = get_object_or_404(User, id=blocked_id)
        if BlockedUsers.objects.filter(Q(blocker=blocker, blocked=blocked)).exists():
            return Response({'error': 'User is already blocked.'}, status=status.HTTP_400_BAD_REQUEST)
        blocking = BlockedUsers(blocker=blocker, blocked=blocked)
        blocking.save()
        Friendship.objects.filter(Q(player=blocker, friend=blocked) | Q(player=blocked, friend=blocker)).delete()
        return Response({'message': 'User has been blocked successfully.'}, status=status.HTTP_201_CREATED)
    def delete(self, request, blocked_id):
        blocker = request.user
        blocked = get_object_or_404(User, id=blocked_id)
        blocking = BlockedUsers.objects.filter(Q(blocker=blocker, blocked=blocked) | Q(blocker=blocked, blocked=blocker))
        if blocking.exists():
            blocking.delete()
            return Response({'message': 'User has been unblocked successfully.'}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "user is not blocked."}, status=status.HTTP_400_BAD_REQUEST)
    def get(self, request, blocked_id=None):
        blocker = request.user

        if blocked_id:
            blocked = get_object_or_404(User, id=blocked_id)
            is_blocked = BlockedUsers.objects.filter(Q(blocker=blocker, blocked=blocked)).exists()
            return Response({'is_blocked': is_blocked}, status=status.HTTP_200_OK)
        else:
            blocked_users = BlockedUsers.objects.filter(blocker=blocker).select_related('blocked')
            blocked_list = [{'id': user.blocked.id, 'username': user.blocked.username} for user in blocked_users]
            return Response({'blocked_users': blocked_list}, status=status.HTTP_200_OK)

        
class CurrentFriendsListView(generics.ListAPIView):
    serializer_class = FriendshipSerializer

    def get_queryset(self):
        return Friendship.objects.filter(player=self.request.user)




# class CreateFriendshipView(APIView):
#     def post(self, request, friend_id):
#         player = request.user  
#         friend = get_object_or_404(User, id=friend_id) 
        
#         friendship = Friendship(player=player, friend=friend) 
#         try:
#             friendship.full_clean()  
#             friendship.save()
#             return Response({"message": "Friendship created successfully."}, status=status.HTTP_201_CREATED)
#         except ValidationError as e:
#             return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


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


# class FriendsListView(generics.ListAPIView):
#     serializer_class = FriendshipSerializer
#     permission_classes = [IsAuthenticated]

#     def get_queryset(self):
#         player_id = self.kwargs['player_id']
#         return Friendship.objects.filter(player_id=player_id)

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
        requesting_user = request.user
        player = get_object_or_404(Player, user_id=player_id)
        profile_user = player.user

        if BlockedUsers.objects.filter(blocker=profile_user, blocked=requesting_user).exists():
            return HttpResponseForbidden('You are blocked from viewing this profile.')

        serializer = PlayerSerializer(player)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

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
    








class NotificationListView(APIView):
    def get(self, request):
        notifications = Notification.objects.filter(recipient=request.user).order_by('-timestamp')
        serializer = NotificationSerializer(notifications, many=True)
        return Response(serializer.data)

class ListFriendsView(APIView):
    def get(self, request, *args, **kwargs):
        current_user = request.user
        friendships = Friendship.objects.filter(Q(player=current_user, blocked=False) | Q(friend=current_user, blocked=False))
        friends = [friendship.friend if friendship.player == current_user else friendship.player for friendship in friendships]
        serializer = CurrentUserSerializer(friends, many=True)
        return Response(serializer.data)