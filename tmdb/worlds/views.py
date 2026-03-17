from django.db import transaction

from articles.views import BaseArticleViewSet
from articles.mixins import UpdateExtraTablesMixin
from .models import World, Stat
from .mixins import WorldBulkUpdateOrCreateMixin
from .permissions import IsCreator
from moves.models import Property
from .serializers import WorldSerializer, RetrieveWorldSerializer, WorldScrollSerializer, WorldOnlyAliasesSerializer, StatSerializer
        
class TMonDBWorldViewset(BaseArticleViewSet, WorldBulkUpdateOrCreateMixin, UpdateExtraTablesMixin):
    serializer_class = WorldSerializer
    ordering_fields = ('id', 'name')
    ordering = ('name')
    search_fields = ['name', 'description', 'article__creator__username']
    model = World
    creator_permissions = IsCreator

    def get_serializer_class(self):
        if self.action in ['list']:
            reply = self.request.query_params.get('reply', None)
            if reply == 'only_aliases': return WorldOnlyAliasesSerializer
            return WorldScrollSerializer
        if self.action in ['retrieve']:
            return RetrieveWorldSerializer
        return self.serializer_class
    
    @transaction.atomic
    def create(self, request, *args, **kwargs):
        properties_data = request.data.pop('properties', None)
        stats_data = request.data.pop('stats', None)
        response = super().create(request, *args, **kwargs)

        self.update_or_create_extra_info(response, 201, properties_data=properties_data, stats_data=stats_data)

        return response
    
    @transaction.atomic
    def update(self, request, *args, **kwargs):
        properties_data = request.data.pop('properties', None)
        stats_data = request.data.pop('stats', None)
        response = super().update(request, *args, **kwargs)

        self.update_or_create_extra_info(response, 200, properties_data=properties_data)

        if stats_data and response.status_code == 200:
            serializer = self.perform_update_helper(request, stats_data, world=self.kwargs['pk'], obj_model=Stat, serializer_class=StatSerializer)
            response.data['stats'] = serializer.data
        
        return response
    
    def update_or_create_extra_info(self, response, expected_status_code, **kwargs):
        if response.status_code != expected_status_code: return
        
        if 'properties_data' in kwargs and kwargs['properties_data']:
            properties_data = kwargs['properties_data']
            for property in properties_data:
                property['world'] = response.data['id']
            update_properties_serializer, create_properties_serializer = self.bulk_update_or_create_helper(Property, properties_data) 
            response.data['properties'] = update_properties_serializer.data + create_properties_serializer.data