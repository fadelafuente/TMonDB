from django.db import transaction
from rest_framework import status, filters, viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.settings import api_settings

from .mixins import *
from .models import *
from .permissions import *
from .serializers import *

class TMonDBTypeViewset(viewsets.ModelViewSet, TypeBulkUpdateOrCreateMixin):
    model = Type
    serializer_class = TypeSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = api_settings.DEFAULT_AUTHENTICATION_CLASSES
    filter_backends = (filters.OrderingFilter, filters.SearchFilter)
    ordering_fields = ('id', 'name')
    ordering = ('id')
    search_fields = ['name']

    def get_permissions(self):
        if self.action in ['retrieve', 'list']:
             return [permission() for permission in [AllowAny]]
        elif self.action in ['bulk_update', 'destroy', 'update', 'partial_update']:
             return [permission() for permission in [IsAuthenticated, IsCreator]]
        return super().get_permissions()
    
    def get_serializer_class(self):
        if self.action in ['retrieve', 'list']:
            return TypeWithModifiersSerializer
        elif self.action == 'bulk_update':
            return TypeUpdateSerializer
        return self.serializer_class
    
    def get_queryset(self):
        kwargs = {}
        username = self.request.query_params.get('username')
        if username:
            kwargs['creator__username'] = username

        return Type.objects.get_annotated_queryset(self.request.user, **kwargs).all()

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        if 'types' not in request.data or 'type_advantages' not in request.data:
            return Response(status=status.HTTP_400_BAD_REQUEST, data={'detail': 'Request is missing types or modifiers data.'})

        # Create Types
        types_serializer = self.get_serializer(data=request.data['types'], many=True)
        types_serializer.is_valid(raise_exception=True)
        self.perform_create(types_serializer)

        # Setup type advantages to use the new type ids instead of name (name isn't unique)
        types_dict = self.flatten_list_of_dicts(types_serializer.data)
        type_advantages_data = self.set_advantage_ids(types_dict, request.data['type_advantages'])

        # Create type advantages
        type_modifiers_serializer = TypeModifierSerializer(data=type_advantages_data, many=True)
        type_modifiers_serializer.is_valid(raise_exception=True)
        self.perform_create(type_modifiers_serializer)

        # return success response with headers
        headers = self.get_success_headers(type_modifiers_serializer.data)
        return Response(type_modifiers_serializer.data, status=status.HTTP_201_CREATED, headers=headers)
 
    '''
        Helper Methods
    '''
    def flatten_list_of_dicts(self, list):
        result = {}

        for item in list:
            result[item['name']] = item['id'] 

        return result
    
    def set_advantage_ids(self, types, type_advantages):
        for type_advantage in type_advantages:
            if type_advantage['attacking_type'] in types:
                type_advantage['attacking_type'] = types[type_advantage['attacking_type']]
            if type_advantage['defending_type'] in types:
                type_advantage['defending_type'] = types[type_advantage['defending_type']]

        return type_advantages