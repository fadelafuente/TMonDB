from django.db import models
from rest_framework import serializers

from articles.serializers import ModelWithArticleSerializer, ModelScrollWithArticleSerializer
from .models import World
from moves.models import Property

class PropertySerializer(serializers.ModelSerializer):
    class Meta:
        model = Property
        fields = '__all__'

class WorldSerializer(ModelWithArticleSerializer):
    model = World

    class Meta:
        model = World
        fields = '__all__'
        indexes = [models.Index(fields=['name', 'description'])]

class RetrieveWorldSerializer(ModelScrollWithArticleSerializer, WorldSerializer):
    pass

class WorldScrollSerializer(RetrieveWorldSerializer):
    class Meta(RetrieveWorldSerializer.Meta):
        fields = ['id', 'name', 'description', 'article']
