from django.contrib.auth import get_user_model
from django.db import models

from abilities.models import Ability
from articles.models import Article, ArticleManager
from articles.validators import MaxLengthValidator
from moves.models import Move
from typings.models import Type

UserModel = get_user_model()

class MonsterManager(ArticleManager):
    pass

class Monster(models.Model):
    name = models.CharField(max_length=30, unique=True)
    article = models.OneToOneField(Article, related_name='monster', on_delete=models.CASCADE, null=True, blank=True)
    national_id = models.IntegerField(null=True, blank=True)
    species = models.CharField(max_length=100, null=True, blank=True)
    avg_weight = models.DecimalField(null=True, blank=True, max_digits=6, decimal_places=1)
    avg_height = models.DecimalField(null=True, blank=True, max_digits=4, decimal_places=1)
    types = models.ManyToManyField(Type, related_name='monsters', blank=True)
    abilities = models.ManyToManyField(Ability, related_name='monsters', blank=True)
    hidden_ability = models.ForeignKey(Ability, related_name='hidden_monsters', null=True, blank=True, on_delete=models.SET_NULL)
    description = models.TextField(blank=True, null=True, validators=[MaxLengthValidator(max_length=1024)])
    etymology = models.TextField(blank=True, null=True, validators=[MaxLengthValidator()])
    evolutions = models.ManyToManyField('self', through='Evolution', symmetrical=False, related_name='pre_evolutions', blank=True)
    moveset = models.ManyToManyField(Move, through='MoveSet', symmetrical=False, related_name='monsters', blank=True)

    objects = MonsterManager()

class Evolution(models.Model):
    from_monster = models.ForeignKey(Monster, on_delete=models.CASCADE, related_name='from_monster')
    to_monster = models.ForeignKey(Monster, on_delete=models.CASCADE, related_name='to_monster')
    method = models.CharField(max_length=255)

class MoveSet(models.Model):
    monster = models.ForeignKey(Monster, on_delete=models.CASCADE, related_name='monster')
    move = models.ForeignKey(Move,on_delete=models.CASCADE, related_name='move')
    method = models.CharField(max_length=255)