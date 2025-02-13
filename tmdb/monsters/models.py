from django.contrib.auth import get_user_model
from django.db import models
from django.utils import timezone

from articles.models import Article, ArticleManager
from typings.models import Type

UserModel = get_user_model()

class Ability(models.Model):
    name = models.CharField(max_length=100)
    effect = models.TextField()
    article = models.OneToOneField(Article, related_name='ability', on_delete=models.CASCADE, null=True, blank=True)

class MonsterManager(ArticleManager):
    pass

# Create your models here.
class Monster(models.Model):
    name = models.CharField(max_length=30, unique=True)
    date_created = models.DateTimeField(default=timezone.now, blank=True)
    article = models.OneToOneField(Article, related_name='monster', on_delete=models.CASCADE, null=True, blank=True)
    national_id = models.IntegerField(null=True, blank=True)
    species = models.CharField(max_length=100, null=True, blank=True)
    avg_weight = models.DecimalField(null=True, blank=True, max_digits=6, decimal_places=1)
    avg_height = models.DecimalField(null=True, blank=True, max_digits=4, decimal_places=1)
    types = models.ManyToManyField(Type, related_name='monsters', blank=True)
    abilities = models.ManyToManyField(Ability, related_name='monsters', blank=True)
    hidden_ability = models.ForeignKey(Ability, related_name='hidden_monsters', null=True, blank=True, on_delete=models.SET_NULL)
    description = models.TextField(blank=True, null=True)
    etymology = models.TextField(blank=True, null=True)

    objects = MonsterManager()