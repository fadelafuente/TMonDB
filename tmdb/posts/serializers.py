from django.core.exceptions import ValidationError
from rest_framework import serializers

from .models import Post
from articles.serializers import ArticleSerializer, ArticleCreatorSerializer

MAX_POST_LENGTH = 240

class PostSerializer(serializers.ModelSerializer):
    article = ArticleSerializer()

    class Meta:
        model = Post
        fields = '__all__'

    def check_content(self):
        content = self.validated_data.get('content')

        if content and len(content) > MAX_POST_LENGTH:
            raise ValidationError('This post is too long')
    
    def is_valid(self, *, raise_exception=False):
        if super().is_valid(raise_exception=raise_exception):
            self.check_content()
            return True
        return False
    
class PostScrollSerializer(PostSerializer):
    likes_count = serializers.IntegerField()
    reposts_count = serializers.IntegerField()
    comments_count = serializers.IntegerField()
    article = ArticleCreatorSerializer()

    class Meta:
        model = Post
        fields = ('id', 'content', 'posted_date', 'comments_count', 'article',
                  'likes_count', 'reposts_count', 'parent', 'is_reply')
        
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        article = representation.pop('article')

        for key, value in article.items():
            representation[key] = value

        return representation
