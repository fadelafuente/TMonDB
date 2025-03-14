from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.mixins import ListModelMixin
from rest_framework.response import Response

from .models import add_annotations

AppUser = get_user_model()

class UpdateFollowingMixin:
    @action(detail=True, methods=['patch'])
    def follow(self, request, *args, **kwargs):
        user = self.get_object()
        current_user = request.user

        following = current_user.following.filter(id=user.id)
        if following:
            current_user.following.remove(user)
        else:
            current_user.following.add(user)

        return Response(status=status.HTTP_200_OK)
            
class ListFollowingMixin(ListModelMixin):
    @action(detail=True, methods=['get'])
    def following(self, request, *args, **kwargs):
        instance = self.get_object()
        queryset = add_annotations(instance.following, request.user).all()

        return self.get_paginated_queryset(queryset)        
    
class ListFollowersMixin(ListModelMixin):
    @action(detail=True, methods=['get'])
    def followers(self, request, *args, **kwargs):
        instance = self.get_object()
        queryset = add_annotations(instance.followers, request.user).all()

        return self.get_paginated_queryset(queryset) 

class UpdateBlockingMixin: 
    @action(detail=True, methods=['patch'])
    def block(self, request, *args, **kwargs):
        user = self.get_object()
        current_user = request.user
        
        blocking = current_user.blocking.filter(id=user.id)
        if blocking:
            current_user.blocking.remove(user)
        else:
            current_user.blocking.add(user)
            user.following.remove(current_user.id)
            current_user.following.remove(user.id)

        return Response(status=status.HTTP_200_OK)
    
class ListBlockingMixin:
    @action(detail=False, methods=['get'])
    def blocking(self, request, *args, **kwargs):
        instance = self.get_instance()
        queryset = instance.blocking.all()

        return self.get_paginated_queryset(queryset) 