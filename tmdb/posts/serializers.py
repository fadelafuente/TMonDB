from django.core.exceptions import ValidationError
from django.db import transaction
from rest_framework import serializers

from articles.models import Article
from articles.serializers import ArticleSerializer, ArticleCreatorSerializer
from .models import Post

MAX_POST_LENGTH = 300

class PostSerializer(serializers.ModelSerializer):
    article = ArticleSerializer()

    class Meta:
        model = Post
        fields = '__all__'

    def check_content(self):
        content = self.validated_data.get('content')

        if content and len(content) > MAX_POST_LENGTH:
            raise ValidationError(f'Content length too long: {len(content)} characters. Content should have a max of {MAX_POST_LENGTH} characters.')
    
    def is_valid(self, *, raise_exception=False):
        if super().is_valid(raise_exception=raise_exception):
            self.check_content()
            return True
        return False
    
    @transaction.atomic
    def create(self, validated_data):
        article_data = validated_data.pop('article')

        article = Article.objects.create(**article_data)
        instance = Post.objects.create(**validated_data, article=article)
        
        return instance
    
class PostScrollSerializer(PostSerializer):
    likes_count = serializers.IntegerField()
    reposts_count = serializers.IntegerField()
    comments_count = serializers.IntegerField()
    is_current_user = serializers.BooleanField()
    user_liked = serializers.BooleanField()
    user_reposted = serializers.BooleanField()
    user_commented = serializers.BooleanField()
    article = ArticleCreatorSerializer()

    class Meta:
        model = Post
        fields = ('id', 'content', 'posted_date', 'comments_count', 'article',
                  'likes_count', 'reposts_count', 'parent', 'is_reply', 'is_current_user',
                  'user_liked', 'user_reposted', 'user_commented')