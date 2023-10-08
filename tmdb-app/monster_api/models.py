from django.db import models
from django.contrib.auth import get_user_model

UserModel = get_user_model()

# Create your models here.
class Monster(models.Model):
    name = models.CharField(max_length=30)
    species = models.CharField(max_length=100)
    abilities = models.CharField(max_length=30)
    # author = models.ForeignKey(UserModel, on_delete=models.CASCADE, related_name="monster_author")


