from asgiref.sync import sync_to_async

@sync_to_async
def get_player(user):
    from user_management.models import Player
    try:
        player, created = Player.objects.get_or_create(user_id=user)
        if created:
    except:
        return
    return player

@sync_to_async
def find_or_create_room(user):
    from user_management.models import Player
    from .models import GameRoom
    try:
        player, created = Player.objects.get_or_create(user_id=user)
        room = GameRoom.objects.filter(is_waiting=True).first()
        if room:
            room.player2 = player
            room.is_waiting = False
            room.save()
        else:
            room = GameRoom.objects.create(player1=player, is_waiting=True)
        return room
    except Exception as e:
        raise

