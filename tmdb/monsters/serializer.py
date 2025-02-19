import re
from rest_framework import serializers

from articles.serializers import ArticleCreatorSerializer, ModelWithArticleSerializer
from .models import *

class MonsterSerializer(ModelWithArticleSerializer):
    def validate_name(self, name):
        regex = re.compile(r'^[a-zA-Z0-9À-ÖØ-öø-ÿ\'-]+$')
        if(regex.match(name) == None):
                raise serializers.ValidationError('Monster name is invalid.')
        return name
        
    def validate(self, attrs):
         if 'name' in attrs and attrs['name'] is not None:
            attrs['name'] = attrs['name'][0].upper() + attrs['name'][1:]
            
         return super().validate(attrs)
    
    model = Monster

    class Meta:
        model = Monster
        fields = '__all__'

class RetrieveMonsterSerializer(MonsterSerializer):
    likes_count = models.IntegerField()
    reposts_count = models.IntegerField()
    comments_count = models.IntegerField()
    article = ArticleCreatorSerializer()

class MonsterScrollSerializer(RetrieveMonsterSerializer):
    class Meta(RetrieveMonsterSerializer.Meta):
        fields = ['likes_count', 'repost_count', 'comments_count', 'article',
                  'name', 'description', 'species', 'types']