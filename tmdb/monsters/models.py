from django.db import models
from typings.models import Type
from django.contrib.auth import get_user_model
from django.utils import timezone

UserModel = get_user_model()

# Create your models here.
class Monster(models.Model):
    national_id = models.IntegerField(null=True, blank=True)
    name = models.CharField(max_length=30, unique=True, null=True)
    species = models.CharField(max_length=100)
    abilities = models.CharField(max_length=30)
    types = models.ManyToManyField(Type, related_name="regions")
    creator = models.ForeignKey(UserModel, blank=True, null=True, on_delete=models.CASCADE, related_name="monsters")
    date_joined = models.DateTimeField(default=timezone.now, blank=True)
