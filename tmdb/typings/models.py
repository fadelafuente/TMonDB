from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone

UserModel = get_user_model()

class Type(models.Model):
    creator = models.ForeignKey(UserModel, blank=True, null=True, on_delete=models.CASCADE, related_name="types")
    name = models.CharField(max_length=30)
    date_created = models.DateTimeField(default=timezone.now, null=False)
    locked = models.BooleanField(default= False)

class TypeAdvantage(models.Model):
    attacking_type = models.ManyToManyField(Type, related_name='attacking_advantage')
    defending_type = models.ManyToManyField(Type, related_name='defending_advantage')
    multiplier = models.DecimalField(max_digits=2, decimal_places=1)
