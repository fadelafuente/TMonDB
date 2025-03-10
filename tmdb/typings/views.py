from django.db import transaction
from rest_framework import status, filters, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.settings import api_settings

from .models import *
from .serializers import *

class TMonDBTypeViewset(viewsets.ModelViewSet):
    serializer_class = TypeSerializer
    permission_classes = [IsAuthenticated]
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
    
    def get_serializer(self, *args, **kwargs):
        return super().get_serializer(*args, **kwargs)
    
    def perform_destroy(self, instance):
        if instance.creator != self.request.user:
            raise PermissionDenied('You do not have permission to delete this type.')
        return super().perform_destroy(instance)
    
    def perform_update(self, serializer):
        if serializer.instance.creator != self.request.user:
            raise PermissionDenied('You do not have permission to update this type.')
        return super().perform_update(serializer)
    
    def perform_bulk_update(self, serializer):
        serializer.save()
 
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
        self.perform_bulk_update(serializer)
        return serializer
    
    def bulk_update_or_create_helper(self, obj_model, data, user=None):
        if obj_model is Type:
            instance = self.filter_queryset(self.get_queryset())
        else: 
            instance = self.get_modifier_instance(data)

        create_list, update_list = self.get_create_and_update_objects(obj_model, data, user)
        update_serializer = self.bulk_update_helper(obj_model, instance, update_list)
        if getattr(instance, '_prefetched_objects_cache', None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            instance._prefetched_objects_cache = {}

        create_serializer = self.bulk_create_helper(obj_model, create_list)
        return update_serializer, create_serializer
    
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