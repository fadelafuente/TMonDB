from django.db import transaction
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response

from articles.mixins import BulkUpdateOrCreateMixin
from .models import *
from .serializers import TypeSerializer, TypeModifierSerializer, ModifierUpdateSerializer

class TypeBulkUpdateOrCreateMixin(BulkUpdateOrCreateMixin):
    @transaction.atomic
    @action(detail=False, methods=['patch'])
    def bulk_update(self, request, *args, **kwargs):
        if 'types' not in request.data or 'type_advantages' not in request.data:
            return Response(status=status.HTTP_400_BAD_REQUEST, data={'detail': 'Request is missing types or modifiers data.'})

        update_types_serializer, create_types_serializer = self.bulk_update_or_create_helper(Type, request.data['types'], request.user)

        types_dict = self.flatten_list_of_dicts(update_types_serializer.data + create_types_serializer.data)
        type_advantages_data = self.set_advantage_ids(types_dict, request.data['type_advantages'])

        update_modifiers_serializer, create_modifiers_serializer = self.bulk_update_or_create_helper(TypeModifier, type_advantages_data)

        data = {'types': update_types_serializer.data + create_types_serializer.data, 'type_modifiers': update_modifiers_serializer.data + create_modifiers_serializer.data}
        return Response(data=data, status=status.HTTP_200_OK)

    '''
        Helper Methods
    '''
    def get_bulk_create_serializer(self, obj_model, data):
        if obj_model is self.model:
            return TypeSerializer(data=data, many=True)
        return TypeModifierSerializer(data=data, many=True)

    def get_bulk_update_serializer(self, obj_model, instance, data):
        if obj_model is self.model:
            return self.get_serializer(instance, data=data, many=True, partial=True)
        return ModifierUpdateSerializer(instance, data=data, many=True, partial=True)