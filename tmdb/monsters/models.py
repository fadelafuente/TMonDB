from django.db import models
from typings.models import Type
from django.contrib.auth import get_user_model

UserModel = get_user_model()

# Create your models here.
class Monster(models.Model):
    name = models.CharField(max_length=30)
    species = models.CharField(max_length=100)
    abilities = models.CharField(max_length=30)
    types = models.ManyToManyField(Type, related_name="regions")
    # author = models.ForeignKey(UserModel, on_delete=models.CASCADE, related_name="monsters")


