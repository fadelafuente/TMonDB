from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from rest_framework.permissions import AllowAny, IsAuthenticated

from articles.views import BaseArticleViewSet
from .mixins import RetrievePostParentMixin
from .models import Post
from .serializers import PostSerializer, PostScrollSerializer

AppUser = get_user_model()

class PostViewSet(RetrievePostParentMixin, BaseArticleViewSet):
    serializer_class = PostSerializer
    ordering_fields = ('id', 'article__date_created', 'likes_count')
    ordering = ('-article__date_created')
    search_fields = ['content', 'article__creator__username']
    model = Post

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'parent']:
             return [permission() for permission in [AllowAny]]
        if self.action in ['destroy', 'update', 'partial_update']:
             return [permission() for permission in [IsAuthenticated, self.creator_permissions]]
        return super().get_permissions()

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve', 'destroy', 'parent']:
            return PostScrollSerializer
        return self.serializer_class
    
    def get_kwargs(self):
        kwargs = super().get_kwargs()
        is_reply = self.request.query_params.get("is_reply")
        parent = self.request.query_params.get('parent')

        if is_reply:
            kwargs['parent__isnull'] = False
        if parent:
            kwargs['parent'] = parent

        return kwargs
    
    def get_object_by_parent(self):
        queryset = self.filter_queryset(self.get_queryset())

        lookup_url_kwarg = self.lookup_url_kwarg or self.lookup_field

        assert lookup_url_kwarg in self.kwargs, (
            'Expected view %s to be called with a URL keyword argument '
            'named "%s". Fix your URL conf, or set the `.lookup_field` '
            'attribute on the view correctly.' %
            (self.__class__.__name__, lookup_url_kwarg)
        )

        filter_kwargs = {'article__id': self.kwargs[lookup_url_kwarg]}
        queryset = queryset.filter(**filter_kwargs)
        obj = get_object_or_404(queryset, **filter_kwargs)

        self.check_object_permissions(self.request, obj)

        return obj