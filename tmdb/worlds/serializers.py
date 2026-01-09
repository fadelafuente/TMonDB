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
    properties = PropertySerializer(many=True, read_only=True)

class WorldScrollSerializer(RetrieveWorldSerializer):
    class Meta(RetrieveWorldSerializer.Meta):
        fields = ['id', 'name', 'description', 'article', 'likes_count', 'reposts_count', 'comments_count', 'user_liked', 
                  'user_reposted', 'user_commented', 'is_current_user']

class WorldWithAliasesSerializer(WorldSerializer):
    properties = PropertySerializer(many=True, read_only=True)

    class Meta(WorldSerializer.Meta):
        fields = ['id', 'name', 'move_alias', 'course_alias', 'evolution_alias', 'ability_alias', 'monster_alias', 'properties']
        read_only_fields = ['properties']

class WorldOnlyAliasesSerializer(serializers.ModelSerializer):
    class Meta(WorldSerializer.Meta):
        model=World
        fields = ['id', 'name', 'move_alias', 'course_alias', 'evolution_alias', 'ability_alias', 'monster_alias']
