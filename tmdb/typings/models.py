from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone

UserModel = get_user_model()

class TypeManager(models.Manager):    
    pass

class Type(models.Model):
    creator = models.ForeignKey(UserModel, blank=True, null=True, on_delete=models.CASCADE, related_name="types")
    name = models.CharField(max_length=30)
    date_created = models.DateTimeField(default=timezone.now, null=False)
    locked = models.BooleanField(default= False)


'''
    NOTE: Here so I can figure out how the json data for type advantage would look like.
    {
        types: [{"name": "fire"}, {"name": "water"}, {"name": "grass"}]
        type_advantages: [
            {"attacking_type": "fire", "defending_type": "water", "multiplier": 0.5},
            {"attacking_type": "fire", "defending_type": "grass", "multiplier": 2.0},
            {"attacking_type": "fire", "defending_type": "fire", "multiplier": 0.5},
            ...
        ]
    }

    [
        {
            "name": "fire"
            "attack_modifiers": {}
        }
    ]
'''
class TypeModifier(models.Model):
    attacking_type = models.ForeignKey(Type, related_name='attack_modifiers', on_delete=models.CASCADE)
    defending_type = models.ForeignKey(Type, related_name='defense_modifiers', on_delete=models.CASCADE)
    multiplier = models.DecimalField(default=1.0, max_digits=3, decimal_places=2)
