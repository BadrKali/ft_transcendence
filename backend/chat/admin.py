from django.contrib import admin
from . import models
from django.conf import settings
# Register your models here.
@admin.register(models.Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ['sender_id', 'receiver_id', 'content', 'content_type', 'created_at']
    list_editable = ['content']
    list_per_page = 8

    # def sender_username(self , message):
    #     return message.user.username

# admin.site.register(models.Message, MessageAdmin)