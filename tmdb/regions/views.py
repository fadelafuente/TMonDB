from .models import *
from .serializers import *

from articles.views import BaseArticleViewSet

class TMonDBRegionViewset(BaseArticleViewSet):
    serializer_class = RegionSerializer
    ordering_fields = ('id', 'name')
    ordering = ('id')
    search_fields = ['name', 'description', 'article__creator__username']
    model = Region

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return RetrieveRegionSerializer
        elif self.action == 'list':
            return RegionScrollSerializer
        return self.serializer_class