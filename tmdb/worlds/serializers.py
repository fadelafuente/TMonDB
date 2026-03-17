from django.db import models
from rest_framework import serializers
from rest_framework.exceptions import PermissionDenied

from articles.serializers import ModelWithArticleSerializer, ModelScrollWithArticleSerializer, BaseListSerializer
from .models import World, Stat
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

class StatListSerializer(BaseListSerializer):
    class Meta(BaseListSerializer.Meta):
        model = Stat
    
    def to_internal_value(self, data):
        return super(BaseListSerializer, self).to_internal_value(data)
    
    def get_mappings(self, instance, validated_data):
        obj_mapping = {f'{obj.name}&{obj.abbreviation}&{obj.world}': obj for obj in instance}
        data_mapping = {}
        for item in validated_data:
            if 'name' in item and 'abbreviation' in item and 'world' in item:
                data_mapping[f'{item['name']}&{item['abbreviation']}&{item['world']}'] = item

        return obj_mapping, data_mapping

class StatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stat
        fields = '__all__'
        list_serializer_class = StatListSerializer
    
    def validate_world(self, world):
        request = self.context.get('request', None)
        if request and request.user != world.article.creator:
            raise PermissionDenied('Can only use a world created by the user for stats.')
        
        return world

class StatUpdateSerializer(StatSerializer):
    class Meta(StatSerializer.Meta):
        list_serializer_class = StatListSerializer

class WorldSerializer(ModelWithArticleSerializer):
    model = World

    class Meta:
        model = World
        fields = '__all__'
        indexes = [models.Index(fields=['name', 'description'])]

    def get_stats(self, world):
        return MinimumWorldSerializer(world.stats.all(), many=True, context={'world_instance': world}).data
    
class MinimumWorldSerializer(WorldSerializer):
    class Meta(WorldSerializer.Meta):
        fields = ['id', 'name']

class RetrieveWorldSerializer(ModelScrollWithArticleSerializer, WorldSerializer):
    properties = PropertySerializer(many=True, read_only=True)
    stats = StatSerializer(many=True, read_only=True)
    class Meta(WorldSerializer.Meta):
        read_only_fields=['properties', 'stats']

class WorldScrollSerializer(RetrieveWorldSerializer):
    class Meta(RetrieveWorldSerializer.Meta):
        fields = ['id', 'name', 'description', 'article', 'likes_count', 'reposts_count', 'comments_count', 'user_liked', 
                  'user_reposted', 'user_commented', 'is_current_user']

class WorldWithAliasesSerializer(WorldSerializer):
    properties = PropertySerializer(many=True, read_only=True)

    class Meta(WorldSerializer.Meta):
        fields = ['id', 'name', 'move_alias', 'course_alias', 'evolution_alias', 'ability_alias', 'monster_alias', 'properties', 'stats']
        read_only_fields = ['properties', 'stats']

class WorldOnlyAliasesSerializer(serializers.ModelSerializer):
    class Meta(WorldSerializer.Meta):
        model=World
        fields = ['id', 'name', 'move_alias', 'course_alias', 'evolution_alias', 'ability_alias', 'monster_alias']
