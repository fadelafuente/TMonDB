from django.contrib.auth import get_user_model
from django.db import models

from articles.models import Article, ArticleManager
from articles.validators import MaxLengthValidator
from worlds.models import World

UserModel = get_user_model()

class AbilityManager(ArticleManager):
    pass

class Ability(models.Model):
    name = models.CharField(max_length=64)
    effect = models.TextField(validators=[MaxLengthValidator()])
    article = models.OneToOneField(Article, related_name='ability', on_delete=models.CASCADE, null=True, blank=True)
    world = models.ForeignKey(World, related_name='abilities', blank=True, null=True, on_delete=models.CASCADE)
    aura = models.BooleanField(default=False)

    objects = AbilityManager()