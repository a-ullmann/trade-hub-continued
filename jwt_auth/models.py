from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    email = models.EmailField(max_length=50, unique=True)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    profile_image = models.URLField(
        max_length=300, default=None, blank=True, null=True)
    wallet = models.FloatField(default=5000, blank=True)
