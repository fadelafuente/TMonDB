from django.db import transaction
from rest_framework import status, filters, viewsets
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.settings import api_settings

from .models import *
from .serializers import *

class TMonDBTypeViewset(viewsets.ModelViewSet):
    queryset = Type.objects.all()
    serializer_class = TypeSerializer
    permission_classes = api_settings.DEFAULT_PERMISSION_CLASSES
    authentication_classes = api_settings.DEFAULT_AUTHENTICATION_CLASSES
    filter_backends = (filters.OrderingFilter, filters.SearchFilter)
    ordering_fields = ('id', 'name')
    ordering = ('id')
    search_fields = ['name']

    def get_permissions(self):
        if self.action in ['retrieve', 'list']:
            self.permission_classes = (AllowAny,)
        return super().get_permissions()
    
    def get_serializer_class(self):
        if self.action in ['retrieve', 'list']:
            return TypeWithModifiersSerializer
        return self.serializer_class

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        # Create Types
        types_data = self.set_creator(request.data['types'], request.user)
        types_serializer = self.get_serializer(data=types_data, many=True)
        types_serializer.is_valid(raise_exception=True)
        self.perform_create(types_serializer)

        # Setup type advantages to use the new type ids instead of name (name isn't unique)
        try:
            types_dict = self.flatten_list_of_dicts(types_serializer.data)
            type_advantages_data = self.set_advantage_ids(types_dict, request.data['type_advantages'])
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        # Create type advantages
        types_advantages_serializer = TypeModifierSerializer(data=type_advantages_data, many=True)
        types_advantages_serializer.is_valid(raise_exception=True)
        self.perform_create(types_advantages_serializer)

        # return success response with headers
        headers = self.get_success_headers(types_advantages_serializer.data)
        return Response(types_advantages_serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    
    def perform_destroy(self, instance):
        if instance.creator != self.request.user:
            raise PermissionDenied('You do not have permission to delete this type.')
        return super().perform_destroy(instance)
    
    def perform_update(self, serializer):
        if serializer.instance.creator != self.request.user:
            raise PermissionDenied('You do not have permission to update this type.')
        return super().perform_update(serializer)
    
    '''
        Helper Methods
    '''
    def set_creator(self, data, user):
        for t in data:
            t['creator'] = user.id

        return data

    def flatten_list_of_dicts(self, list):
        result = {}

        for item in list:
            result[item['name']] = item['id'] 

        return result
    
    def set_advantage_ids(self, types, type_advantages):
        for type_advantage in type_advantages:
            type_advantage['attacking_type'] = types[type_advantage['attacking_type']]
            type_advantage['defending_type'] = types[type_advantage['defending_type']]

        return type_advantages
    