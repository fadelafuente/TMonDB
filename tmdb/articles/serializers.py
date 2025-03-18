from collections import OrderedDict
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
    
    def to_representation(self, instance):
        result = super().to_representation(instance)
        if result and 'article' in result:
            result['article']['creator'] = OrderedDict({'id': instance.article.creator.id, 'username': instance.article.creator.username})
        return result
    
class ModelScrollWithArticleSerializer(serializers.ModelSerializer):
    likes_count = serializers.IntegerField()
    reposts_count = serializers.IntegerField()
    comments_count = serializers.IntegerField()
    is_current_user = serializers.BooleanField()
    user_liked = serializers.BooleanField()
    user_reposted = serializers.BooleanField()
    user_commented = serializers.BooleanField()
    article = ArticleCreatorSerializer()
