from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone
from .models import Friendship

@receiver(post_save, sender=Friendship)
def check_social_butterfly_achievement(sender, instance, created, **kwargs):
    if created: 
        user = instance.user
        number_of_friends = user.friendships.count()  

        try:
            achievement = Achievement.objects.get(title="Social Butterfly")
        except Achievement.DoesNotExist:
            return  
     
        if number_of_friends >= 5:  
            UserAchievement.objects.update_or_create(
                user=user,
                achievement=achievement,
                defaults={
                    'unlocked': True,
                    'unlocked_at': timezone.now()
                }
            )
