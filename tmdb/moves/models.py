from django.contrib.auth import get_user_model
from django.core.validators import RegexValidator
from django.db import models

from articles.models import Article, ArticleManager
from articles.validators import MaxLengthValidator
from typings.models import Type

UserModel = get_user_model()

class MoveManager(ArticleManager):
    pass

# Create your models here.
class Move(models.Model):
    properties_regex = r'^{("[a-zA-Z0-9%\s\']{1,20}":\s("[a-zA-Z0-9%.,;:\s\']{1,256}"),\s){0,9}("[a-zA-Z0-9%\s\']{1,20}":\s("[a-zA-Z0-9%.,;:\s\']{1,256}"))}$'
    article = models.OneToOneField(Article, related_name='move', on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(max_length=30)
    type = models.ForeignKey(Type, on_delete=models.SET_NULL, related_name='moves', null=True, blank=True)
    description = models.TextField(validators=[MaxLengthValidator()])
    power = models.IntegerField()
    properties = models.TextField(null=True, blank=True, validators=[MaxLengthValidator(max_length=2831), RegexValidator(properties_regex)])

    objects = MoveManager()