from django.db import transaction
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response

class LikeModelMixin:
    @action(detail=True, methods=['patch'])
    def likes(self, request, *args, **kwargs):
        instance = self.get_object()
        user = request.user

        user_liked = instance.article.who_liked.filter(id=user.id)
        if not user_liked:
            instance.article.who_liked.add(user)
        else:
            instance.article.who_liked.remove(user)

        return Response(status=status.HTTP_200_OK)
    
class RepostModelMixin:
    @action(detail=True, methods=['patch'])
    def reposts(self, request, *args, **kwargs):
        instance = self.get_object()
        user = request.user

        user_liked = instance.article.who_reposted.filter(id=user.id)
        if not user_liked:
            instance.article.who_reposted.add(user)
        else:
            instance.article.who_reposted.remove(user)

        return Response(status=status.HTTP_200_OK)
    
class BulkUpdateOrCreateMixin:
    '''
        The following methods need to be overwritten for this bulk update mixin to work properly:
        - bulk_update
        - get_bulk_instance
        - get_bulk_update_serializer
        - get_bulk_create_serializer
    '''
    @transaction.atomic
    @action(detail=False, methods=['patch'])
    def bulk_update(self, request, *args, **kwargs):
        update_types_serializer, create_types_serializer = self.bulk_update_or_create_helper(self.model, request.data['types'], request.user)

        data = {'types': update_types_serializer.data + create_types_serializer.data}
        return Response(data=data, status=status.HTTP_200_OK)

    '''
        Helper Methods
    '''
    def get_bulk_objects(self, obj_model, data):
        if obj_model is self.model:
            instance = self.filter_queryset(self.get_queryset())
        else: 
            instance = self.get_bulk_instance(data)

        for obj in instance:
            self.check_object_permissions(self.request, obj)
        
        return instance
    
    def bulk_create_helper(self, obj_model, data):
        serializer = self.get_bulk_create_serializer(obj_model, data)

        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return serializer
    
    def bulk_update_helper(self, obj_model, instance, data):
        serializer = self.get_bulk_update_serializer(obj_model, instance, data)

        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return serializer
    
    def bulk_update_or_create_helper(self, obj_model, data, user=None):
        instance = self.get_bulk_objects(obj_model, data)
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
    
    def get_bulk_instance(self, data):
        pass

    def get_bulk_update_serializer(self, obj_model, instance, data):
        pass

    def get_bulk_create_serializer(self, obj_model, data):
        pass