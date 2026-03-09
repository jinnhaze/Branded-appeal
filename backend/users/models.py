from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    # Make email unique
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    
    # We will use email for login in custom behaviors if needed, but keeping username for now standard
    
    def __str__(self):
        return self.username
