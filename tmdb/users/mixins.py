from django.contrib.auth import get_user_model
from django.db.models import Count, Case, When, Q
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

        if user.id == current_user.id:
            return Response(status=status.HTTP_400_BAD_REQUEST, data={'message': 'User cannot follow themselves.'})
        
        following = current_user.following.filter(id=user.id)
        if following:
            current_user.following.remove(user)
        else:
            current_user.following.add(user)

        return Response(status=status.HTTP_200_OK)
            
class ListFollowingMixin(ListModelMixin):
    def get_follow_list_response(self, queryset):
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


    @action(detail=True, methods=['get'])
    def following(self, request, *args, **kwargs):
        instance = self.get_object()
        queryset = add_annotations(instance.following, request.user).all()

        return self.get_follow_list_response(queryset)        
    
class ListFollowersMixin(ListModelMixin):
    @action(detail=True, methods=['get'])
    def followers(self, request, *args, **kwargs):
        instance = self.get_object()
        queryset = add_annotations(instance.followers, request.user).all()

        return self.get_follow_list_response(queryset)   