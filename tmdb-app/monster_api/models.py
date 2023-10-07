from django.db import models

# Create your models here.
class Monster(models.Model):
    name = models.CharField(max_length=30)
    species = models.CharField(max_length=100)
    abilities = models.CharField(max_length=30)

