from articles.views import BaseArticleViewSet
from .models import *
from .serializer import *
        
class TMonDBMonsterViewset(BaseArticleViewSet):
    serializer_class = MonsterSerializer
    ordering_fields = ('id', 'name', 'national_id')
    ordering = ('id')
    search_fields = ['name', 'species', 'description']
    model = Monster

    def get_serializer_class(self):
        if self.action in ['retrieve', 'destroy']:
            return RetrieveMonsterSerializer
        elif self.action in ['list']:
            return MonsterScrollSerializer
        return self.serializer_class
