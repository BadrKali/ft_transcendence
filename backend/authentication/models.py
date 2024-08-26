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
    
    def set_avatar_from_url(self, image_url):
        from urllib import request
        from django.core.files import File
        import os
        result = request.urlretrieve(image_url)
        self.avatar.save(
            os.path.basename(image_url),
            File(open(result[0], 'rb'))
        )

    def __str__(self) -> str:
        return self.username