from django.db import transaction
from rest_framework.permissions import IsAuthenticated

from articles.views import BaseArticleViewSet
from .models import Monster, Evolution, MoveSet
from .permissions import IsCreator
from .serializers import MonsterSerializer, MonsterScrollSerializer, RetrieveMonsterSerializer, EvolutionSerializer, MoveSetSerializer
        
class TMonDBMonsterViewset(BaseArticleViewSet):
    serializer_class = MonsterSerializer
    ordering_fields = ('id', 'name', 'national_id')
    ordering = ('id')
    search_fields = ['name', 'species', 'description', 'article__creator__username']
    model = Monster

    def get_permissions(self):
        if self.action in ['destroy', 'update', 'partial_update']:
             return [permission() for permission in [IsAuthenticated, IsCreator]]
        return super().get_permissions()

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
            for evolution in evolutions_data:
                if 'from_monster' not in evolution:
                    evolution['from_monster'] = response.data['id']
                elif 'to_monster' not in evolution:
                    evolution['to_monster'] = response.data['id']

            serializer = EvolutionSerializer(data=evolutions_data, many=True, context={'request': request})
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            response.data['evolutions'] = serializer.data

        return response
    
    @transaction.atomic
    def update(self, request, *args, **kwargs):
        evolutions_data = request.data.pop('evolutions', None)
        pre_evolutions_data = request.data.pop('pre_evolutions', None)
        moveset_data = request.data.pop('moveset', None)
        response = super().update(request, *args, **kwargs)

        if evolutions_data and response.status_code == 200:
            serializer = self.perform_update_helper(evolutions_data, from_monster=self.kwargs['pk'], obj_model=Evolution, serializer_class=EvolutionSerializer)
            response.data['evolutions'] = serializer.data

        if pre_evolutions_data and response.status_code == 200:
            serializer = self.perform_update_helper(pre_evolutions_data, to_monster=self.kwargs['pk'], obj_model=Evolution, serializer_class=EvolutionSerializer)
            response.data['pre_evolutions'] = serializer.data

        if moveset_data and response.status_code == 200:
            serializer = self.perform_update_helper(moveset_data, monster=self.kwargs['pk'], obj_model = MoveSet, serializer_class=MoveSetSerializer)
            response.data['moveset'] = serializer.data

        return response
    
    def perform_update_helper(self, data, **kwargs):
        serializer_class = kwargs.pop('serializer_class', None)
        instance = self.get_objects(**kwargs)
        serializer = serializer_class(instance, data=data, many=True, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return serializer
    
    def get_objects(self, **kwargs):
        obj_model = kwargs.pop('obj_model', None)
        if obj_model:
            instance = obj_model.objects.filter(**kwargs)

            for obj in instance:
                self.check_object_permissions(self.request, obj)
            
            return instance
        return None