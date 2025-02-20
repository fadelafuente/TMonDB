from django.contrib.auth import get_user_model
from django.db import models

from articles.models import Article, ArticleManager

UserModel = get_user_model()

class AbilityManager(ArticleManager):
    pass

class Ability(models.Model):
    name = models.CharField(max_length=100)
    effect = models.TextField()
    article = models.OneToOneField(Article, related_name='ability', on_delete=models.CASCADE, null=True, blank=True)