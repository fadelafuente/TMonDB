from django.contrib.auth import get_user_model
from django.http import Http404
from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.settings import api_settings

from .serializers import PostSerializer, PostScrollSerializer
from .models import Post

AppUser = get_user_model()

class LikeModelMixin:
    @action(detail=True, methods=['patch'])
    def like(self, request, pk=None):
        post = self.get_object()
        user = request.user

        post.article.who_liked.add(user)

        return Response(status=status.HTTP_200_OK)
    
class RepostModelMixin:
    @action(detail=True, methods=['patch'])
    def repost(self, request, pk=None):
        post = self.get_object()
        user = request.user

        post.article.who_reposted.add(user)

        return Response(status=status.HTTP_200_OK)
        

class PostViewSet(LikeModelMixin, RepostModelMixin, viewsets.ModelViewSet):
    serializer_class = PostSerializer
    permission_classes = api_settings.DEFAULT_PERMISSION_CLASSES
    authentication_classes = api_settings.DEFAULT_AUTHENTICATION_CLASSES
    filter_backends = (filters.OrderingFilter, filters.SearchFilter)
    ordering_fields = ('id', 'posted_date', 'likes_count')
    ordering = ('-posted_date')
    search_fields = ['content', 'article__creator__username']

    def get_serializer_class(self):
        if self.action == 'create':
            return PostSerializer
        elif self.action in ['list', 'retrieve', 'destroy']:
            return PostScrollSerializer
        return self.serializer_class
       
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            self.permission_classes = (AllowAny,)
        return super().get_permissions()
    
    def str2bool(self, str):
        return str.lower() in ['true']
    
    def get_queryset(self):
        queryset = Post.objects.get_annotated_queryset(self.request.user).all()
        
        username = self.request.query_params.get('username')
        if username: 
            queryset = queryset.filter(article__creator__username=username)

        return queryset

    def perform_destroy(self, instance):
        if instance.article.creator != self.request.user:
            raise PermissionDenied('You do not have permission to delete this post.')
        return super().perform_destroy(instance)
    
    def perform_update(self, serializer):
        path = self.request.path.split("/")[-1]
        if serializer.instance.article.creator != self.request.user and path != 'like':
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
            post = Post.objects.filter(id=kwargs['pk'])
            if post.exists():
                return Response(status=status.HTTP_403_FORBIDDEN, data={"is_blocked": True, "creator": post.first().article.creator.username})
            return Response(status=status.HTTP_404_NOT_FOUND, data={'detail': f'Post not found'})         