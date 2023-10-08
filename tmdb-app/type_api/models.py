from django.db import models
from django.contrib.auth import get_user_model

UserModel = get_user_model()

class Type(models.Model):
    name = models.CharField(max_length=30)
    locked = models.BooleanField(default= False)
    # author = models.ForeignKey(UserModel, on_delete=models.CASCADE, related_name="author")

class TypeAdvantage(models.Model):
    attacking_type = models.ForeignKey(Type, on_delete=models.CASCADE, related_name='attacking_type')
    defending_type = models.ForeignKey(Type, on_delete=models.CASCADE, related_name='defending_type')
    multiplier = models.FloatField()

