from django.core.exceptions import ValidationError
from rest_framework import serializers

from articles.serializers import ArticleCreatorSerializer, ModelWithArticleSerializer
from .models import Post

MAX_POST_LENGTH = 300

class PostSerializer(ModelWithArticleSerializer):
    model = Post
    
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
    
class PostScrollSerializer(PostSerializer):
    likes_count = serializers.IntegerField()
    reposts_count = serializers.IntegerField()
    comments_count = serializers.IntegerField()
    is_current_user = serializers.BooleanField()
    user_liked = serializers.BooleanField()
    user_reposted = serializers.BooleanField()
    user_commented = serializers.BooleanField()
    article = ArticleCreatorSerializer()        