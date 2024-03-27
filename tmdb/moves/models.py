from django.db import models
from typings.models import Type
from django.contrib.auth import get_user_model

UserModel = get_user_model()

# Create your models here.
class Move(models.Model):
    CATEGORIES = [
        ("PH", "Physical"),
        ("SP", "Special"),
        ("ST", "Status"),
    ]

    # type, created = Type.objects.get_or_create(
    #     name="Grass",
    #     locked=True
    # )

    name = models.CharField(max_length=30)
    type = models.ForeignKey(Type, on_delete=models.PROTECT, related_name='moves')
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
    synergy_type = models.ForeignKey(Type, on_delete=models.PROTECT, null=True, related_name='synergy_moves')
    synergy_description = models.CharField(max_length=300, null=True)
    # author = models.ForeignKey(UserModel, on_delete=models.CASCADE, related_name="moves")
    
