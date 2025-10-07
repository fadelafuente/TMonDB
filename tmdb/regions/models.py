from django.db import models
from articles.models import Article, ArticleManager
from monsters.models import Monster
from typings.models import Type
from moves.models import Move
from worlds.models import World
from django.contrib.auth import get_user_model

UserModel = get_user_model()

class RegionManager(ArticleManager):
    pass

class Region(models.Model):
    name = models.CharField(max_length=30, unique=True)
    monsters = models.ManyToManyField(Monster, related_name='regions', blank=True)
    types = models.ManyToManyField(Type, related_name='regions', blank=True)
    moves = models.ManyToManyField(Move, related_name='regions', blank=True)
    map_url = models.CharField(max_length=300, blank=True, null=True)
    description = models.CharField(max_length=2000, blank=True, null=True)
    # authorized_users = models.ManyToManyField(UserModel, related_name='authorized_regions')
    article = models.OneToOneField(Article, related_name='region', on_delete=models.CASCADE, null=True, blank=True)
    world = models.ForeignKey(World, related_name='regions', blank=True, null=True, on_delete=models.SET_NULL)

    objects = RegionManager()

class Gallery(models.Model):
    image_url = models.CharField(max_length=300)
    image_description = models.CharField(max_length=300)
    region = models.ForeignKey(Region, on_delete=models.CASCADE, related_name='gallery')