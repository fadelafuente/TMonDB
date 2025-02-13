from django.db import transaction
from rest_framework import serializers


from articles.serializers import ArticleCreatorSerializer, ArticleSerializer
from .models import *

class MonsterSerializer(serializers.ModelSerializer):
    article = ArticleSerializer()

    class Meta:
        model = Monster
        fields = '__all__'

    @transaction.atomic
    def create(self, validated_data):
        article_data = validated_data.pop('article')

        article = Article.objects.create(**article_data)
        instance = Monster.objects.create(**validated_data, article=article)
        
        return instance

class MonsterScrollSerializer(MonsterSerializer):
    likes_count = models.IntegerField()
    reposts_count = models.IntegerField()
    comments_count = models.IntegerField()
    article = ArticleCreatorSerializer()

    class Meta:
        model = Monster
        fields = '__all__'