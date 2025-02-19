from django.db import transaction
from rest_framework import serializers

from .models import Article
from users.serializers import CreatorSerializer

class ArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Article
        fields = '__all__'

class ArticleCreatorSerializer(ArticleSerializer):
    creator = CreatorSerializer()
    
    class Meta(ArticleSerializer.Meta):
        fields = ('id', 'creator', 'date_created')

class ModelWithArticleSerializer(serializers.ModelSerializer):
    article = ArticleSerializer()
    model = None
   
    @transaction.atomic
    def create(self, validated_data):
        article_data = validated_data.pop('article')

        article = Article.objects.create(**article_data)
        instance = self.model.objects.create(**validated_data, article=article)
        
        return instance
