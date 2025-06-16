from django.db import models

from articles.models import Article
from articles.validators import MaxLengthValidator

class World(models.Model):
    name = models.CharField(max_length=50, unique=True, db_index=True)
    description = models.TextField(blank=True, null=True, validators=[MaxLengthValidator(max_length=2048)])
    article = models.OneToOneField(Article, related_name='world', on_delete=models.CASCADE, null=True, blank=True)
    move_alias = models.CharField(max_length=20, blank=True, default='move')
    course_alias = models.CharField(max_length=20, blank=True, default='technical machine')
    evolution_alias = models.CharField(max_length=20, blank=True, default='evolution')
    monster_alias = models.CharField(max_length=20, blank=True, default='monster')
    ability_alias = models.CharField(max_length=20, blank=True, default='ability')
    level_cap = models.IntegerField(default=100, blank=True)
