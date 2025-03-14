from django.db import transaction
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import *
from .serializers import TypeSerializer, TypeModifierSerializer, ModifierUpdateSerializer

class BulkUpdateOrCreateMixin:
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

    def get_objects(self, obj_model, data):
        if obj_model is Type:
            instance = self.filter_queryset(self.get_queryset())
        else: 
            instance = self.get_modifier_instance(data)

        for obj in instance:
            self.check_object_permissions(self.request, obj)
        
        return instance

    '''
        Helper Methods
    '''
    def bulk_create_helper(self, obj_model, data):
        if obj_model is Type:
            serializer = TypeSerializer(data=data, many=True)
        else: 
            serializer = TypeModifierSerializer(data=data, many=True)

        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return serializer
    
    def bulk_update_helper(self, obj_model, instance, data):
        if obj_model is Type:
            serializer = self.get_serializer(instance, data=data, many=True, partial=True)
        else: 
            serializer = ModifierUpdateSerializer(instance, data=data, many=True, partial=True)

        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return serializer
    
    def bulk_update_or_create_helper(self, obj_model, data, user=None):
        instance = self.get_objects(obj_model, data)
        create_list, update_list = self.get_create_and_update_objects(obj_model, data, user)

        update_serializer = self.bulk_update_helper(obj_model, instance, update_list)
        if getattr(instance, '_prefetched_objects_cache', None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            instance._prefetched_objects_cache = {}

        create_serializer = self.bulk_create_helper(obj_model, create_list)

        return update_serializer, create_serializer
    
    def get_create_and_update_objects(self, obj_model, initial_data, user=None):
        update_list = []
        create_list = []
        for data in initial_data:
            if 'id' in data and obj_model.objects.filter(id=data['id']).exists():
                update_list.append(data)
            else:
                if user:
                    data['creator'] = user.id
                data.pop('id', None)
                create_list.append(data)
        
        return create_list, update_list
    
    def get_modifier_instance(self, data):
        modifier_ids = []
        for item in data:
            if 'id' in item:
                modifier_ids.append(item['id'])
        return TypeModifier.objects.all().filter(id__in=modifier_ids)