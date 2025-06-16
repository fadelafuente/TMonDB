from django.contrib.auth import get_user_model
from django.db import models

from articles.models import Article, ArticleManager
from articles.validators import MaxLengthValidator
from typings.models import Type
from worlds.models import World

UserModel = get_user_model()

class MoveManager(ArticleManager):
    pass

# Create your models here.
class Move(models.Model):
    article = models.OneToOneField(Article, related_name='move', on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(max_length=30)
    type = models.ForeignKey(Type, blank=True, null=True, on_delete=models.SET_NULL, related_name='moves')
    description = models.TextField(validators=[MaxLengthValidator()])
    power = models.IntegerField()
    world = models.ForeignKey(World, null=True, blank=True, related_name='moves', on_delete=models.CASCADE)

    objects = MoveManager()

class Property(models.Model):
    name = models.CharField(max_length=20)
    world = models.ForeignKey(World, related_name='properties', on_delete=models.CASCADE)

class MoveProperty(models.Model):
    move = models.ForeignKey(Move, related_name='move_properties', on_delete=models.CASCADE)
    property = models.ForeignKey(Property, on_delete=models.CASCADE)
    value = models.CharField(max_length=20)

    class Meta:
        indexes = [models.Index(fields=['move', 'property'])]