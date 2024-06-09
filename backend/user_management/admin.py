from django.contrib import admin
from . import models
# Register your models here.




admin.site.register(models.Player)
admin.site.register(models.FriendInvitation)
admin.site.register(models.Notifications)
admin.site.register(models.Friendship)

