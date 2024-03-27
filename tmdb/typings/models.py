from django.db import models
from django.contrib.auth import get_user_model

UserModel = get_user_model()

class Type(models.Model):
    name = models.CharField(max_length=30)
    locked = models.BooleanField(default= False)
    # author = models.ForeignKey(UserModel, on_delete=models.CASCADE, related_name="types")

class TypeAdvantage(models.Model):
    attacking_type = models.ManyToManyField(Type, related_name='attacking_advantage')
    defending_type = models.ManyToManyField(Type, related_name='defending_advantage')
    multiplier = models.FloatField()

