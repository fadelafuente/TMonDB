from django.db import models
from monsters.models import Monster
from typings.models import Type
from moves.models import Move
from django.contrib.auth import get_user_model

UserModel = get_user_model()

class Region(models.Model):
    name = models.CharField(max_length=30)
    monsters = models.ManyToManyField(Monster, related_name="regions")
    types = models.ManyToManyField(Type, related_name="regions")
    moves = models.ManyToManyField(Move, related_name="regions")
    map_url = models.CharField(max_length=300)
    description = models.CharField(max_length=1000)
    # authorized_users = models.ManyToManyField(UserModel, related_name="authorized_regions")
    # author = models.ForeignKey(UserModel, on_delete=models.CASCADE, related_name="regions")

class Gallery(models.model):
    image_url = models.CharField(max_length=300)
    image_description = models.CharField(max_length=300)
    region = models.ForeignKey(Region, on_delete=models.CASCADE, related_name="gallery")