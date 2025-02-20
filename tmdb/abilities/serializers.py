from rest_framework import serializers

from articles.serializers import ArticleCreatorSerializer, ModelWithArticleSerializer
from .models import *

class AbilitySerializer(ModelWithArticleSerializer):
    class Meta:
        model = Ability
        fields = '__all__'

class AbilityScrollSerializer(AbilitySerializer):
    likes_count = serializers.IntegerField()
    reposts_count = serializers.IntegerField()
    comments_count = serializers.IntegerField()
    article = ArticleCreatorSerializer()

class MinimumAbilitySerializer(AbilitySerializer):
    class Meta(AbilitySerializer.Meta):
        model = Ability
        fields = ['id', 'name', 'effect']