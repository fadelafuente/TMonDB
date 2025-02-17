from django.contrib.auth import get_user_model
from django.http import Http404
from rest_framework import viewsets, filters, status
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.settings import api_settings

from .mixins import *

AppUser = get_user_model()

class BaseArticleViewSet(LikeModelMixin, RepostModelMixin, viewsets.ModelViewSet):
    permission_classes = api_settings.DEFAULT_PERMISSION_CLASSES
    authentication_classes = api_settings.DEFAULT_AUTHENTICATION_CLASSES
    filter_backends = (filters.OrderingFilter, filters.SearchFilter)
    model = None
       
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            self.permission_classes = (AllowAny,)
        return super().get_permissions()
    
    def str2bool(self, str):
        return str.lower() in ['true']
    
    def get_queryset(self):
        kwargs = {}
        username = self.request.query_params.get('username')
        if username:
            kwargs['article__creator__username'] = username

        return self.model.objects.get_annotated_queryset(self.request.user, **kwargs).all()

    def perform_destroy(self, instance):
        if instance.article.creator != self.request.user:
            raise PermissionDenied('You do not have permission to delete this post.')
        return super().perform_destroy(instance)
    
    def perform_update(self, serializer):
        if serializer.instance.article.creator != self.request.user:
            raise PermissionDenied('You do not have permission to update this post.')
        return super().perform_update(serializer)
    
    def create(self, request, *args, **kwargs):    
        creator = request.user        
        request.data['article'] = {'creator': creator.id}

        return super().create(request, *args, **kwargs)
    
    def retrieve(self, request, *args, **kwargs):
        try:
            return super().retrieve(request, *args, **kwargs)
        except Http404:
            # differentiate between a delete and a block
            model = self.model.objects.filter(id=kwargs['pk'])
            if model.exists():
                return Response(status=status.HTTP_403_FORBIDDEN, data={'current_user_is_blocked': True, 'creator': model.first().article.creator.username})
            return Response(status=status.HTTP_404_NOT_FOUND, data={'detail': f'Post not found'})         