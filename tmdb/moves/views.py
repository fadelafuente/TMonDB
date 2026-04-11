from articles.views import BaseArticleViewSet
from .models import Move
from .serializers import MoveSerializer, MoveScrollSerializer, RetrieveMoveSerializer
        
class TMonDBMoveViewset(BaseArticleViewSet):
    serializer_class = MoveSerializer
    ordering_fields = ('id', 'name')
    ordering = ('name')
    search_fields = ['name', 'description', 'article__creator__username']
    model = Move

    def get_serializer_class(self):
        if self.action in ['list']:
            return MoveScrollSerializer
        if self.action in ['retrieve']:
            return RetrieveMoveSerializer
        return self.serializer_class