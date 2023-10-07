from django.db import models

class Type(models.Model):
    name = models.CharField(max_length=30)

class TypeAdvantage(models.Model):
    attacking_type_id = models.ForeignKey(Type, on_delete=models.CASCADE, related_name='attacking_type')
    defending_type_id = models.ForeignKey(Type, on_delete=models.CASCADE, related_name='defending_type')
    multiplier = models.FloatField()

