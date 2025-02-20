from articles.views import BaseArticleViewSet
from .models import *
from .serializers import *
        
class TMonDBMonsterViewset(BaseArticleViewSet):
    serializer_class = AbilitySerializer
    ordering_fields = ('id', 'name', 'effect')
    ordering = ('id')
    search_fields = ['name', 'effect', 'article__creator__username']
    model = Ability

    def get_serializer_class(self):
        if self.action in ['retrieve', 'list', 'destroy']:
            return AbilityScrollSerializer
        return self.serializer_class
