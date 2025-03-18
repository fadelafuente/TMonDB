from django.db import transaction
from rest_framework.exceptions import ErrorDetail
from rest_framework.response import Response

from articles.views import BaseArticleViewSet
from .models import Monster
from .serializers import MonsterSerializer, MonsterScrollSerializer, RetrieveMonsterSerializer, EvolutionSerializer
        
class TMonDBMonsterViewset(BaseArticleViewSet):
    serializer_class = MonsterSerializer
    ordering_fields = ('id', 'name', 'national_id')
    ordering = ('id')
    search_fields = ['name', 'species', 'description', 'article__creator__username']
    model = Monster

    def get_serializer_class(self):
        if self.action in ['retrieve', 'destroy']:
            return RetrieveMonsterSerializer
        elif self.action in ['list']:
            return MonsterScrollSerializer
        return self.serializer_class
    
    @transaction.atomic
    def create(self, request, *args, **kwargs):
        evolutions_data = request.data.pop('evolutions', None)
        response = super().create(request, *args, **kwargs)
        
        if evolutions_data and response.status_code == 201:
            try:
                for evolution in evolutions_data:
                    if 'from_monster' not in evolution:
                        evolution['from_monster'] = response.data['id']
                    elif 'to_monster' not in evolution:
                        evolution['to_monster'] = response.data['id']
            except TypeError as e:
                return Response(data=[{'evolutions': ErrorDetail(string='Invalid evolutions - could not be read properly.')}])
        
            serializer = EvolutionSerializer(data=evolutions_data, many=True)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            response.data['evolutions'] = serializer.data

        return response
