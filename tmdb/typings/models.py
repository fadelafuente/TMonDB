from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone

UserModel = get_user_model()

class Type(models.Model):
    creator = models.ForeignKey(UserModel, blank=True, null=True, on_delete=models.CASCADE, related_name="types")
    name = models.CharField(max_length=30)
    date_created = models.DateTimeField(default=timezone.now, null=False)
    locked = models.BooleanField(default= False)


'''
    NOTE: Here so I can figure out how the json data for type advantage would look like.
    {
        "fire": {
            "attacking_advantage": {
                "fire": 0.5,
                "water": 0.5,
                "grass" : 2.0
            },
            "defending_advantage": {
                "fire": 0.5,
                "water": 2.0,
                "grass": 0.5
            }
        }
    }

    need to figure out if referenced type for attacking/defending type would be the name, or the id
    of that type.
    "attacking_advantage": {
        "fire": 0.5,
        "water": 0.5,
        "grass" : 2.0
    }

    OR

    "attacking_advantage": {
        1: 0.5,
        2: 0.5,
        3 : 2.0
    }
'''
class TypeAdvantage(models.Model):
    attacking_type = models.ManyToManyField(Type, related_name='attacking_advantage')
    defending_type = models.ManyToManyField(Type, related_name='defending_advantage')
    multiplier = models.DecimalField(max_digits=2, decimal_places=1)
