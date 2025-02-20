import re
from rest_framework import serializers

from abilities.serializers import MinimumAbilitySerializer
from articles.serializers import ArticleCreatorSerializer, ModelWithArticleSerializer
from .models import *

class MonsterSerializer(ModelWithArticleSerializer):
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
    
    model = Monster

    class Meta:
        model = Monster
        fields = '__all__'

class RetrieveMonsterSerializer(MonsterSerializer):
    likes_count = serializers.IntegerField()
    reposts_count = serializers.IntegerField()
    comments_count = serializers.IntegerField()
    article = ArticleCreatorSerializer()
    abilities = MinimumAbilitySerializer(many=True)
    hidden_ability = MinimumAbilitySerializer()

class MonsterScrollSerializer(RetrieveMonsterSerializer):
    class Meta(RetrieveMonsterSerializer.Meta):
        fields = ['likes_count', 'repost_count', 'comments_count', 'article',
                  'name', 'description', 'species', 'types']