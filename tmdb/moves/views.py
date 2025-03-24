from articles.views import BaseArticleViewSet
from .models import Monster
from .serializers import MoveSerializer, MoveScrollSerializer
        
class TMonDBMonsterViewset(BaseArticleViewSet):
    serializer_class = MoveSerializer
    ordering_fields = ('id', 'name')
    ordering = ('name')
    search_fields = ['name', 'description', 'article__creator__username']
    model = Monster

    def get_serializer_class(self):
        if self.action in ['list']:
            return MoveScrollSerializer
        return self.serializer_class