from django.contrib.auth import get_user_model
from django.db import transaction
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.mixins import ListModelMixin
from rest_framework.response import Response

from .models import add_annotations
from posts.serializers import PostScrollSerializer
from posts.models import Post

AppUser = get_user_model()

class UpdateFollowingMixin:
    @transaction.atomic
    @action(detail=True, methods=['post'])
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
        instance = self.lookup_object()
        queryset = add_annotations(self.filter_queryset(instance.following.all()), request.user).all()

        return self._get_paginated_response(queryset)
    
class ListFollowersMixin(ListModelMixin):
    @action(detail=True, methods=['get'])
    def followers(self, request, *args, **kwargs):
        instance = self.lookup_object()
        queryset = add_annotations(self.filter_queryset(instance.followers.all()), request.user).all()

        return self._get_paginated_response(queryset) 

class UpdateBlockingMixin:
    @transaction.atomic
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
    @transaction.atomic
    @action(detail=False, methods=['get'])
    def blocking(self, request, *args, **kwargs):
        instance = self.get_instance()
        queryset = instance.blocking.all()

        return self._get_paginated_response(queryset) 
    
class ListLikesMixin:
    @transaction.atomic
    @action(detail=True, methods=['get'])
    def likes(self, request, *args, **kwargs):
        instance = self.lookup_object()
        
        post_queryset = Post.objects.get_annotated_queryset(self.request.user, article__who_liked=instance)
        post_response = self._get_paginated_response_from_serializer_class(post_queryset, PostScrollSerializer)

        data = {}
        if post_response.status_code == 200:
            data = {'likes': post_response.data, 'likes_count': len(post_response.data['results'])}
 
        return Response(data)