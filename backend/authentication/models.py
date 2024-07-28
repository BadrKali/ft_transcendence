from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.
from user_management.models import Player


class User(AbstractUser):
    email = models.EmailField(unique=True)
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    api_42_id = models.CharField(max_length=255, unique=True, null=True, blank=True)
    is_online = models.BooleanField(default=False)
    def save(self, *args, **kwargs):
        created = self.pk is None
        super().save(*args, **kwargs)
        if created:
            Player.objects.create(user=self)
    def __str__(self) -> str:
        return self.username