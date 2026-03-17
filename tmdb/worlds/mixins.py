from django.db import transaction
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response

from articles.mixins import BulkUpdateOrCreateMixin
from .models import *
from moves.models import Property
from .serializers import WorldSerializer, PropertyUpdateSerializer, PropertySerializer, StatSerializer, StatUpdateSerializer

class WorldBulkUpdateOrCreateMixin(BulkUpdateOrCreateMixin):
    @transaction.atomic
    @action(detail=False, methods=['patch'])
    def bulk_update(self, request, *args, **kwargs):
        if 'worlds' not in request.data or 'properties' not in request.data:
            return Response(status=status.HTTP_400_BAD_REQUEST, data={'detail': 'Request is missing world or properties data.'})

        update_worlds_serializer, create_worlds_serializer = self.bulk_update_or_create_helper(self.model, request.data['world'], request.user)

        worlds_dict = self.flatten_list_of_dicts(update_worlds_serializer.data + create_worlds_serializer.data)
        properties_data = self.set_advantage_ids(worlds_dict, request.data['properties'])

        update_properties_serializer, create_properties_serializer = self.bulk_update_or_create_helper(Property, properties_data)

        data = {'worlds': update_worlds_serializer.data + create_worlds_serializer.data, 'properties': update_properties_serializer.data + create_properties_serializer.data}
        return Response(data=data, status=status.HTTP_200_OK)

    '''
        Helper Methods
    '''    
    def get_bulk_create_serializer(self, obj_model, data):
        if obj_model is self.model:
            return WorldSerializer(data=data, many=True)
        if obj_model is Stat:
            return StatSerializer(data=data, many=True)
        return PropertySerializer(data=data, many=True)
    
    def get_bulk_update_serializer(self, obj_model, instance, data):
        if obj_model is self.model:
            return self.get_serializer(instance, data=data, many=True, partial=True)
        if obj_model is Stat:
            return StatUpdateSerializer(instance, data=data, many=True, partial=True)
        return PropertyUpdateSerializer(instance, data=data, many=True, partial=True)