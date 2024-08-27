from django.db import models
from typings.models import Type
from django.contrib.auth import get_user_model
from django.utils import timezone

UserModel = get_user_model()

class Ability(models.Model):
    creator = models.ForeignKey(UserModel, blank=True, null=True, on_delete=models.CASCADE, related_name="abilities")
    name = models.CharField(max_length=100)
    effect = models.TextField()

# Create your models here.
class Monster(models.Model):
    name = models.CharField(max_length=30, unique=True, null=True)
    date_created = models.DateTimeField(default=timezone.now, blank=True)
    national_id = models.IntegerField(null=True, blank=True)
    species = models.CharField(max_length=100, null=True, blank=True)
    abilities = models.ManyToManyField(Ability, related_name="monsters", blank=True)
    hidden_ability = models.ForeignKey(Ability, related_name="hidden_monsters", null=True, blank=True, on_delete=models.SET_NULL)
    avg_height = models.DecimalField(null=True, blank=True, max_digits=4, decimal_places=1)
    avg_weight = models.DecimalField(null=True, blank=True, max_digits= 6, decimal_places=1)
    types = models.ManyToManyField(Type, related_name="monsters", blank=True)
    creator = models.ForeignKey(UserModel, blank=True, null=True, on_delete=models.CASCADE, related_name="monsters")
