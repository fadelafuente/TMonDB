from django.db import transaction
import re
from rest_framework import serializers

from abilities.serializers import MinimumAbilitySerializer
from articles.serializers import ModelWithArticleSerializer, ModelScrollWithArticleSerializer
from .models import *

class MonsterSerializer(ModelWithArticleSerializer):
    model = Monster

    class Meta:
        model = Monster
        fields = '__all__'

    @transaction.atomic
    def create(self, validated_data):
        abilities_data = validated_data.pop('abilities', None)

        instance = super().create(validated_data)
        
        if abilities_data:
            instance.abilities.set(abilities_data)
        
        return instance

    def validate_name(self, name):
        regex = re.compile(r'^[a-zA-Z0-9À-ÖØ-öø-ÿ\'-]+$')
        name = name[0].upper() + name[1:]
        if regex.match(name) == None:
                raise serializers.ValidationError('Monster name is invalid.')
        return name
    
    def validate_abilities(self, abilities):
        if len(abilities) > 5:
                raise serializers.ValidationError('Monsters can only have 5 abilities.')
        return abilities
    
    def validate_types(self, types):
        if len(types):
            raise serializers.ValidationError('Monsters can only have 2 types.')
        return types

class RetrieveMonsterSerializer(ModelScrollWithArticleSerializer, MonsterSerializer):
    abilities = MinimumAbilitySerializer(many=True)
    hidden_ability = MinimumAbilitySerializer()

class MonsterScrollSerializer(RetrieveMonsterSerializer):
    class Meta(RetrieveMonsterSerializer.Meta):
        fields = ['likes_count', 'repost_count', 'comments_count', 'user_liked', 
                  'user_reposted', 'user_commented' 'article', 'name', 'description', 
                  'species', 'types', 'is_current_user']