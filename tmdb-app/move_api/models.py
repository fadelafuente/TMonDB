from django.db import models
# from TypeApi.models import Type

# Create your models here.
class Move(models.Model):
    CATEGORIES = [
        ("PH", "Physical"),
        ("SP", "Special"),
        ("ST", "Status"),
    ]

    name = models.CharField(max_length=30)
    # type = models.ForeignKey(Type)
    description = models.CharField(max_length=300)
    damage = models.IntegerField()
    accuracy = models.IntegerField()
    priority = models.IntegerField()
    use_limit = models.IntegerField()
    category = models.CharField(
        max_length=2,
        choices=CATEGORIES,
        default="PH")
    contact = models.BooleanField()
    # synergy_type = models.ForeignKey(Type)
    # synergy_description = models.CharField(max_length=300)
    
