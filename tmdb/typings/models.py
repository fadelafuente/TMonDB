from django.contrib.auth import get_user_model
from django.db import models
from django.utils import timezone

from worlds.models import World

UserModel = get_user_model()

class TypeManager(models.Manager):    
    def get_annotated_queryset(self, user, **kwargs):
        if user.is_authenticated:
            queryset = super().get_queryset().exclude(creator_id__in=list(user.blocking.values_list('id', 
                        flat=True))).exclude(creator_id__in=list(user.blocked.values_list('id', flat=True))).filter(**kwargs)
        else:
            queryset = super().get_queryset().filter(**kwargs)
        
        return queryset

class Type(models.Model):
    creator = models.ForeignKey(UserModel, blank=True, null=True, on_delete=models.CASCADE, related_name='types', db_index=True)
    name = models.CharField(max_length=30)
    date_created = models.DateTimeField(default=timezone.now, null=False)
    locked = models.BooleanField(default= False)
    world = models.ForeignKey(World, related_name='types', blank=True, null=True, on_delete=models.CASCADE)

    objects = TypeManager()

class TypeModifier(models.Model):
    attacking_type = models.ForeignKey(Type, related_name='attack_modifiers', on_delete=models.CASCADE, db_index=True)
    defending_type = models.ForeignKey(Type, related_name='defense_modifiers', on_delete=models.CASCADE, db_index=True)
    multiplier = models.DecimalField(default=1.0, max_digits=3, decimal_places=2)
