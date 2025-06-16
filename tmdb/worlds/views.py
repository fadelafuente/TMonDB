from django.db import transaction

from articles.views import BaseArticleViewSet
from .models import World
from .serializers import WorldSerializer, RetrieveWorldSerializer, WorldScrollSerializer, PropertySerializer
        
class TMonDBWorldViewset(BaseArticleViewSet):
    serializer_class = WorldSerializer
    ordering_fields = ('id', 'name')
    ordering = ('name')
    search_fields = ['name', 'description', 'article__creator__username']
    model = World

    def get_serializer_class(self):
        if self.action in ['list']:
            return WorldScrollSerializer
        if self.action in ['retrieve']:
            return RetrieveWorldSerializer
        return self.serializer_class
    
    @transaction.atomic
    def create(self, request, *args, **kwargs):
        properties_data = request.data.pop('properties', None)
        response = super().create(request, *args, **kwargs)

        if properties_data and response.status_code == 201:
            properties_data = [{**property, 'world': response.data['id']} for property in properties_data]

            serializer = PropertySerializer(data=properties_data, many=True, context={'request': request})
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            response.data['properties'] = serializer.data

        return response