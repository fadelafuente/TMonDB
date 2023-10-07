from django.db import models
from type_api.models import Type

# Create your models here.
class Move(models.Model):
    CATEGORIES = [
        ("PH", "Physical"),
        ("SP", "Special"),
        ("ST", "Status"),
    ]

    name = models.CharField(max_length=30)
    # type = models.ForeignKey(Type, on_delete=models.PROTECT, related_name='type')
    description = models.CharField(max_length=300)
    damage = models.IntegerField()
    accuracy = models.IntegerField()
    priority = models.IntegerField()
    use_limit = models.IntegerField()
    category = models.CharField(
        max_length=2,
        choices=CATEGORIES,
        default="PH",
        null=True)
    contact = models.BooleanField()
    synergy_type = models.ForeignKey(Type, on_delete=models.PROTECT, null=True, related_name='synergy_type')
    synergy_description = models.CharField(max_length=300, null=True)
    
