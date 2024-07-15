from django.contrib import admin
from . import models
# Register your models here.
admin.site.register(models.GameHistory)
admin.site.register(models.Achievement)
admin.site.register(models.PlayerAchievement)
admin.site.register(models.GameSettings)
admin.site.register(models.GameRoom)