from django.contrib.auth import get_user_model

from articles.views import BaseArticleViewSet
from .models import Post
from .serializers import PostSerializer, PostScrollSerializer

AppUser = get_user_model()

class PostViewSet(BaseArticleViewSet):
    serializer_class = PostSerializer
    ordering_fields = ('id', 'article__date_created', 'likes_count')
    ordering = ('-article__date_created')
    search_fields = ['content', 'article__creator__username']
    model = Post

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve', 'destroy']:
            return PostScrollSerializer
        return self.serializer_class