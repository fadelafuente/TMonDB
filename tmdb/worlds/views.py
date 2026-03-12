from django.db import transaction

from articles.views import BaseArticleViewSet
from .models import World
from .mixins import WorldBulkUpdateOrCreateMixin
from moves.models import Property
from .serializers import WorldSerializer, RetrieveWorldSerializer, WorldScrollSerializer, WorldOnlyAliasesSerializer
        
class TMonDBWorldViewset(BaseArticleViewSet, WorldBulkUpdateOrCreateMixin):
    serializer_class = WorldSerializer
    ordering_fields = ('id', 'name')
    ordering = ('name')
    search_fields = ['name', 'description', 'article__creator__username']
    model = World

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
        response = super().create(request, *args, **kwargs)

        if response.status_code == 201:
            for property in properties_data:
                property['world'] = response.data['id']
            update_properties_serializer, create_properties_serializer = self.bulk_update_or_create_helper(Property, properties_data) 
            response.data['properties'] = update_properties_serializer.data + create_properties_serializer.data

        return response
    
    @transaction.atomic
    def update(self, request, *args, **kwargs):
        properties_data = request.data.pop('properties', None)
        response = super().update(request, *args, **kwargs)

        if response.status_code == 200:
            for property in properties_data:
                property['world'] = response.data['id']
            update_properties_serializer, create_properties_serializer = self.bulk_update_or_create_helper(Property, properties_data) 
            response.data['properties'] = update_properties_serializer.data + create_properties_serializer.data
        
        return response