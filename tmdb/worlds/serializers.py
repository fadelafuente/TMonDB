from django.db import models
from rest_framework import serializers

from articles.serializers import ModelWithArticleSerializer, ModelScrollWithArticleSerializer, BaseListSerializer
from .models import World
from moves.models import Property

class PropertyListSerializer(BaseListSerializer):
    class Meta(BaseListSerializer.Meta):
        model = Property
    
    def get_data_key(self, data):
        return data['id']
    
    def get_serializer(self):
        return PropertyListSerializer

class PropertySerializer(serializers.ModelSerializer):
    class Meta:
        model = Property
        fields = '__all__'

class PropertyUpdateSerializer(PropertySerializer):
    class Meta(PropertySerializer.Meta):
        list_serializer_class = PropertyListSerializer

class WorldSerializer(ModelWithArticleSerializer):
    model = World

    class Meta:
        model = World
        fields = '__all__'
        indexes = [models.Index(fields=['name', 'description'])]

class RetrieveWorldSerializer(ModelScrollWithArticleSerializer, WorldSerializer):
    properties = PropertySerializer(many=True, read_only=True)
    class Meta(WorldSerializer.Meta):
        read_only_fields=['properties']

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
