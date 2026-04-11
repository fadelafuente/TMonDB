from django.db import models

from articles.serializers import ModelWithArticleSerializer, ModelScrollWithArticleSerializer
from .models import Ability

class AbilitySerializer(ModelWithArticleSerializer):
    model = Ability

    class Meta:
        model = Ability
        fields = '__all__'
        indexes = [models.Index(fields=['name', 'effect'])]

class AbilityScrollSerializer(ModelScrollWithArticleSerializer, AbilitySerializer):
    pass

class MinimumAbilitySerializer(AbilitySerializer):
    class Meta(AbilitySerializer.Meta):
        model = Ability
        fields = ['id', 'name', 'effect']