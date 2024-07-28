from django.contrib import admin
from . import models

# Register your models here.
@admin.register(models.message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ['sender_id', 'receiver_id', 'content', 'created_at', 'seen']
    list_editable = ['content']
    list_per_page = 8

# Register your models here.
