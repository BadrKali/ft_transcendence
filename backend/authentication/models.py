from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.


class User(AbstractUser):
    email = models.EmailField(unique=True)
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    api_42_id = models.CharField(max_length=255, unique=True)
    
    def __str__(self) -> str:
        return self.username